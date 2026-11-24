/**
 * send-team-invite — Sends an HTML invitation email with event stats
 * to a team member using Supabase Auth admin API.
 *
 * Expects JSON body: { inviteId: string }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { inviteId } = await req.json();
    if (!inviteId) {
      return new Response(JSON.stringify({ error: "Missing inviteId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the invite with event details
    const { data: invite, error: inviteError } = await supabase
      .from("event_team_members")
      .select("*, events(name, event_date, city, country)")
      .eq("id", inviteId)
      .single();

    if (inviteError || !invite) {
      return new Response(JSON.stringify({ error: "Invite not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (invite.invited_by !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch attendee stats for the event
    const { data: attendeeData } = await supabase
      .from("attendees")
      .select("id, checked_in")
      .eq("event_id", invite.event_id);

    const totalAttendees = attendeeData?.length || 0;
    const checkedInCount = attendeeData?.filter((a: any) => a.checked_in).length || 0;
    const remainingCount = totalAttendees - checkedInCount;

    const escapeHtml = (input: string) =>
      String(input)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const rawOrigin = req.headers.get("origin") || "";
    let siteUrl = "https://checking.app";
    if (rawOrigin) {
      try {
        const parsedOrigin = new URL(rawOrigin);
        if (parsedOrigin.protocol === "https:" || parsedOrigin.protocol === "http:") {
          siteUrl = parsedOrigin.origin;
        }
      } catch {
        siteUrl = "https://checking.app";
      }
    }

    const acceptUrl = `${siteUrl}/invite/${encodeURIComponent(String(invite.invitation_token || ""))}`;
    const eventName = invite.events?.name || "an event";
    const eventDate = invite.events?.event_date || "";
    const eventLocation = [invite.events?.city, invite.events?.country].filter(Boolean).join(", ");
    const roleName = invite.role === "admin" ? "Admin" : "Registration Staff";

    const safeEventName = escapeHtml(eventName);
    const safeRoleName = escapeHtml(roleName);
    const safeEventDate = escapeHtml(eventDate);
    const safeEventLocation = escapeHtml(eventLocation);
    const safeAcceptUrl = escapeHtml(acceptUrl);

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F5F0E6;font-family:'Segoe UI',Arial,sans-serif;color:#0A0A0A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E6;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5DFD3;box-shadow:0 8px 28px rgba(10,10,10,0.08);">
        <!-- Header -->
        <tr><td style="background:#0A0A0A;padding:28px 24px;text-align:center;">
          <h1 style="color:#F5F0E6;font-size:22px;font-weight:800;letter-spacing:-0.03em;margin:0;">CHECKING<span style="color:#C8FF00;">.</span></h1>
          <p style="color:#A1A1A1;font-size:13px;margin:8px 0 0;">You've been invited to join an event team</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 24px;">
          <h2 style="color:#0A0A0A;font-size:20px;font-weight:800;margin:0 0 14px;">You're invited!</h2>
          <p style="color:#3F3F46;font-size:14px;line-height:1.6;margin:0 0 20px;">
            You've been invited to join <strong style="color:#0A0A0A;">${safeEventName}</strong> as <strong style="color:#6C1EF5;">${safeRoleName}</strong>.
          </p>
          ${safeEventDate || safeEventLocation ? `
          <table style="background:#F5F0E6;border-radius:10px;width:100%;margin-bottom:20px;border:1px solid #E5DFD3;" cellpadding="0" cellspacing="0">
            <tr><td style="padding:12px 16px;">
              ${safeEventDate ? `<p style="color:#3F3F46;font-size:13px;margin:0 0 4px;"><strong>Date:</strong> ${safeEventDate}</p>` : ""}
              ${safeEventLocation ? `<p style="color:#3F3F46;font-size:13px;margin:0;"><strong>Location:</strong> ${safeEventLocation}</p>` : ""}
            </td></tr>
          </table>` : ""}

          <!-- Event Stats -->
          <table style="width:100%;margin-bottom:20px;border-collapse:collapse;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:33%;text-align:center;padding:12px 8px;background:#F5F0E6;border-radius:10px 0 0 10px;">
                <p style="color:#0A0A0A;font-size:22px;font-weight:700;margin:0;">${totalAttendees}</p>
                <p style="color:#71717A;font-size:11px;margin:4px 0 0;text-transform:uppercase;">Registered</p>
              </td>
              <td style="width:33%;text-align:center;padding:12px 8px;background:#F0FDF4;">
                <p style="color:#16A34A;font-size:22px;font-weight:700;margin:0;">${checkedInCount}</p>
                <p style="color:#71717A;font-size:11px;margin:4px 0 0;text-transform:uppercase;">Checked In</p>
              </td>
              <td style="width:33%;text-align:center;padding:12px 8px;background:#FEFCE8;border-radius:0 10px 10px 0;">
                <p style="color:#CA8A04;font-size:22px;font-weight:700;margin:0;">${remainingCount}</p>
                <p style="color:#71717A;font-size:11px;margin:4px 0 0;text-transform:uppercase;">Remaining</p>
              </td>
            </tr>
          </table>

          <p style="color:#3F3F46;font-size:14px;line-height:1.6;margin:0 0 8px;">
            ${invite.role === "admin"
              ? "As an Admin, you'll have full access to upload attendees, manage check-ins, export data, and manage the team."
              : "As Registration Staff, you'll be able to check in attendees at the event. You'll see real-time stats and the full attendee list."}
          </p>
          <p style="color:#3F3F46;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Click the button below to accept the invitation and start working.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${safeAcceptUrl}" style="display:inline-block;background:#C8FF00;color:#0A0A0A;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:700;font-size:14px;">
                Accept Invitation &rarr;
              </a>
            </td></tr>
          </table>
          <p style="color:#71717A;font-size:12px;margin:24px 0 0;text-align:center;">
            This invitation expires in 7 days. If you didn't expect this email, you can safely ignore it.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#0A0A0A;padding:16px 24px;text-align:center;">
          <p style="color:#A1A1A1;font-size:11px;margin:0;">Powered by Checking &ndash; Your event co-pilot.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error: emailError } = await supabase.auth.admin.inviteUserByEmail(
      invite.invited_email,
      {
        data: {
          invitation_token: invite.invitation_token,
          event_id: invite.event_id,
          role: invite.role,
        },
        redirectTo: acceptUrl,
      }
    );

    if (emailError) {
      console.log("inviteUserByEmail note:", emailError.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        acceptUrl,
        emailSent: !emailError,
        message: emailError
          ? "Invitation created! Share this link with the team member."
          : "Invitation email sent successfully!",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-team-invite error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
