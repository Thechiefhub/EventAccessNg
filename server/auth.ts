import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import {
  buildPasswordResetEmail,
  buildVerifyEmail,
  buildWelcomeEmail,
  sendCheckingEmail,
} from "./emailTemplates";

export const authRouter = express.Router();

// Ephemeral in-memory fallback secret when AUTH_SESSION_SECRET is not set in env
const SESSION_SECRET =
  process.env.AUTH_SESSION_SECRET || crypto.randomBytes(32).toString("hex");

const COOKIE_NAME = "checking_session";
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes for reset & email verification tokens
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

const ALLOWED_ROLES = new Set([
  "Independent organiser",
  "Corporate events team",
  "NGO / Government",
  "Agency",
  "University / Hub",
  "Other",
]);

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  country: string;
  role: string;
  marketingOptIn: boolean;
  emailVerified: boolean;
  createdAt: string;
}

interface ActionToken {
  tokenHash: string;
  userId: string;
  email: string;
  type: "verify" | "reset";
  expiresAt: number;
  used: boolean;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

// In-memory store for Checking auth (complements Supabase Auth in preview/self-hosted environments)
const usersByEmail = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();
const actionTokens = new Map<string, ActionToken>();
const rateBuckets = new Map<string, RateBucket>();

function logAuthEvent(event: string, meta: Record<string, string | boolean | number>) {
  console.info(
    JSON.stringify({
      ts: new Date().toISOString(),
      service: "checking-auth",
      event,
      ...meta,
    })
  );
}

function sanitizeText(value: unknown, maxLen = 120): string {
  if (typeof value !== "string") return "";
  let cleaned = "";
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 32 && code !== 127) {
      cleaned += value[i];
    }
  }
  return cleaned.trim().slice(0, maxLen);
}

function normalizeEmail(value: unknown): string {
  return sanitizeText(value, 254).toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isStrongPassword(password: string): boolean {
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return false;
  }
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, actualSalt, 64).toString("hex");
  return { hash: derived, salt: actualSalt };
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(storedHash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64").toString("utf8");
}

interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

function signSessionToken(user: StoredUser, rememberMe: boolean): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: nowSec,
      exp: nowSec + ttlSec,
    } satisfies SessionPayload)
  );
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", SESSION_SECRET).update(`${header}.${payload}`).digest()
  );
  return `${header}.${payload}.${signature}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const expectedSig = base64UrlEncode(
      crypto.createHmac("sha256", SESSION_SECRET).update(`${header}.${payload}`).digest()
    );
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const decoded = JSON.parse(base64UrlDecode(payload)) as SessionPayload;
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      try {
        result[key] = decodeURIComponent(val);
      } catch {
        result[key] = val;
      }
    }
  }
  return result;
}

function setSessionCookie(res: Response, token: string, rememberMe: boolean) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=None",
    "Partitioned",
  ];
  if (rememberMe) {
    parts.push(`Max-Age=${30 * 24 * 60 * 60}`);
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0`
  );
}

function getClientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function checkRateLimit(key: string, maxAttempts = MAX_FAILED_ATTEMPTS): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (existing.count >= maxAttempts) {
    return { allowed: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function recordRateAttempt(key: string) {
  const now = Date.now();
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

function resetRateAttempts(key: string) {
  rateBuckets.delete(key);
}

function getAppOrigin(req: Request): string {
  if (process.env.CHECKING_APP_URL) {
    try {
      const parsed = new URL(process.env.CHECKING_APP_URL);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.origin;
      }
    } catch {
      // Fallback below
    }
  }
  const rawProto = String(req.headers["x-forwarded-proto"] || req.protocol || "https")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const proto = rawProto === "http" ? "http" : "https";
  const rawHost = String(req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000")
    .split(",")[0]
    .trim();
  const safeHost = /^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(rawHost) ? rawHost : "localhost:3000";
  return `${proto}://${safeHost}`;
}

/**
 * CSRF protection for cookie-authenticated state-changing auth routes.
 * Verifies same-origin Origin header OR explicit X-Requested-With header.
 */
function csrfGuard(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  const requestedWith = req.headers["x-requested-with"];
  if (requestedWith === "CheckingAuth") {
    return next();
  }
  const origin = req.headers.origin;
  const expectedHost = (req.headers["x-forwarded-host"] as string) || req.headers.host;
  if (origin && expectedHost) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === expectedHost) {
        return next();
      }
    } catch {
      // Invalid origin falls through to 403
    }
  }
  return res.status(403).json({ error: "Invalid request origin." });
}

authRouter.use(csrfGuard);

function issueActionToken(user: StoredUser, type: "verify" | "reset"): string {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  actionTokens.set(tokenHash, {
    tokenHash,
    userId: user.id,
    email: user.email,
    type,
    expiresAt: Date.now() + TOKEN_TTL_MS,
    used: false,
  });
  return rawToken;
}

function toPublicUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    country: user.country,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

// POST /api/auth/signup
authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const ip = getClientIp(req);
    const name = sanitizeText(req.body?.name, 100);
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const country = sanitizeText(req.body?.country || "Nigeria", 80);
    const rawRole = sanitizeText(req.body?.role || "Independent organiser", 60);
    const role = ALLOWED_ROLES.has(rawRole) ? rawRole : "Independent organiser";
    const marketingOptIn = Boolean(req.body?.marketingOptIn);

    const rateKey = `signup:${ip}`;
    const limit = checkRateLimit(rateKey, 10);
    if (!limit.allowed) {
      return res.status(429).json({
        error: "Too many signup attempts. Please wait a few minutes and try again.",
      });
    }
    recordRateAttempt(rateKey);

    if (name.length < 2) {
      return res.status(400).json({ error: "Please enter your full name.", field: "name" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address.", field: "email" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include a letter and a number.",
        field: "password",
      });
    }
    if (usersByEmail.has(email)) {
      return res.status(409).json({
        error: "An account with this email already exists. Try signing in instead.",
        field: "email",
      });
    }

    const { hash, salt } = hashPassword(password);
    const newUser: StoredUser = {
      id: `chk_${crypto.randomUUID()}`,
      name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      country,
      role,
      marketingOptIn,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };

    usersByEmail.set(email, newUser);
    usersById.set(newUser.id, newUser);

    const verifyToken = issueActionToken(newUser, "verify");
    const origin = getAppOrigin(req);
    const verifyUrl = `${origin}/verify-email?token=${encodeURIComponent(verifyToken)}`;
    const dashboardUrl = `${origin}/dashboard`;

    const verifyMail = buildVerifyEmail({ name: newUser.name, verifyUrl });
    const welcomeMail = buildWelcomeEmail({ name: newUser.name, dashboardUrl });
    await Promise.all([
      sendCheckingEmail({ to: newUser.email, ...verifyMail }),
      sendCheckingEmail({ to: newUser.email, ...welcomeMail }),
    ]);

    const sessionToken = signSessionToken(newUser, true);
    setSessionCookie(res, sessionToken, true);

    logAuthEvent("signup_success", { userId: newUser.id, country: newUser.country, role: newUser.role });

    return res.status(201).json({
      user: toPublicUser(newUser),
      token: sessionToken,
      requiresVerification: false,
      message: "Account created! Welcome to Checking.",
    });
  } catch {
    return res.status(500).json({
      error: "Something went wrong creating your account. Please try again.",
    });
  }
});

// POST /api/auth/signin
authRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const ip = getClientIp(req);
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const rememberMe = Boolean(req.body?.rememberMe);

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({
        error: "Email or password is incorrect. Please try again.",
      });
    }

    const rateKey = `signin:${ip}:${email}`;
    const limit = checkRateLimit(rateKey, MAX_FAILED_ATTEMPTS);
    if (!limit.allowed) {
      logAuthEvent("signin_rate_limited", { ip });
      return res.status(429).json({
        error: "Too many attempts. Please wait 5 minutes or reset your password.",
        rateLimited: true,
      });
    }

    const user = usersByEmail.get(email);
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      recordRateAttempt(rateKey);
      logAuthEvent("signin_failed", { ip, hasAccount: Boolean(user) });
      return res.status(401).json({
        error: "Email or password is incorrect. Please try again.",
      });
    }

    resetRateAttempts(rateKey);
    const sessionToken = signSessionToken(user, rememberMe);
    setSessionCookie(res, sessionToken, rememberMe);

    logAuthEvent("signin_success", { userId: user.id, rememberMe });

    return res.status(200).json({
      user: toPublicUser(user),
      token: sessionToken,
      message: "Welcome back to Checking.",
    });
  } catch {
    return res.status(500).json({
      error: "Something went wrong. Please check your connection and try again.",
    });
  }
});

// POST /api/auth/forgot-password
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const ip = getClientIp(req);
    const email = normalizeEmail(req.body?.email);

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const rateKey = `forgot:${ip}`;
    const limit = checkRateLimit(rateKey, 8);
    if (!limit.allowed) {
      return res.status(429).json({
        error: "Too many reset requests. Please wait a few minutes before trying again.",
      });
    }
    recordRateAttempt(rateKey);

    const user = usersByEmail.get(email);
    if (user) {
      const resetToken = issueActionToken(user, "reset");
      const resetUrl = `${getAppOrigin(req)}/reset-password?token=${encodeURIComponent(resetToken)}`;
      const resetMail = buildPasswordResetEmail({ resetUrl });
      await sendCheckingEmail({ to: user.email, ...resetMail });
      logAuthEvent("password_reset_requested", { userId: user.id });
    } else {
      logAuthEvent("password_reset_requested", { found: false });
    }

    // Always respond with generic success to prevent account enumeration
    return res.status(200).json({
      ok: true,
      message: `If an account exists for ${email}, you'll receive a reset link in a few minutes.`,
    });
  } catch {
    return res.status(500).json({
      error: "Could not process reset request. Please try again.",
    });
  }
});

// GET /api/auth/reset-password/validate?token=...
authRouter.get("/reset-password/validate", (req: Request, res: Response) => {
  const rawToken = sanitizeText(req.query.token, 200);
  if (!rawToken) {
    return res.status(400).json({ valid: false, error: "Reset token is missing." });
  }
  const record = actionTokens.get(sha256(rawToken));
  if (!record || record.type !== "reset" || record.used || record.expiresAt < Date.now()) {
    return res.status(400).json({
      valid: false,
      error: "This reset link is invalid or has expired. Please request a new one.",
    });
  }
  return res.status(200).json({ valid: true });
});

// POST /api/auth/reset-password
authRouter.post("/reset-password", (req: Request, res: Response) => {
  try {
    const rawToken = sanitizeText(req.body?.token, 200);
    const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

    if (!rawToken) {
      return res.status(400).json({
        error: "This reset link is invalid or has expired. Please request a new one.",
      });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include a letter and a number.",
        field: "password",
      });
    }

    const tokenHash = sha256(rawToken);
    const record = actionTokens.get(tokenHash);
    if (!record || record.type !== "reset" || record.used || record.expiresAt < Date.now()) {
      return res.status(400).json({
        error: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    const user = usersById.get(record.userId);
    if (!user) {
      return res.status(400).json({
        error: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    record.used = true;
    actionTokens.delete(tokenHash);

    logAuthEvent("password_reset_completed", { userId: user.id });

    return res.status(200).json({
      ok: true,
      message: "Password reset. Sign in with your new password.",
    });
  } catch {
    return res.status(500).json({
      error: "Unable to reset password right now. Please try again.",
    });
  }
});

// GET /api/auth/verify-email?token=...
authRouter.get("/verify-email", (req: Request, res: Response) => {
  const rawToken = sanitizeText(req.query.token, 200);
  if (!rawToken) {
    return res.status(400).json({
      verified: false,
      error: "Verification link is invalid or missing.",
    });
  }

  const tokenHash = sha256(rawToken);
  const record = actionTokens.get(tokenHash);
  if (!record || record.type !== "verify" || record.used || record.expiresAt < Date.now()) {
    return res.status(400).json({
      verified: false,
      error: "This verification link is invalid or has expired. Request a fresh link below.",
    });
  }

  const user = usersById.get(record.userId);
  if (!user) {
    return res.status(400).json({
      verified: false,
      error: "Account not found for this verification link.",
    });
  }

  user.emailVerified = true;
  record.used = true;
  actionTokens.delete(tokenHash);

  const sessionToken = signSessionToken(user, true);
  setSessionCookie(res, sessionToken, true);

  logAuthEvent("email_verified", { userId: user.id });

  return res.status(200).json({
    verified: true,
    user: toPublicUser(user),
    token: sessionToken,
    message: "Email verified! Welcome to Checking.",
  });
});

// POST /api/auth/resend-verification
authRouter.post("/resend-verification", async (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const rateKey = `resend:${ip}:${email}`;
  const limit = checkRateLimit(rateKey, 5);
  if (!limit.allowed) {
    return res.status(429).json({
      error: "Too many resend requests. Please wait a few minutes.",
    });
  }
  recordRateAttempt(rateKey);

  const user = usersByEmail.get(email);
  if (user && !user.emailVerified) {
    const verifyToken = issueActionToken(user, "verify");
    const verifyUrl = `${getAppOrigin(req)}/verify-email?token=${encodeURIComponent(verifyToken)}`;
    const verifyMail = buildVerifyEmail({ name: user.name, verifyUrl });
    await sendCheckingEmail({ to: user.email, ...verifyMail });
    logAuthEvent("verification_resent", { userId: user.id });
  }

  return res.status(200).json({
    ok: true,
    message: "If your email still needs verification, a fresh link is on its way.",
  });
});

// POST /api/auth/signout
authRouter.post("/signout", (_req: Request, res: Response) => {
  clearSessionCookie(res);
  logAuthEvent("signout", { ok: true });
  return res.status(200).json({ ok: true });
});

// GET /api/auth/me
authRouter.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies[COOKIE_NAME] || "";
  }

  if (!token) {
    return res.status(200).json({ user: null });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return res.status(200).json({ user: null });
  }

  const stored = usersById.get(payload.sub);
  if (!stored) {
    return res.status(200).json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        emailVerified: true,
      },
    });
  }

  return res.status(200).json({ user: toPublicUser(stored) });
});

// GET /api/auth/oauth/:provider
authRouter.get("/oauth/:provider", (req: Request, res: Response) => {
  const provider = sanitizeText(req.params.provider, 20).toLowerCase();
  if (provider !== "google" && provider !== "apple") {
    return res.status(400).json({ error: "Unsupported OAuth provider." });
  }

  const isConfigured =
    provider === "google"
      ? Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
      : Boolean(process.env.APPLE_CLIENT_ID);

  if (!isConfigured) {
    return res.status(501).json({
      configured: false,
      provider,
      message: `${provider === "google" ? "Google" : "Apple"} sign-in is coming soon — configure OAuth keys in environment settings or sign in with email.`,
    });
  }

  const redirectUri = `${getAppOrigin(req)}/api/auth/oauth/${provider}/callback`;
  const state = crypto.randomBytes(16).toString("hex");
  const authUrl =
    provider === "google"
      ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
          process.env.GOOGLE_CLIENT_ID!
        )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`
      : `https://appleid.apple.com/auth/authorize?client_id=${encodeURIComponent(
          process.env.APPLE_CLIENT_ID!
        )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=name%20email&state=${state}`;

  return res.status(200).json({ configured: true, authUrl });
});

// GET /api/auth/oauth/:provider/callback
authRouter.get("/oauth/:provider/callback", (req: Request, res: Response) => {
  const provider = sanitizeText(req.params.provider, 20).toLowerCase();
  if (provider !== "google" && provider !== "apple") {
    return res.redirect("/signin?error=oauth_provider");
  }
  return res.redirect("/signin?oauth=pending");
});
