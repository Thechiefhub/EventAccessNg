import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ConfettiParticle {
  id: number;
  left: string;
  top: string;
  tx: string;
  ty: string;
  rot: string;
  color: string;
  width: number;
  height: number;
  delay: string;
}

const CONFETTI_COLORS = ["#C8FF00", "#6C1EF5", "#FF5C5C", "#FFB800", "#F5F0E6"];

export const AwardMoment: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasBurst, setHasBurst] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  // Deterministic lightweight confetti burst particles
  const particles = useMemo<ConfettiParticle[]>(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const angle = (i / 42) * Math.PI * 2;
      const spread = 120 + ((i * 53) % 260);
      const tx = Math.round(Math.cos(angle) * spread);
      const ty = Math.round(Math.sin(angle) * spread - 40);
      const rot = `${(i % 2 === 0 ? 1 : -1) * (180 + ((i * 37) % 360))}deg`;
      return {
        id: i,
        left: `${45 + ((i * 7) % 10)}%`,
        top: `${42 + ((i * 5) % 12)}%`,
        tx: `${tx}px`,
        ty: `${ty}px`,
        rot,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        width: i % 3 === 0 ? 14 : 9,
        height: i % 3 === 0 ? 7 : 12,
        delay: `${(i % 7) * 35}ms`,
      };
    });
  }, []);

  // Trigger one-time 2s confetti burst when section enters viewport
  useEffect(() => {
    if (prefersReducedMotion || hasBurst) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBurst) {
            setHasBurst(true);
            setBurstActive(true);
            window.setTimeout(() => setBurstActive(false), 2300);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasBurst, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="award-moment-heading"
      className="relative overflow-hidden bg-[#0A0A0A] text-[#F5F0E6] py-28 sm:py-36 lg:py-44 border-y border-[#262626]"
    >
      {/* Subtle golden-violet spotlight glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[420px] rounded-full opacity-30 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,184,0,0.45) 0%, rgba(108,30,245,0.4) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* One-time scroll-triggered CSS confetti burst */}
      {burstActive && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden z-20"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <span
              key={p.id}
              className="confetti-piece absolute rounded-[2px]"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  backgroundColor: p.color,
                  animationDelay: p.delay,
                  "--tx": p.tx,
                  "--ty": p.ty,
                  "--rot": p.rot,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1220px] px-5 sm:px-8 text-center">
        <p className="font-satoshi font-medium text-sm uppercase tracking-[0.2em] text-[#FFB800] mb-6">
          Showtime energy, every single time
        </p>

        <h2
          id="award-moment-heading"
          className="font-clash font-bold text-[clamp(3rem,8.4vw,8.2rem)] leading-[0.94] tracking-[-0.04em] text-balance"
        >
          <span className="text-[#F5F0E6]">Your event deserves a </span>
          <span className="text-stroke-lime uppercase">standing</span>{" "}
          <span className="text-[#F5F0E6]">ovation</span>
          <span className="text-[#C8FF00]">.</span>
        </h2>

        <div className="mt-12 sm:mt-14 flex justify-center">
          <Link
            to="/signup"
            className="checking-focus group inline-flex items-center justify-center gap-3 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-lg sm:text-xl px-8 sm:px-11 py-5 min-h-[62px] rounded-full hover:scale-[1.03] hover:shadow-[0_0_44px_rgba(200,255,0,0.5)] transition-all duration-150"
          >
            <span>Start free — no card, no wahala</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-150 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
