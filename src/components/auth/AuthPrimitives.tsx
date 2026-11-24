import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

/* --------------------------------------------------------------------------
   1. Checking Custom Toast Helper (lime accent bar, auto-dismiss 4s)
   -------------------------------------------------------------------------- */
export function showCheckingToast(
  message: string,
  variant: "success" | "error" | "info" = "success"
) {
  const accent =
    variant === "error"
      ? "#FF5C5C"
      : variant === "info"
      ? "#FFB800"
      : "#C8FF00";

  toast(message, {
    duration: 4000,
    style: {
      background: "#141414",
      color: "#F5F0E6",
      border: "1px solid #262626",
      borderLeft: `4px solid ${accent}`,
      borderRadius: "12px",
      fontFamily: "var(--font-satoshi)",
      fontSize: "14px",
      fontWeight: 500,
    },
  });
}

/* --------------------------------------------------------------------------
   2. AuthCard (slide up 12px + fade in over 300ms; optional 4px error shake)
   -------------------------------------------------------------------------- */
interface AuthCardProps {
  children: React.ReactNode;
  shakeKey?: number;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  shakeKey = 0,
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (shakeKey > 0 && !prefersReducedMotion) {
      setShaking(true);
      const t = window.setTimeout(() => setShaking(false), 260);
      return () => window.clearTimeout(t);
    }
  }, [shakeKey, prefersReducedMotion]);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: "var(--auth-card-bg)",
        boxShadow: "var(--auth-shadow)",
      }}
      className={`rounded-[1.25rem] border border-[#262626] p-6 sm:p-8 ${
        shaking ? "auth-shake" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* --------------------------------------------------------------------------
   3. InlineError Banner (Coral, role="alert")
   -------------------------------------------------------------------------- */
export const InlineError: React.FC<{ message?: string | null; className?: string }> = ({
  message,
  className = "",
}) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border border-[#FF5C5C]/50 bg-[#FF5C5C]/10 px-4 py-3 text-sm font-satoshi font-medium text-[#FF5C5C] ${className}`}
    >
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

/* --------------------------------------------------------------------------
   4. TextInput (48px height, lime focus glow, coral error, lime success check)
   -------------------------------------------------------------------------- */
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  staggerIndex?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  success,
  id,
  required,
  staggerIndex = 0,
  className = "",
  ...rest
}) => {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: prefersReducedMotion ? 0 : staggerIndex * 0.06,
      }}
      className="space-y-1.5"
    >
      <label
        htmlFor={inputId}
        className="block font-satoshi text-sm font-medium text-[#F5F0E6]"
      >
        {label}
        {required && <span className="text-[#C8FF00] ml-1" aria-hidden="true">*</span>}
      </label>

      <div className="relative">
        <input
          id={inputId}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`auth-input w-full px-4 ${success ? "pr-11" : ""} ${
            error ? "auth-input-error" : success ? "auth-input-success" : ""
          } ${className}`}
          {...rest}
        />
        {success && !error && (
          <span
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C8FF00]"
            aria-hidden="true"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </span>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-satoshi text-sm font-medium text-[#FF5C5C]"
        >
          {error}
        </p>
      )}
    </motion.div>
  );
};

/* --------------------------------------------------------------------------
   5. PasswordInput (Eye toggle blink + 4-segment strength meter)
   -------------------------------------------------------------------------- */
export function evaluatePasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  if (!password) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (password.length >= 12 || /[^A-Za-z0-9]/.test(password)) score += 1;

  const clamped = Math.max(1, Math.min(4, score)) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, string> = {
    1: "Weak",
    2: "Fair",
    3: "Strong",
    4: "Very strong",
  };
  return { score: clamped, label: labels[clamped] };
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  showStrength?: boolean;
  staggerIndex?: number;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  success,
  showStrength = false,
  id,
  required,
  value = "",
  staggerIndex = 0,
  className = "",
  ...rest
}) => {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const strength = useMemo(
    () => evaluatePasswordStrength(String(value)),
    [value]
  );

  const toggleVisibility = () => {
    setVisible((v) => !v);
    if (!prefersReducedMotion) {
      setBlinking(true);
      window.setTimeout(() => setBlinking(false), 180);
    }
  };

  const segmentColor = (segIdx: number) => {
    if (strength.score === 0 || segIdx > strength.score) return "#262626";
    if (strength.score === 1) return "#FF5C5C";
    if (strength.score === 2) return "#FFB800";
    return "#C8FF00";
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: prefersReducedMotion ? 0 : staggerIndex * 0.06,
      }}
      className="space-y-1.5"
    >
      <label
        htmlFor={inputId}
        className="block font-satoshi text-sm font-medium text-[#F5F0E6]"
      >
        {label}
        {required && <span className="text-[#C8FF00] ml-1" aria-hidden="true">*</span>}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={value}
          className={`auth-input w-full pl-4 pr-12 ${
            error ? "auth-input-error" : success ? "auth-input-success" : ""
          } ${className}`}
          {...rest}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          className="checking-focus absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#A1A1A1] hover:text-[#F5F0E6] transition-colors"
        >
          <span className={blinking ? "auth-eye-blink inline-flex" : "inline-flex"}>
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </span>
        </button>
      </div>

      {showStrength && String(value).length > 0 && (
        <div className="pt-1 space-y-1" aria-live="polite">
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                style={{ backgroundColor: segmentColor(seg) }}
                className={`h-1.5 rounded-full transition-all duration-150 ${
                  strength.score === 4 && seg <= 4 ? "strength-segment-glow" : ""
                }`}
              />
            ))}
          </div>
          <p className="font-satoshi text-xs text-[#A1A1A1] flex items-center justify-between">
            <span>Strength: <strong className="text-[#F5F0E6]">{strength.label}</strong></span>
            <span>Min 8 chars · letter + number</span>
          </p>
        </div>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-satoshi text-sm font-medium text-[#FF5C5C]"
        >
          {error}
        </p>
      )}
    </motion.div>
  );
};

/* --------------------------------------------------------------------------
   6. Dropdown (Searchable or Standard Select, 48px height, finger-friendly)
   -------------------------------------------------------------------------- */
export interface DropdownOption {
  value: string;
  label: string;
  flag?: string;
}

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  searchable?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  staggerIndex?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  searchable = false,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  staggerIndex = 0,
}) => {
  const autoId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <motion.div
      ref={containerRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: prefersReducedMotion ? 0 : staggerIndex * 0.06,
      }}
      className="relative space-y-1.5"
    >
      <label
        htmlFor={autoId}
        className="block font-satoshi text-sm font-medium text-[#F5F0E6]"
      >
        {label}
        {required && <span className="text-[#C8FF00] ml-1" aria-hidden="true">*</span>}
      </label>

      <button
        id={autoId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="auth-input checking-focus w-full px-4 flex items-center justify-between gap-2 text-left disabled:opacity-60"
      >
        <span className="truncate">
          {selected ? (
            <span className="inline-flex items-center gap-2">
              {selected.flag && <span aria-hidden="true">{selected.flag}</span>}
              <span>{selected.label}</span>
            </span>
          ) : (
            <span className="text-[#A1A1A1]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#A1A1A1] shrink-0 transition-transform duration-150 ${
            open ? "rotate-180 text-[#C8FF00]" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-40 mt-1.5 w-full rounded-xl border border-[#262626] bg-[#0F0F0F] shadow-2xl overflow-hidden"
        >
          {searchable && (
            <div className="p-2 border-b border-[#262626]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#A1A1A1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search African country..."
                  autoFocus
                  className="w-full rounded-lg bg-[#141414] border border-[#262626] pl-9 pr-3 py-2 text-sm text-[#F5F0E6] placeholder:text-[#A1A1A1]/60 focus:outline-none focus:border-[#C8FF00]"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#A1A1A1]">No match found.</p>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full px-4 py-2.5 min-h-[44px] flex items-center justify-between gap-2 text-left text-sm font-satoshi transition-colors ${
                      isSelected
                        ? "bg-[#C8FF00]/15 text-[#C8FF00] font-bold"
                        : "text-[#F5F0E6] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 truncate">
                      {opt.flag && <span aria-hidden="true">{opt.flag}</span>}
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* --------------------------------------------------------------------------
   7. SocialLoginButton (Google / Apple — white bg, 48px, hover lime glow)
   -------------------------------------------------------------------------- */
interface SocialLoginButtonProps {
  provider: "google" | "apple";
  onClick: () => void;
  disabled?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="checking-focus w-full min-h-[48px] px-4 rounded-lg bg-[#FFFFFF] text-[#0A0A0A] border-2 border-transparent hover:border-[#C8FF00] hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(200,255,0,0.22)] font-satoshi font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-all duration-150 disabled:opacity-60"
    >
      {provider === "google" ? (
        <>
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
          <span>Continue with Apple</span>
        </>
      )}
    </button>
  );
};

/* --------------------------------------------------------------------------
   8. PrimaryButton (56px lime pill, Cabinet Grotesk 700, sliding arrow)
   -------------------------------------------------------------------------- */
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  loading = false,
  loadingText = "Please wait…",
  children,
  disabled,
  className = "",
  ...rest
}) => {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={`checking-focus group w-full min-h-[56px] px-6 rounded-full bg-[#C8FF00] text-[#0A0A0A] font-cabinet font-bold text-[18px] inline-flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(200,255,0,0.45)] active:scale-[0.99] transition-all duration-150 disabled:opacity-65 disabled:hover:scale-100 ${className}`}
      {...rest}
    >
      <span aria-live="polite" className="inline-flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#0A0A0A]" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
};
