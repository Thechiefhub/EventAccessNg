import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, QrCode, TrendingUp, Flame } from "lucide-react";
import {
  SparkIcon,
  ChaseIcon,
  BuzzIcon,
  DDayIcon,
  AdinkraMicroMark,
} from "@/assets/patterns";

interface HeroProps {
  onOpenTour: () => void;
}

const headlineLines = [
  { text: "Plan events", outlined: false },
  { text: "that make", outlined: false },
  { text: "AFRICA", outlined: true },
  { text: "feel loud.", outlined: false },
];

const stackCards = [
  {
    id: "spark",
    num: "01",
    name: "Spark",
    subtitle: "AI Naming & Visual Identity",
    metric: "Lagos Design Summit '26",
    detail: "Brand kit + 3 theme directions ready",
    bg: "#C8FF00",
    fg: "#0A0A0A",
    restTransform: { x: -16, y: -12, rotate: -7, scale: 0.94 },
    spreadTransform: { x: -46, y: -56, rotate: -12, scale: 0.98 },
    Icon: SparkIcon,
    MiniIcon: Flame,
  },
  {
    id: "chase",
    num: "02",
    name: "Chase",
    subtitle: "Sponsor Pipeline & Decks",
    metric: "$85,000 committed",
    detail: "4 Tier-1 pitch decks approved",
    bg: "#6C1EF5",
    fg: "#F5F0E6",
    restTransform: { x: 10, y: 12, rotate: -2.5, scale: 0.96 },
    spreadTransform: { x: 34, y: -18, rotate: -3, scale: 0.99 },
    Icon: ChaseIcon,
    MiniIcon: TrendingUp,
  },
  {
    id: "buzz",
    num: "03",
    name: "Buzz",
    subtitle: "90-Day Hype Engine",
    metric: "2,400 waitlist signups",
    detail: "Countdown drop scheduled · IG + X",
    bg: "#FF5C5C",
    fg: "#0A0A0A",
    restTransform: { x: -6, y: 38, rotate: 2.5, scale: 0.98 },
    spreadTransform: { x: -32, y: 42, rotate: 4, scale: 1 },
    Icon: BuzzIcon,
    MiniIcon: CheckCircle2,
  },
  {
    id: "dday",
    num: "04",
    name: "D-Day",
    subtitle: "Offline QR Check-in",
    metric: "1,482 / 1,500 scanned",
    detail: "0.3s gate speed · Works offline",
    bg: "#FFB800",
    fg: "#0A0A0A",
    restTransform: { x: 18, y: 66, rotate: 6, scale: 1 },
    spreadTransform: { x: 38, y: 98, rotate: 9, scale: 1.02 },
    Icon: DDayIcon,
    MiniIcon: QrCode,
  },
];

const countries = [
  { flag: "🇳🇬", label: "Nigeria" },
  { flag: "🇰🇪", label: "Kenya" },
  { flag: "🇬🇭", label: "Ghana" },
  { flag: "🇿🇦", label: "South Africa" },
  { flag: "🇷🇼", label: "Rwanda" },
];

export const Hero: React.FC<HeroProps> = ({ onOpenTour }) => {
  const prefersReducedMotion = useReducedMotion();
  const [stackSpread, setStackSpread] = useState(false);

  const scrollToModules = () => {
    const el = document.querySelector("#modules");
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-28"
    >
      {/* Animated mesh gradient blobs (slow 20s drift, low opacity for text legibility) */}
      <div
        className="pointer-events-none absolute -top-28 -right-24 w-[480px] h-[480px] sm:w-[680px] sm:h-[680px] rounded-full opacity-[0.42] blur-[110px] animate-mesh-drift"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #6C1EF5 0%, #FF5C5C 52%, rgba(255,184,0,0.4) 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full opacity-[0.18] blur-[100px] animate-mesh-drift-reverse"
        style={{
          background: "radial-gradient(circle, #C8FF00 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Adinkra geometric micro-graphic accent */}
      <div
        className="pointer-events-none hidden lg:block absolute top-32 right-12 text-[#C8FF00]/20"
        aria-hidden="true"
      >
        <AdinkraMicroMark className="w-12 h-12" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          {/* LEFT 60% (7 columns): Editorial Hero Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/80 px-4 py-2 text-sm font-satoshi font-medium text-[var(--text-primary)]"
            >
              <span
                className="w-2 h-2 rounded-full bg-[#C8FF00] shrink-0"
                aria-hidden="true"
              />
              <span>Built for Africa. By Africa.</span>
            </motion.div>

            {/* Massive Clash Display H1 with 80ms line stagger */}
            <h1 className="font-clash font-bold text-[clamp(3.35rem,7.2vw,7.6rem)] leading-[0.93] tracking-[-0.04em] text-[var(--text-primary)]">
              {headlineLines.map((line, index) => (
                <span key={line.text} className="block overflow-hidden pb-1">
                  <motion.span
                    initial={prefersReducedMotion ? false : { y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: prefersReducedMotion ? 0 : 0.08 * index,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block hero-weight-shift ${
                      line.outlined
                        ? "text-stroke-lime uppercase tracking-[-0.02em]"
                        : ""
                    }`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subhead */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.36 }}
              className="mt-7 font-satoshi text-[18px] sm:text-[20px] md:text-[21px] leading-[1.55] text-[var(--text-muted)] max-w-[540px]"
            >
              From the first idea to the last check-in — Myevent is the AI co-pilot for
              African conferences, summits and award nights.{" "}
              <span className="text-[var(--text-primary)] font-medium">
                Name it. Fund it. Hype it. Run it.
              </span>
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.44 }}
              className="mt-9 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/auth"
                className="myevent-focus group inline-flex items-center justify-center gap-2.5 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-base px-7 py-4 min-h-[54px] rounded-full hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(200,255,0,0.45)] transition-all duration-150 whitespace-nowrap w-full sm:w-auto"
              >
                <span>Start planning free</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={onOpenTour}
                className="myevent-focus group inline-flex items-center justify-center gap-3 border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/60 hover:border-[var(--accent-on-primary)] text-[var(--text-primary)] font-satoshi font-medium text-base px-6 py-4 min-h-[54px] rounded-full hover:scale-[1.02] transition-all duration-150 whitespace-nowrap w-full sm:w-auto"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-on-primary-soft)] text-[var(--accent-on-primary)] group-hover:bg-[#C8FF00] group-hover:text-[#0A0A0A] transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Watch 60-sec tour</span>
              </button>
            </motion.div>

            {/* Trust Strip */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.55 }}
              className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-x-4 gap-y-2 font-satoshi text-sm text-[var(--text-muted)]"
            >
              <span>Trusted by organisers in</span>
              <div className="flex items-center gap-2.5 text-lg" aria-label="Nigeria, Kenya, Ghana, South Africa, Rwanda">
                {countries.map((c) => (
                  <span
                    key={c.label}
                    title={c.label}
                    className="inline-block hover:scale-125 transition-transform duration-150 cursor-default"
                  >
                    {c.flag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT 40% (5 columns): Floating 3D-ish Layered Module Preview Stack */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              onMouseEnter={() => setStackSpread(true)}
              onMouseLeave={() => setStackSpread(false)}
              onClick={() => setStackSpread((s) => !s)}
              role="region"
              aria-label="Interactive preview stack of Myevent's four modules"
              className="relative w-full max-w-[390px] sm:max-w-[430px] h-[410px] sm:h-[460px] flex items-center justify-center cursor-pointer select-none"
            >
              {stackCards.map((card, idx) => {
                const target = stackSpread ? card.spreadTransform : card.restTransform;
                return (
                  <motion.div
                    key={card.id}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 40, rotate: card.restTransform.rotate }
                    }
                    animate={{
                      opacity: 1,
                      x: prefersReducedMotion ? card.restTransform.x : target.x,
                      y: prefersReducedMotion ? card.restTransform.y : target.y,
                      rotate: prefersReducedMotion ? card.restTransform.rotate : target.rotate,
                      scale: prefersReducedMotion ? card.restTransform.scale : target.scale,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 22,
                      delay: stackSpread ? 0 : idx * 0.06,
                    }}
                    style={{
                      backgroundColor: card.bg,
                      color: card.fg,
                      zIndex: idx + 1,
                    }}
                    className="absolute w-[285px] sm:w-[325px] rounded-2xl p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-black/15"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-clash font-bold text-xs tracking-wider opacity-75">
                          {card.num} · MODULE
                        </span>
                        <h2 className="font-clash font-bold text-2xl sm:text-3xl leading-none mt-1">
                          {card.name}
                        </h2>
                      </div>
                      <div className="p-2 rounded-xl bg-black/10">
                        <card.Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <p className="mt-2 font-satoshi text-sm font-medium opacity-85">
                      {card.subtitle}
                    </p>

                    {/* Frosted mini live UI preview bar */}
                    <div
                      className="mt-4 rounded-xl p-3 flex items-center justify-between gap-2 backdrop-blur-md"
                      style={{
                        backgroundColor:
                          card.fg === "#0A0A0A"
                            ? "rgba(10,10,10,0.1)"
                            : "rgba(245,240,230,0.14)",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="font-cabinet font-extrabold text-sm sm:text-base tabular-nums truncate">
                          {card.metric}
                        </div>
                        <div className="font-satoshi text-xs opacity-80 truncate">
                          {card.detail}
                        </div>
                      </div>
                      <card.MiniIcon className="w-4 h-4 shrink-0 opacity-85" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={scrollToModules}
              className="myevent-focus mt-6 font-satoshi text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent-on-primary)] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Hover or tap stack to fan out · Explore all 4 modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
