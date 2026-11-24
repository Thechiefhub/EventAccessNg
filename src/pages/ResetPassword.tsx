import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthLayout,
  AuthCard,
  PasswordInput,
  PrimaryButton,
  InlineError,
  showCheckingToast,
} from "@/components/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [isSupabaseRecovery, setIsSupabaseRecovery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    let active = true;

    // Listen for Supabase PASSWORD_RECOVERY hash flow
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (active && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        setIsSupabaseRecovery(true);
        setTokenValid(true);
        setValidating(false);
      }
    });

    const validateToken = async () => {
      if (window.location.hash.includes("type=recovery")) {
        setIsSupabaseRecovery(true);
        setTokenValid(true);
        setValidating(false);
        return;
      }

      if (token) {
        try {
          const res = await fetch(
            `/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`
          );
          const data = await res.json();
          if (active) {
            setTokenValid(Boolean(res.ok && data.valid));
            setValidating(false);
          }
          return;
        } catch {
          if (active) {
            setTokenValid(false);
            setValidating(false);
          }
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (active) {
        if (data.session) {
          setIsSupabaseRecovery(true);
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
        setValidating(false);
      }
    };

    validateToken();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be at least 8 characters and include a letter and a number.");
      setShakeKey((k) => k + 1);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseRecovery && !token) {
        const { error: sbErr } = await supabase.auth.updateUser({ password });
        if (sbErr) throw sbErr;
      } else {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "CheckingAuth",
          },
          body: JSON.stringify({ token, newPassword: password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "This reset link is invalid or has expired.");
          setShakeKey((k) => k + 1);
          return;
        }
      }

      showCheckingToast("Password reset. Sign in with your new password.", "success");
      navigate("/signin", { replace: true });
    } catch {
      setError("Something went wrong updating your password. Please try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Reset Password"
      headlinePrefix=""
      headlineOutlined="New"
      headlineSuffix=" password."
      subhead="Choose something strong and unique."
    >
      <AuthCard shakeKey={shakeKey}>
        {validating ? (
          <div className="py-10 text-center space-y-3" aria-live="polite">
            <Loader2 className="w-8 h-8 animate-spin text-[#C8FF00] mx-auto" />
            <p className="font-satoshi text-sm text-[#A1A1A1]">
              Validating your reset link…
            </p>
          </div>
        ) : !tokenValid ? (
          <div className="py-4 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FF5C5C]/12 border border-[#FF5C5C]/50 flex items-center justify-center text-[#FF5C5C]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-cabinet font-extrabold text-3xl text-[#F5F0E6]">
                Link invalid or expired
              </h1>
              <p className="font-satoshi text-base text-[#A1A1A1]">
                This reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link
              to="/forgot-password"
              className="checking-focus w-full min-h-[52px] rounded-full bg-[#C8FF00] text-[#0A0A0A] font-cabinet font-bold text-base inline-flex items-center justify-center hover:scale-[1.02] transition-transform"
            >
              Request a new link →
            </Link>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/60 px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00]" aria-hidden="true" />
              <span className="font-satoshi text-xs font-medium text-[#F5F0E6]">
                Secure reset
              </span>
            </div>

            <h1 className="font-cabinet font-extrabold text-[34px] sm:text-[38px] leading-[1.05] tracking-[-0.03em] text-[#F5F0E6]">
              Set a new password
            </h1>
            <p className="mt-2 font-satoshi text-base text-[#A1A1A1]">
              Pick a strong password you haven’t used before.
            </p>

            <InlineError message={error} className="mt-5" />

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <PasswordInput
                label="New password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showStrength
                disabled={submitting}
                required
                staggerIndex={0}
              />

              <PasswordInput
                label="Confirm new password"
                name="confirm"
                autoComplete="new-password"
                placeholder="Repeat new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting}
                required
                staggerIndex={1}
              />

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  loading={submitting}
                  loadingText="Resetting password…"
                >
                  Reset password
                </PrimaryButton>
              </div>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}