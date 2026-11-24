import React, { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthLayout,
  AuthCard,
  TextInput,
  PasswordInput,
  SocialLoginButton,
  PrimaryButton,
  InlineError,
  showCheckingToast,
} from "@/components/auth";

export default function SignIn() {
  const { user, loading, setCheckingSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [hasFieldError, setHasFieldError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={returnTo || "/dashboard"} replace />;
  }

  const handleSocialAuth = async (provider: "google" | "apple") => {
    setFormError(null);
    try {
      const res = await fetch(`/api/auth/oauth/${provider}`);
      const data = await res.json();
      if (res.ok && data.authUrl) {
        window.location.href = data.authUrl;
        return;
      }
      showCheckingToast(
        data.message ||
          `${provider === "google" ? "Google" : "Apple"} sign-in is coming soon — sign in with email below.`,
        "info"
      );
    } catch {
      showCheckingToast("Something went wrong. Please check your connection and try again.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setHasFieldError(false);

    if (!email.trim() || !password) {
      setFormError("Please enter both your email address and password.");
      setHasFieldError(true);
      setShakeKey((k) => k + 1);
      return;
    }

    if (failedAttempts >= 5) {
      setFormError("Too many attempts. Please wait 5 minutes or reset your password.");
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Authenticate against Checking backend (/api/auth/signin)
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "CheckingAuth",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setCheckingSession(data.user, data.token);
        showCheckingToast("Welcome back to Checking.", "success");
        navigate(returnTo || "/dashboard", { replace: true });
        return;
      }

      if (res.status === 429 || data.rateLimited) {
        setFailedAttempts(5);
        setFormError(
          data.error || "Too many attempts. Please wait 5 minutes or reset your password."
        );
        setHasFieldError(true);
        setShakeKey((k) => k + 1);
        return;
      }

      // 2. Fallback check for pre-existing Supabase accounts
      const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!sbError && sbData.session) {
        showCheckingToast("Welcome back to Checking.", "success");
        navigate(returnTo || "/dashboard", { replace: true });
        return;
      }

      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      setHasFieldError(true);
      setFormError(
        nextCount >= 5
          ? "Too many attempts. Please wait 5 minutes or reset your password."
          : "Email or password is incorrect. Please try again."
      );
      setShakeKey((k) => k + 1);
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Sign In"
      headlinePrefix="Welcome "
      headlineOutlined="back"
      headlineSuffix="."
      subhead="Your events, sponsors and check-ins — exactly where you left them."
    >
      <AuthCard shakeKey={shakeKey}>
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/60 px-3 py-1 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00]" aria-hidden="true" />
          <span className="font-satoshi text-xs font-medium text-[#F5F0E6]">
            Welcome back
          </span>
        </div>

        <h1 className="font-cabinet font-extrabold text-[34px] sm:text-[40px] leading-[1.05] tracking-[-0.03em] text-[#F5F0E6]">
          Sign in to Checking
        </h1>
        <p className="mt-2 font-satoshi text-base text-[#A1A1A1]">
          Your events are waiting.
        </p>

        {/* Social login row */}
        <div className="mt-6 space-y-2.5">
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialAuth("google")}
            disabled={submitting}
          />
          <SocialLoginButton
            provider="apple"
            onClick={() => handleSocialAuth("apple")}
            disabled={submitting}
          />
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#262626]" />
          <span className="font-satoshi text-xs uppercase tracking-[0.12em] text-[#A1A1A1]">
            or sign in with email
          </span>
          <div className="h-px flex-1 bg-[#262626]" />
        </div>

        <InlineError message={formError} className="mb-4" />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (hasFieldError) setHasFieldError(false);
            }}
            className={hasFieldError ? "auth-input-error" : ""}
            disabled={submitting}
            required
            staggerIndex={0}
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (hasFieldError) setHasFieldError(false);
            }}
            className={hasFieldError ? "auth-input-error" : ""}
            disabled={submitting}
            required
            staggerIndex={1}
          />

          {/* Remember me + Forgot password row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={submitting}
                className="checking-focus h-4 w-4 rounded border border-[#262626] bg-[#0F0F0F] accent-[#C8FF00]"
              />
              <span className="font-satoshi text-sm font-medium text-[#F5F0E6]">
                Remember me
              </span>
            </label>

            <Link
              to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="checking-focus font-satoshi text-sm font-medium text-[#C8FF00] hover:underline py-2 px-1 rounded"
            >
              Forgot password?
            </Link>
          </div>

          <PrimaryButton
            type="submit"
            loading={submitting}
            loadingText="Signing in…"
          >
            Sign in
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center font-satoshi text-sm text-[#A1A1A1]">
          New to Checking?{" "}
          <Link
            to="/signup"
            className="checking-focus font-bold text-[#C8FF00] hover:underline rounded px-0.5"
          >
            Create an account →
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
