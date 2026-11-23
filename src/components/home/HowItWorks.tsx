import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SparkIcon, ChaseIcon, BuzzIcon, DDayIcon } from "@/assets/patterns";

interface StepItem {
  number: string;
  title: string;
  headline: string;
  detail: string;
  module: string;
  accent: string;
  Icon: React.FC<{ className?: string }>;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Ideate",
    headline: "Name it, brand it, feel it.",
    detail:
      "Drop your city, audience, and vibe into Spark. Get sharp event names, cultural positioning, and a full brand narrative in under two minutes.",
    module: "Spark",
    accent: "#C8FF00",
    Icon: SparkIcon,
  },
  {
    number: "02",
    title: "Fund",
    headline: "Find sponsors who actually get it.",
    detail:
      "Chase matches your audience with banks, telcos, and tech brands active in your city — then drafts tailored decks and tracks every follow-up.",
    module: "Chase",
    accent: "#6C1EF5",
    Icon: ChaseIcon,
  },
  {
    number: "03",
    title: "Hype",
    headline: "Content that makes people show up.",
    detail:
      "Buzz maps a 90-day rollout across Instagram, X, LinkedIn, and WhatsApp communities so ticket drops hit momentum weeks before doors open.",
    module: "Buzz",
    accent: "#FF5C5C",
    Icon: BuzzIcon,
  },
  {
    number: "04",
    title: "Run",
    headline: "Check-ins that just work. Even offline.",
    detail:
      "D-Day scans QR badges in 0.3 seconds on any Android phone, syncs automatically when signal returns, and prints VIP tags without queues.",
    module: "D-Day",
    accent: "#FFB800",
    Icon: DDayIcon,
  },
];

export const HowItWorks: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Scroll-linked travelling lime dot along the vertical connector line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const dotTop = useTransform(scrollYProgress, [0, 1], ["4%", "94%"]);

  // IntersectionObserver for step highlight cue
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((node, idx) => {
      if (!node) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(idx);
            }
          });
        },
        { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 }
      );
      obs.observe(node);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] py-20 sm:py-28 lg:py-32"
    >
      {/* Subtle violet mesh gradient at top */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[780px] h-[380px] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, #6C1EF5 0%, rgba(108,30,245,0.2) 55%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 lg:mb-20">
          <p className="font-clash font-bold text-sm tracking-[0.14em] uppercase text-[var(--accent-on-primary)]">
            02 — HOW IT WORKS
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-4 font-cabinet text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-balance"
          >
            <span className="font-extrabold">From group chat</span>{" "}
            <span className="font-light text-[var(--text-muted)]">
              to sold-out hall.
            </span>
          </h2>
          <p className="mt-5 font-satoshi text-[17px] sm:text-[18px] text-[var(--text-muted)] leading-relaxed max-w-xl">
            Four deliberate stages connected in one continuous pipeline — zero spreadsheets
            breaking at midnight before doors open.
          </p>
        </div>

        {/* DESKTOP: Vertical Timeline with dotted lime connector & travelling dot */}
        <div ref={timelineRef} className="hidden md:block relative">
          {/* Dotted vertical lime line */}
          <div
            className="absolute left-[44px] top-6 bottom-6 w-px border-l-2 border-dashed border-[var(--accent-on-primary)]/45"
            aria-hidden="true"
          />

          {/* Animated travelling lime dot */}
          {!prefersReducedMotion && (
            <motion.div
              style={{ top: dotTop }}
              className="pointer-events-none absolute left-[37px] w-4 h-4 rounded-full bg-[var(--accent-on-primary)] shadow-[0_0_20px_rgba(200,255,0,0.65)] z-20"
              aria-hidden="true"
            />
          )}

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="relative grid grid-cols-12 gap-8 items-start pl-24"
                >
                  {/* Step station marker on line */}
                  <div
                    className={`absolute left-[36px] top-8 w-[18px] h-[18px] rounded-full border-2 transition-colors duration-200 ${
                      isActive
                        ? "border-[var(--accent-on-primary)] bg-[var(--bg-primary)] scale-110"
                        : "border-[var(--border-subtle)] bg-[var(--bg-primary)]"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Large Outlined Lime Step Number */}
                  <div className="col-span-3 flex flex-col items-start">
                    <span className="font-clash font-bold text-[5.5rem] leading-none tracking-[-0.04em] text-stroke-lime tabular-nums select-none">
                      {step.number}
                    </span>
                    <span className="mt-2 font-satoshi text-sm font-medium text-[var(--text-muted)]">
                      Module · {step.module}
                    </span>
                  </div>

                  {/* Step Content Card */}
                  <div
                    className={`col-span-9 rounded-2xl border p-8 transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--bg-tertiary)] border-[var(--accent-on-primary)]/60"
                        : "bg-[var(--bg-tertiary)]/55 border-[var(--border-subtle)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-clash font-bold text-2xl sm:text-3xl tracking-tight text-[var(--text-primary)]">
                          {step.title}
                        </p>
                        <h3 className="mt-1 font-cabinet font-bold text-xl sm:text-2xl text-[var(--accent-on-primary)]">
                          {step.headline}
                        </h3>
                      </div>
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--border-subtle)] bg-[#0A0A0A] shrink-0"
                        style={{ color: step.accent }}
                      >
                        <step.Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="mt-4 font-satoshi text-[16px] sm:text-[17px] leading-relaxed text-[var(--text-muted)] max-w-2xl">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE: Horizontal-scroll snap cards */}
        <div className="md:hidden">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 no-scrollbar"
            role="region"
            aria-label="How it works steps"
          >
            {steps.map((step) => (
              <article
                key={step.number}
                className="snap-center shrink-0 w-[84vw] max-w-[330px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-clash font-bold text-5xl leading-none text-stroke-lime tabular-nums">
                      {step.number}
                    </span>
                    <div
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--border-subtle)] bg-[#0A0A0A]"
                      style={{ color: step.accent }}
                    >
                      <step.Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="mt-5 font-clash font-bold text-2xl text-[var(--text-primary)]">
                    {step.title}
                  </p>
                  <h3 className="mt-1 font-cabinet font-bold text-lg text-[var(--accent-on-primary)]">
                    {step.headline}
                  </h3>
                  <p className="mt-3 font-satoshi text-base leading-relaxed text-[var(--text-muted)]">
                    {step.detail}
                  </p>
                </div>
                <p className="mt-6 pt-4 border-t border-[var(--border-subtle)] font-satoshi text-xs font-medium text-[var(--text-muted)]">
                  Powered by {step.module}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-2 font-satoshi text-xs text-[var(--text-muted)] text-center">
            Swipe sideways to follow all 4 stages →
          </p>
        </div>
      </div>
    </section>
  );
};
