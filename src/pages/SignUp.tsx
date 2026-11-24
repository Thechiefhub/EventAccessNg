import React, { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AFRICAN_COUNTRIES, ORGANISER_ROLES } from "@/lib/africanCountries";
import {
  AuthLayout,
  AuthCard,
  TextInput,
  PasswordInput,
  Dropdown,
  SocialLoginButton,
  PrimaryButton,
  InlineError,
  showCheckingToast,
} from "@/components/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignUp() {
  const { user, loading, setCheckingSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [role, setRole] = useState<string>("Independent organiser");
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={returnTo || "/dashboard"} replace />;
  }

  const validateField = (field: string, value: string): string => {
    if (field === "name" && value.trim().length < 2) {
      return "Please enter your full name.";
    }
    if (field === "email" && !emailPattern.test(value.trim())) {
      return "Please enter a valid email address.";
    }
    if (field === "password") {
      if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        return "Use at least 8 characters with a letter and a number.";
      }
    }
    if (field === "confirmPassword" && value !== password) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

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
          `${provider === "google" ? "Google" : "Apple"} sign-in is coming soon — sign up with email below.`,
        "info"
      );
    } catch {
      showCheckingToast("Something went wrong. Please check your connection and try again.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nextErrors: Record<string, string> = {
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "CheckingAuth",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          country,
          role,
          marketingOptIn,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.field) {
          setFieldErrors((prev) => ({ ...prev, [data.field]: data.error }));
        } else {
          setFormError(data.error || "Could not create account. Please try again.");
        }
        setShakeKey((k) => k + 1);
        return;
      }

      // Opportunistically mirror signup into Supabase Auth if configured
      supabase.auth
        .signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim(), country, organiser_role: role },
          },
        })
        .catch(() => {});

      if (data.requiresVerification) {
        navigate(`/check-email?verify=true&email=${encodeURIComponent(email.trim())}`);
        return;
      }

      if (data.user) {
        setCheckingSession(data.user, data.token);
      }
      try {
        window.sessionStorage.setItem("checking_welcome_confetti", "1");
      } catch {
        // Ignore storage errors
      }
      showCheckingToast("Account created! Welcome to Checking.", "success");
      navigate(returnTo || "/dashboard", { replace: true });
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Sign Up"
      headlinePrefix="Make it "
      headlineOutlined="loud"
      headlineSuffix="."
      subhead="Start planning events that Africa can’t stop talking about. Free to join."
    >
      <AuthCard shakeKey={shakeKey}>
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/60 px-3 py-1 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00]" aria-hidden="true" />
          <span className="font-satoshi text-xs font-medium text-[#F5F0E6]">
            Step 1 of 1
          </span>
        </div>

        <h1 className="font-cabinet font-extrabold text-[34px] sm:text-[40px] leading-[1.05] tracking-[-0.03em] text-[#F5F0E6]">
          Create your account
        </h1>
        <p className="mt-2 font-satoshi text-base text-[#A1A1A1]">
          Free to start. No card required.
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
            or sign up with email
          </span>
          <div className="h-px flex-1 bg-[#262626]" />
        </div>

        <InlineError message={formError} className="mb-4" />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextInput
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Amara Okafor"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (touched.name) {
                setFieldErrors((prev) => ({
                  ...prev,
                  name: validateField("name", e.target.value),
                }));
              }
            }}
            onBlur={() => handleBlur("name", name)}
            error={fieldErrors.name}
            success={touched.name && !fieldErrors.name && name.trim().length >= 2}
            disabled={submitting}
            required
            staggerIndex={0}
          />

          <TextInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="amara@africatechsummit.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) {
                setFieldErrors((prev) => ({
                  ...prev,
                  email: validateField("email", e.target.value),
                }));
              }
            }}
            onBlur={() => handleBlur("email", email)}
            error={fieldErrors.email}
            success={touched.email && !fieldErrors.email && emailPattern.test(email.trim())}
            disabled={submitting}
            required
            staggerIndex={1}
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) {
                setFieldErrors((prev) => ({
                  ...prev,
                  password: validateField("password", e.target.value),
                }));
              }
            }}
            onBlur={() => handleBlur("password", password)}
            error={fieldErrors.password}
            success={
              touched.password &&
              !fieldErrors.password &&
              password.length >= 8 &&
              /[A-Za-z]/.test(password) &&
              /\d/.test(password)
            }
            showStrength
            disabled={submitting}
            required
            staggerIndex={2}
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (touched.confirmPassword) {
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value !== password ? "Passwords do not match." : "",
                }));
              }
            }}
            onBlur={() => handleBlur("confirmPassword", confirmPassword)}
            error={fieldErrors.confirmPassword}
            success={
              touched.confirmPassword &&
              !fieldErrors.confirmPassword &&
              confirmPassword.length >= 8 &&
              confirmPassword === password
            }
            disabled={submitting}
            required
            staggerIndex={3}
          />

          <Dropdown
            label="Country of operation"
            value={country}
            onChange={setCountry}
            options={AFRICAN_COUNTRIES}
            searchable
            disabled={submitting}
            required
            staggerIndex={4}
          />

          <Dropdown
            label="What best describes you?"
            value={role}
            onChange={setRole}
            options={ORGANISER_ROLES.map((r) => ({ value: r, label: r }))}
            disabled={submitting}
            required
            staggerIndex={5}
          />

          {/* Optional tips opt-in */}
          <label className="flex items-start gap-3 pt-1 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              disabled={submitting}
              className="checking-focus mt-0.5 h-5 w-5 rounded border border-[#262626] bg-[#0F0F0F] accent-[#C8FF00] shrink-0"
            />
            <span className="font-satoshi text-sm text-[#A1A1A1] leading-snug">
              Send me event-planning tips and product updates.
            </span>
          </label>

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              loading={submitting}
              loadingText="Creating account…"
            >
              Create account
            </PrimaryButton>
          </div>
        </form>

        <p className="mt-5 text-center font-satoshi text-sm text-[#A1A1A1]">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="checking-focus font-bold text-[#C8FF00] hover:underline rounded px-0.5"
          >
            Sign in →
          </Link>
        </p>

        <p className="mt-4 text-center font-satoshi text-[13px] text-[#A1A1A1]/80 leading-relaxed">
          By signing up you agree to our{" "}
          <Link to="/#footer-legal" className="underline hover:text-[#F5F0E6]">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/#footer-legal" className="underline hover:text-[#F5F0E6]">
            Privacy Policy
          </Link>
          .
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
