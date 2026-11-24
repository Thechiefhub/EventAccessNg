import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AuthLayout,
  AuthCard,
  showCheckingToast,
} from "@/components/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { setCheckingSession } = useAuth();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState(
    "This verification link is invalid or has expired."
  );

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!token) {
        if (active) setStatus("error");
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!active) return;

        if (res.ok && data.verified) {
          if (data.user) {
            setCheckingSession(data.user, data.token);
          }
          setStatus("success");
          showCheckingToast("Email verified! Welcome to Checking.", "success");
          window.setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1200);
        } else {
          setErrorMessage(
            data.error || "This verification link is invalid or has expired."
          );
          setStatus("error");
        }
      } catch {
        if (active) {
          setErrorMessage(
            "Something went wrong verifying your email. Please check your connection."
          );
          setStatus("error");
        }
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [token, navigate, setCheckingSession]);

  return (
    <AuthLayout
      pageTitle="Verify Email"
      headlinePrefix="Almost "
      headlineOutlined="there"
      headlineSuffix="."
      subhead="Verify your email to unlock the full Checking experience."
    >
      <AuthCard className="text-center py-8">
        {status === "verifying" && (
          <div className="space-y-4" aria-live="polite">
            <Loader2 className="w-10 h-10 animate-spin text-[#C8FF00] mx-auto" />
            <h1 className="font-cabinet font-extrabold text-3xl text-[#F5F0E6]">
              Verifying your email…
            </h1>
            <p className="font-satoshi text-sm text-[#A1A1A1]">
              One second while we unlock your Checking workspace.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4" aria-live="polite">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#C8FF00]/15 border-2 border-[#C8FF00] flex items-center justify-center text-[#C8FF00]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-cabinet font-extrabold text-3xl text-[#F5F0E6]">
              Email verified!
            </h1>
            <p className="font-satoshi text-base text-[#A1A1A1]">
              Taking you straight into your Checking dashboard…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FF5C5C]/12 border border-[#FF5C5C]/50 flex items-center justify-center text-[#FF5C5C]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-cabinet font-extrabold text-3xl text-[#F5F0E6]">
                Verification expired
              </h1>
              <p className="font-satoshi text-base text-[#A1A1A1]">
                {errorMessage}
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                to="/check-email?verify=true"
                className="checking-focus w-full min-h-[52px] rounded-full bg-[#C8FF00] text-[#0A0A0A] font-cabinet font-bold text-base inline-flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                Request fresh verification link →
              </Link>
              <Link
                to="/signin"
                className="checking-focus inline-block font-satoshi text-sm font-medium text-[#C8FF00] hover:underline py-1"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
