import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthLayout,
  AuthCard,
  TextInput,
  PrimaryButton,
  InlineError,
} from "@/components/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();

    if (!emailPattern.test(trimmed)) {
      setError("Please enter a valid email address.");
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "CheckingAuth",
        },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setError(data.error || "Too many attempts. Please wait a few minutes.");
        setShakeKey((k) => k + 1);
        return;
      }

      // Also notify Supabase recovery flow when active
      supabase.auth
        .resetPasswordForEmail(trimmed, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        .catch(() => {});

      // Always show generic success message to protect account privacy
      setSentEmail(trimmed);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Forgot Password"
      headlinePrefix="We’ve "
      headlineOutlined="got"
      headlineSuffix=" you."
      subhead="Enter your email and we’ll send a secure reset link."
    >
      <AuthCard shakeKey={shakeKey}>
        {sentEmail ? (
          <div className="text-center space-y-5 py-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#C8FF00]/15 border border-[#C8FF00]/50 flex items-center justify-center text-[#C8FF00]">
              <MailCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-cabinet font-extrabold text-3xl text-[#F5F0E6]">
                Check your inbox
              </h1>
              <p className="font-satoshi text-base leading-relaxed text-[#A1A1A1]">
                If an account exists for{" "}
                <strong className="text-[#F5F0E6]">{sentEmail}</strong>, you’ll
                receive a reset link in a few minutes. Check spam if you don’t see
                it.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                to={`/check-email?email=${encodeURIComponent(sentEmail)}`}
                className="checking-focus w-full min-h-[48px] rounded-full border border-[#262626] hover:border-[#C8FF00] text-[#F5F0E6] font-satoshi font-bold text-sm inline-flex items-center justify-center transition-colors"
              >
                Didn’t receive it? Resend options
              </Link>
              <Link
                to="/signin"
                className="checking-focus inline-flex items-center justify-center gap-1.5 font-satoshi text-sm font-medium text-[#C8FF00] hover:underline py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/60 px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00]" aria-hidden="true" />
              <span className="font-satoshi text-xs font-medium text-[#F5F0E6]">
                Password recovery
              </span>
            </div>

            <h1 className="font-cabinet font-extrabold text-[34px] sm:text-[38px] leading-[1.05] tracking-[-0.03em] text-[#F5F0E6]">
              Reset your password
            </h1>
            <p className="mt-2 font-satoshi text-base text-[#A1A1A1]">
              Enter the email linked to your Checking account.
            </p>

            <InlineError message={error} className="mt-5" />

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <TextInput
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />

              <PrimaryButton
                type="submit"
                loading={submitting}
                loadingText="Sending reset link…"
              >
                Send reset link
              </PrimaryButton>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="checking-focus inline-flex items-center gap-1.5 font-satoshi text-sm font-medium text-[#C8FF00] hover:underline py-2 px-1 rounded"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
