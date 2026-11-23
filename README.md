# Myevent — Editorial Afro-Futurist Homepage

The rebuilt **Myevent** landing page pairs editorial brutalism with African festival/award-show energy — engineered to feel bold enough for a 24-year-old organiser in Lagos and credible enough for corporate banking sponsors.

---

## 1. Typography System & CDN Links

All fonts are loaded via `<link>` tags with `display=swap` and `preconnect` in `index.html` for fast 3G mobile rendering, with graceful fallbacks to prevent Cumulative Layout Shift (CLS).

| Role | Font Family | Fallback | CDN |
| :--- | :--- | :--- | :--- |
| **Hero Display** | **Clash Display** (400–700) | Space Grotesk, system-ui | [Fontshare Clash Display](https://fontshare.com/fonts/clash-display) |
| **Section Display** | **Cabinet Grotesk** (300–900) | Bricolage Grotesque, system-ui | [Fontshare Cabinet Grotesk](https://fontshare.com/fonts/cabinet-grotesk) |
| **Body & UI** | **Satoshi** (400–700) | DM Sans, system-ui | [Fontshare Satoshi](https://fontshare.com/fonts/satoshi) |
| **Pull Quotes / Editorial Accent** | **Instrument Serif Italic** | Georgia, serif | [Google Fonts Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) |

Tailwind font utilities exposed in `tailwind.config.ts`:
- `font-clash`
- `font-cabinet`
- `font-satoshi`
- `font-editorial`

---

## 2. Colour System & Theme Swapping

All homepage design tokens live in **`src/theme.css`** (imported at the top of `src/index.css`) and are mapped to Tailwind tokens in `tailwind.config.ts`.

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
1. Open **`src/theme.css`**.
2. Change any hex colour in `:root` (dark default) or `[data-myevent-theme="light"]` (cream canvas light variant).
3. Update font stacks via `--font-clash`, `--font-cabinet`, `--font-satoshi`, and `--font-editorial`.
4. Users can also switch between Off-Black and Cream canvases directly via the footer theme toggle.

---

## 3. Motion Library & Interaction Budget

- **Library:** `framer-motion` + pure CSS compositor animations (`transform` and `opacity` only).
- **4 Signature Motion Moments:**
  1. Hero line-by-line slide-up (`80ms` stagger) + interactive 3D module card stack spread on hover/tap.
  2. Module cards' `6px` lift hover, subtle darkening overlay, and `45°` rotating arrow button.
  3. Scroll-linked travelling lime dot down the **How it Works** vertical timeline (`useScroll` + `IntersectionObserver`).
  4. One-time scroll-triggered 2s CSS confetti burst in the **Award-Show Moment** section.
- **Marquee Strip:** Infinite horizontal marquee that pauses cleanly on hover/focus.
- **Accessibility:** Full `prefers-reduced-motion` support disables non-essential motion in both CSS (`src/theme.css`) and React (`useReducedMotion()`). All interactive controls include keyboard-visible focus rings (`.myevent-focus`) and mobile tap targets `>= 44×44px`.

---

## 4. Component & Asset Architecture

### Homepage Sections (`src/components/home/`)
1. `Navbar.tsx` — Floating pill navbar with scroll contraction and full-screen staggered mobile menu.
2. `Hero.tsx` — Asymmetric hero with Clash Display headline, outlined `AFRICA`, animated mesh blobs, and interactive 4-module stack.
3. `Marquee.tsx` — Cream editorial marquee strip with Adinkra diamond separators.
4. `ModuleCard.tsx` — Full-bleed colour block cards for **Spark**, **Chase**, **Buzz**, and **D-Day**.
5. `HowItWorks.tsx` — Vertical dotted-lime timeline (desktop) and horizontal snap cards (mobile).
6. `TestimonialCard.tsx` — Staggered masonry proof cards with Instrument Serif Italic quotes and hover tilt.
7. `AwardMoment.tsx` — Full-bleed dark statement + scroll-triggered confetti burst.
8. `FinalCTA.tsx` — Oversized cream CTA with Kente hairline divider.
9. `Footer.tsx` — 4-column dark footer with giant outlined `MYEVENT` watermark and lime-fill social buttons.
10. `HomeModals.tsx` — Interactive 60-second product tour, multi-currency pricing modal (`NGN` / `KES` / `USD`), and validated demo request form.

### Decorative SVG Patterns (`src/assets/patterns/`)
- `SparkPattern.tsx` — Hand-drawn spark/lightbulb icon & radiating spark burst corner SVG.
- `ChasePattern.tsx` — Target icon & concentric Adinkra-inspired geometric target SVG.
- `BuzzPattern.tsx` — Megaphone icon & frequency waveform corner SVG.
- `DDayPattern.tsx` — Ticket stub checkmark icon & barcode stripes corner SVG.
- `AdinkraAccents.tsx` — Nsoromma diamond separator, Adinkra micro-mark, and Kente stripe hairline accent.
