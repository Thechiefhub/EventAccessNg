# Checking — Your Event Co-Pilot

**Checking** is an AI-powered event co-pilot built for African organisers across Lagos, Nairobi, Accra, Johannesburg, and Kigali — uniting editorial brutalism with festival and award-show energy across the landing page, authentication suite, and organiser dashboard.

---

## 1. Brand Identity & Typography System

- **Wordmark:** `CHECKING` in **Cabinet Grotesk 800** uppercase with a pulsing electric lime dot (`#C8FF00`).
- **Logo Mark / Favicon:** `public/checking-logo.svg` — minimal ticket stub with a checkmark cutout in `#0A0A0A` and `#C8FF00`.

All fonts load with `display=swap` and `preconnect` in `index.html`:

| Role | Font Family | Fallback | CDN |
| :--- | :--- | :--- | :--- |
| **Hero & Countdown Display** | **Clash Display** (400–700) | Space Grotesk, system-ui | [Fontshare Clash Display](https://fontshare.com/fonts/clash-display) |
| **Section & Wordmark Display** | **Cabinet Grotesk** (300–900) | Bricolage Grotesque, system-ui | [Fontshare Cabinet Grotesk](https://fontshare.com/fonts/cabinet-grotesk) |
| **Body & UI** | **Satoshi** (400–700) | DM Sans, system-ui | [Fontshare Satoshi](https://fontshare.com/fonts/satoshi) |
| **Pull Quotes / Editorial Accent** | **Instrument Serif Italic** | Georgia, serif | [Google Fonts Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) |

---

## 2. Colour System & Theme Swapping

Core design tokens live in **`src/theme.css`** and auth-specific tokens live in **`src/auth-theme.css`** (both imported at the top of `src/index.css`).

```css
:root {
  /* Core Canvas */
  --bg-primary:    #0A0A0A;   /* deep off-black */
  --bg-secondary:  #F5F0E6;   /* warm cream */
  --bg-tertiary:   #141414;   /* elevated dark surface */

  /* Hero & Module Accents */
  --accent-lime:   #C8FF00;   /* Spark + primary CTA */
  --accent-violet: #6C1EF5;   /* Chase + mesh gradients */
  --accent-coral:  #FF5C5C;   /* Buzz + accents */
  --accent-sun:    #FFB800;   /* D-Day + awards glow */

  /* Neutrals */
  --text-primary:  #F5F0E6;
  --text-muted:    #A1A1A1;
  --border-subtle: #262626;
  --border-pop:    #C8FF00;
}
```

### How to Edit or Swap the Theme
1. Open **`src/theme.css`** (or **`src/auth-theme.css`** for auth surfaces).
2. Edit tokens in `:root` (default off-black) or `[data-checking-theme="light"]` (cream canvas).
3. Users can also toggle between Off-Black and Cream canvases directly via the homepage footer toggle.

---

## 3. Motion & Highlights

- **GSAP + ScrollTrigger (Four Modules):** `src/components/home/ModuleCard.tsx` uses `gsap` with `ScrollTrigger` to smoothly slide and fade in the four module blocks (`Spark`, `Chase`, `Buzz`, `D-Day`) as they scroll into view, with `prefers-reduced-motion` protection and cleanup via `gsap.context()`.
- **Framer Motion + CSS Compositor Motion:** Hero headline stagger, interactive 3D module card stack, vertical dotted-lime timeline progress, and one-time Award-Show scroll confetti burst.
- **Dynamic Event Countdown Timer (Dashboard):** `src/components/dashboard/EventCountdownTimer.tsx` reads the active/upcoming event's `event_date` and displays live Days, Hours, Minutes, and Seconds in **Clash Display** with electric lime (`#C8FF00`) accents and event switching.

---

## 4. Authentication Architecture & Endpoints

Checking ships with a unified editorial split-screen auth experience (`55%` brand poster / `45%` form panel on desktop; compact top hero + `440px` form on mobile):

### Frontend Routes & Components
- **Pages:** `/signup`, `/signin`, `/forgot-password`, `/check-email`, `/reset-password`, `/verify-email` (plus `/auth` redirecting to `/signin`).
- **Reusable Primitives (`src/components/auth/`):** `AuthLayout`, `AuthBrandPanel`, `AuthCard`, `TextInput`, `PasswordInput` (with eye-blink toggle and 4-segment strength meter), searchable `Dropdown` (all 54 African countries defaulting to Nigeria + organiser role picker), `SocialLoginButton`, `PrimaryButton`, and `InlineError`.
- **Storage Migration:** `src/lib/storageMigration.ts` automatically migrates legacy localStorage keys to `checking*` keys on first load.

### Backend Auth API (`/api/auth/*` in `server/auth.ts`)
- `POST /api/auth/signup` — Creates account with salted `scrypt` password hash, enforces password rules, issues `HttpOnly` session cookie + token, and dispatches Checking welcome + verification emails.
- `POST /api/auth/signin` — Constant-time password verification, sliding-window rate limiting (5 attempts / 15 min), and optional 30-day "Remember me" session duration.
- `POST /api/auth/forgot-password` — Always returns a generic success response to prevent account enumeration; creates a 30-minute single-use hashed reset token.
- `GET /api/auth/reset-password/validate` & `POST /api/auth/reset-password` — Validates token expiry/single-use status and updates password.
- `POST /api/auth/verify-email` & `POST /api/auth/resend-verification` — Marks account verified or re-sends verification email.
- `GET /api/auth/me` & `POST /api/auth/signout` — Reads active session or clears the `HttpOnly` session cookie.
- `GET /api/auth/oauth/:provider` (`google` | `apple`) — Ready for OAuth client credentials; returns a graceful notice until `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` are configured.

### Email Templates (`server/emailTemplates.ts`)
Branded Checking HTML templates (off-black header, `CHECKING` wordmark + lime dot, `#C8FF00` pill CTA, cream canvas, `"Powered by Checking – Your event co-pilot."`) for:
1. Welcome
2. Email verification
3. Password reset
4. D-Day team invitation
5. Sponsor follow-up reminder

---

## 5. Environment Variables

See `.env.example` for all supported variables:
- `GEMINI_API_KEY` — Gemini API key for Spark, Buzz, Chase, and Engine AI Agenda planning.
- `CHECKING_APP_URL` — Public base URL (e.g., `https://checking.app`).
- `EMAIL_FROM` — Outbound sender address (defaults to `noreply@checking.app`).
- `SENDGRID_API_KEY` — Optional SendGrid key to deliver transactional auth emails (falls back to structured server logging in development).
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APPLE_CLIENT_ID` — Optional OAuth credentials to enable Google and Apple sign-in.
