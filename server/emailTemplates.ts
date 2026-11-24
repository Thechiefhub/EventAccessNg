export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Fallback below
  }
  return "https://checking.app";
}

function wrapEmailLayout(options: {
  preheader: string;
  eyebrow: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footnote?: string;
}): string {
  const safeUrl = options.ctaUrl ? safeHref(options.ctaUrl) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(options.heading)} — Checking</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0A0A0A;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(options.preheader)}</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F5F0E6;padding:36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;background-color:#FFFFFF;border:2px solid #0A0A0A;border-radius:18px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0A0A0A;padding:28px 32px;text-align:left;border-bottom:4px solid #C8FF00;">
              <span style="font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#F5F0E6;text-transform:uppercase;">
                CHECKING<span style="display:inline-block;width:8px;height:8px;border-radius:999px;background-color:#C8FF00;margin-left:4px;vertical-align:middle;"></span>
              </span>
              <p style="margin:6px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#C8FF00;font-weight:700;">
                ${escapeHtml(options.eyebrow)}
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;background-color:#FFFFFF;">
              <h1 style="margin:0 0 16px;font-size:26px;line-height:1.15;font-weight:800;color:#0A0A0A;letter-spacing:-0.02em;">
                ${escapeHtml(options.heading)}
              </h1>
              <div style="font-size:15px;line-height:1.65;color:#333333;">
                ${options.bodyHtml}
              </div>
              ${
                options.ctaLabel && safeUrl
                  ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0 18px;">
                      <tr>
                        <td align="left">
                          <a href="${escapeHtml(safeUrl)}" style="display:inline-block;background-color:#C8FF00;color:#0A0A0A;border:2px solid #0A0A0A;border-radius:999px;padding:14px 28px;font-size:15px;font-weight:800;text-decoration:none;">
                            ${escapeHtml(options.ctaLabel)} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>`
                  : ""
              }
              ${
                options.footnote
                  ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:#666666;">${escapeHtml(options.footnote)}</p>`
                  : ""
              }
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0A0A0A;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#F5F0E6;font-weight:600;">
                Powered by Checking &ndash; Your event co-pilot.
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#A1A1A1;">
                Made in Africa. Built for the world. &middot; noreply@checking.app
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail(params: { name: string; dashboardUrl: string }): Omit<EmailPayload, "to"> {
  const safeName = escapeHtml(params.name || "Organiser");
  return {
    subject: "Welcome to Checking — let's make your next event loud",
    html: wrapEmailLayout({
      preheader: "Your Checking workspace is live. Spark, Chase, Buzz & D-Day are ready.",
      eyebrow: "Welcome aboard",
      heading: `Welcome to Checking, ${params.name || "Organiser"}.`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Hey ${safeName},</p>
        <p style="margin:0 0 14px;">Your workspace is ready. Whether you're shipping a 300-person tech summit in Lagos, a fintech forum in Nairobi, or an awards gala in Accra — Spark, Chase, Buzz, and D-Day are wired and waiting.</p>
        <p style="margin:0;">Jump in and spin up your first event brief in under two minutes.</p>
      `,
      ctaLabel: "Open your workspace",
      ctaUrl: params.dashboardUrl,
      footnote: "Need a live walkthrough? Reply or book a 15-min onboarding session from checking.app.",
    }),
    text: `Welcome to Checking, ${params.name || "Organiser"}!\n\nYour event co-pilot is ready at ${params.dashboardUrl}\n\nPowered by Checking – Your event co-pilot.`,
  };
}

export function buildVerifyEmail(params: { name: string; verifyUrl: string }): Omit<EmailPayload, "to"> {
  const safeName = escapeHtml(params.name || "Organiser");
  return {
    subject: "Verify your email — Checking",
    html: wrapEmailLayout({
      preheader: "Confirm your email address to unlock your Checking workspace.",
      eyebrow: "Email verification",
      heading: "Almost there. Verify your email.",
      bodyHtml: `
        <p style="margin:0 0 14px;">Hi ${safeName},</p>
        <p style="margin:0;">Tap the button below to confirm your email address and unlock the full Checking experience. This verification link expires in <strong>30 minutes</strong>.</p>
      `,
      ctaLabel: "Verify email address",
      ctaUrl: params.verifyUrl,
      footnote: "If you didn't create a Checking account, you can safely ignore this email.",
    }),
    text: `Hi ${params.name || "Organiser"},\n\nVerify your Checking email address (expires in 30 minutes): ${params.verifyUrl}\n\nPowered by Checking – Your event co-pilot.`,
  };
}

export function buildPasswordResetEmail(params: { resetUrl: string }): Omit<EmailPayload, "to"> {
  return {
    subject: "Reset your Checking password",
    html: wrapEmailLayout({
      preheader: "Use this secure link to set a new password for your Checking account.",
      eyebrow: "Account recovery",
      heading: "We've got you. Reset your password.",
      bodyHtml: `
        <p style="margin:0 0 14px;">We received a request to reset the password on your Checking account.</p>
        <p style="margin:0;">Use the button below to pick a strong new password. For your security, this link expires in <strong>30 minutes</strong> and can only be used once.</p>
      `,
      ctaLabel: "Set new password",
      ctaUrl: params.resetUrl,
      footnote: "If you didn't request a password reset, no action is needed — your current password stays active.",
    }),
    text: `Reset your Checking password (expires in 30 minutes): ${params.resetUrl}\n\nPowered by Checking – Your event co-pilot.`,
  };
}

export function buildTeamInviteEmail(params: {
  eventName: string;
  roleName: string;
  eventDate?: string;
  eventLocation?: string;
  acceptUrl: string;
}): Omit<EmailPayload, "to"> {
  const safeEvent = escapeHtml(params.eventName);
  const safeRole = escapeHtml(params.roleName);
  const metaRows = [
    params.eventDate ? `<p style="margin:0 0 4px;"><strong>Date:</strong> ${escapeHtml(params.eventDate)}</p>` : "",
    params.eventLocation ? `<p style="margin:0;"><strong>Location:</strong> ${escapeHtml(params.eventLocation)}</p>` : "",
  ]
    .filter(Boolean)
    .join("");

  return {
    subject: `You're invited to join ${params.eventName} on Checking`,
    html: wrapEmailLayout({
      preheader: `Join the D-Day operations crew for ${params.eventName} as ${params.roleName}.`,
      eyebrow: "D-Day Team Invitation",
      heading: `You're on the crew for ${params.eventName}.`,
      bodyHtml: `
        <p style="margin:0 0 14px;">You've been invited to collaborate on <strong>${safeEvent}</strong> as <strong>${safeRole}</strong>.</p>
        ${metaRows ? `<div style="background:#F5F0E6;border:1px solid #DDD6C8;border-radius:12px;padding:14px 16px;margin:0 0 16px;font-size:14px;">${metaRows}</div>` : ""}
        <p style="margin:0;">Accept your invitation to access live QR check-ins, tier stats, and gate coordination.</p>
      `,
      ctaLabel: "Accept invitation",
      ctaUrl: params.acceptUrl,
      footnote: "This invitation expires in 7 days.",
    }),
    text: `You've been invited to join ${params.eventName} as ${params.roleName} on Checking.\nAccept: ${params.acceptUrl}\n\nPowered by Checking – Your event co-pilot.`,
  };
}

export function buildSponsorFollowUpEmail(params: {
  organiserName: string;
  sponsorName: string;
  eventName: string;
  chaseUrl: string;
}): Omit<EmailPayload, "to"> {
  return {
    subject: `Sponsor follow-up reminder: ${params.sponsorName} (${params.eventName})`,
    html: wrapEmailLayout({
      preheader: `Time to follow up with ${params.sponsorName} for ${params.eventName}.`,
      eyebrow: "Chase · Sponsor Reminder",
      heading: `Follow up with ${params.sponsorName}.`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Hi ${escapeHtml(params.organiserName)},</p>
        <p style="margin:0;">Your scheduled follow-up with <strong>${escapeHtml(params.sponsorName)}</strong> for <strong>${escapeHtml(params.eventName)}</strong> is due today. Open Chase to send your next nudge and keep the deal moving.</p>
      `,
      ctaLabel: "Open Chase pipeline",
      ctaUrl: params.chaseUrl,
    }),
    text: `Reminder: Follow up with ${params.sponsorName} for ${params.eventName} in Checking Chase: ${params.chaseUrl}\n\nPowered by Checking – Your event co-pilot.`,
  };
}

/**
 * Dispatches an email via SendGrid when SENDGRID_API_KEY is configured,
 * or records structured delivery metadata in local/preview environments.
 */
export async function sendCheckingEmail(payload: EmailPayload): Promise<{ delivered: boolean; provider: string }> {
  const fromEmail = process.env.EMAIL_FROM || "noreply@checking.app";
  const sendgridKey = process.env.SENDGRID_API_KEY;

  if (sendgridKey) {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: payload.to }] }],
          from: { email: fromEmail, name: "Checking" },
          subject: payload.subject,
          content: [
            { type: "text/plain", value: payload.text },
            { type: "text/html", value: payload.html },
          ],
        }),
      });
      if (response.ok) {
        return { delivered: true, provider: "sendgrid" };
      }
      console.warn("[Checking Mail] SendGrid returned status:", response.status);
    } catch (err) {
      console.warn("[Checking Mail] Delivery failed, falling back to log:", err instanceof Error ? err.message : "unknown");
    }
  }

  console.info(
    `[Checking Mail] ${new Date().toISOString()} | From: Checking <${fromEmail}> | To: ${payload.to} | Subject: ${payload.subject}`
  );
  return { delivered: false, provider: "preview" };
}
