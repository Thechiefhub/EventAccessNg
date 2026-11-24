import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import {
  AuthLayout,
  AuthCard,
  InlineError,
  showCheckingToast,
} from "@/components/auth";

export default function CheckEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your email address";
  const isVerify = searchParams.get("verify") === "true";

  const [cooldown, setCooldown] = useState(45);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const formattedTimer = `0:${String(cooldown).padStart(2, "0")}`;

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError(null);
    setResending(true);
    try {
      const endpoint = isVerify
        ? "/api/auth/resend-verification"
        : "/api/auth/forgot-password";
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "CheckingAuth",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend right now. Please try again shortly.");
        return;
      }
      setCooldown(45);
      showCheckingToast("A fresh link is on its way to your inbox.", "success");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Check Your Email"
      headlinePrefix="Check your "
      headlineOutlined="inbox"
      headlineSuffix="."
      subhead="We’ve sent you a link — it expires in 30 minutes."
    >
      <AuthCard className="text-center">
        {/* Big Lime Envelope SVG */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#C8FF00]/12 border-2 border-[#C8FF00]/60 flex items-center justify-center text-[#C8FF00] mb-6">
          <Mail className="w-10 h-10" strokeWidth={2} />
        </div>

        <h1 className="font-cabinet font-extrabold text-[34px] sm:text-[38px] leading-[1.05] tracking-[-0.03em] text-[#F5F0E6]">
          Check your inbox
        </h1>

        <p className="mt-3 font-satoshi text-base leading-relaxed text-[#A1A1A1]">
          We’ve sent a link to{" "}
          <strong className="text-[#F5F0E6] break-all">{email}</strong> — it
          expires in 30 minutes.
        </p>

        <p className="mt-3 font-satoshi text-xs text-[#A1A1A1]/80">
          Sent from <span className="text-[#F5F0E6]">noreply@checking.app</span>.
          Check Promotions or Spam if it doesn’t land in a minute.
        </p>

        <InlineError message={error} className="mt-4 text-left" />

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="checking-focus w-full min-h-[50px] px-6 rounded-full border border-[#262626] hover:border-[#C8FF00] text-[#F5F0E6] font-satoshi font-bold text-sm transition-colors disabled:opacity-60 disabled:hover:border-[#262626]"
          >
            {resending
              ? "Resending link…"
              : cooldown > 0
              ? `Resend in ${formattedTimer}`
              : "Resend link"}
          </button>

          <Link
            to={isVerify ? "/signup" : "/forgot-password"}
            className="checking-focus w-full min-h-[48px] px-6 rounded-full border border-transparent hover:border-[#262626] text-[#A1A1A1] hover:text-[#F5F0E6] font-satoshi font-medium text-sm inline-flex items-center justify-center transition-colors"
          >
            Change email
          </Link>
        </div>

        <div className="mt-6 pt-5 border-t border-[#262626]">
          <Link
            to="/signin"
            className="checking-focus inline-flex items-center gap-1.5 font-satoshi text-sm font-medium text-[#C8FF00] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
