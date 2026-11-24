import React from "react";
import { Link } from "react-router-dom";
import { AdinkraDiamond, AdinkraMicroMark } from "@/assets/patterns";

export interface AuthBrandPanelProps {
  headlinePrefix?: string;
  headlineOutlined?: string;
  headlineSuffix?: string;
  subhead: string;
}

const marqueePhrases = [
  "TECH SUMMITS",
  "AWARD NIGHTS",
  "CULTURE FESTIVALS",
  "HACKATHONS",
];

export const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({
  headlinePrefix = "",
  headlineOutlined = "",
  headlineSuffix = "",
  subhead,
}) => {
  return (
    <aside
      aria-label="Checking brand showcase"
      className="relative overflow-hidden bg-[#0A0A0A] text-[#F5F0E6] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262626] min-h-[195px] lg:min-h-screen"
    >
      {/* Desktop slow-drifting mesh gradient blob (disabled on small mobile to preserve 3G performance) */}
      <div
        className="hidden lg:block pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-40 blur-[110px] animate-mesh-drift"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #6C1EF5 0%, #FF5C5C 52%, rgba(255,184,0,0.45) 88%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Subtle compact top gradient on mobile */}
      <div
        className="lg:hidden pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full opacity-30 blur-[60px]"
        style={{
          background: "radial-gradient(circle, #6C1EF5 0%, #FF5C5C 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* 1% Editorial grain */}
      <div className="editorial-grain absolute inset-0" aria-hidden="true" />

      {/* Subtle Adinkra micro-graphics scattered at 6–10% opacity */}
      <div
        className="hidden lg:block pointer-events-none absolute top-28 right-12 text-[#C8FF00]/[0.08]"
        aria-hidden="true"
      >
        <AdinkraMicroMark className="w-16 h-16" />
      </div>
      <div
        className="hidden lg:block pointer-events-none absolute bottom-44 left-10 text-[#F5F0E6]/[0.07]"
        aria-hidden="true"
      >
        <AdinkraMicroMark className="w-12 h-12" />
      </div>
      <div
        className="hidden lg:block pointer-events-none absolute top-1/2 right-24 text-[#FFB800]/[0.08]"
        aria-hidden="true"
      >
        <AdinkraDiamond className="w-10 h-10" />
      </div>

      {/* Top-left: CHECKING wordmark + pulsing lime dot */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12 pt-6 lg:pt-10 flex items-center justify-between">
        <Link
          to="/"
          className="checking-focus inline-flex items-center gap-1.5 font-cabinet font-extrabold text-xl sm:text-2xl uppercase tracking-[-0.03em] text-[#F5F0E6] rounded-md"
        >
          <span>CHECKING</span>
          <span
            className="checking-dot-pulse inline-block w-2.5 h-2.5 rounded-full bg-[#C8FF00]"
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/"
          className="checking-focus font-satoshi text-xs font-medium text-[#A1A1A1] hover:text-[#C8FF00] transition-colors px-2 py-1 rounded"
        >
          ← Back to home
        </Link>
      </div>

      {/* Center: Editorial Clash Display Headline + Satoshi Subhead */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-6 lg:py-0 my-auto">
        <h2 className="font-clash font-bold text-[clamp(2.35rem,5.4vw,5.75rem)] leading-[0.94] tracking-[-0.04em] text-[#F5F0E6] text-balance">
          {headlinePrefix && <span>{headlinePrefix}</span>}
          {headlineOutlined && (
            <span className="text-stroke-lime">{headlineOutlined}</span>
          )}
          {headlineSuffix && <span>{headlineSuffix}</span>}
        </h2>
        <p className="mt-3 lg:mt-5 font-satoshi text-[15px] sm:text-[18px] lg:text-[19px] leading-relaxed text-[#A1A1A1] max-w-[420px]">
          {subhead}
        </p>
      </div>

      {/* Bottom: Cream Editorial Marquee + Trust Row */}
      <div className="relative z-10 mt-2 lg:mt-0">
        <div className="marquee-wrapper w-full overflow-hidden bg-[#F5F0E6] text-[#0A0A0A] border-y border-[#0A0A0A] py-2.5 lg:py-3 select-none">
          <div className="animate-editorial-marquee items-center">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                aria-hidden={dup === 1}
                className="flex items-center shrink-0"
              >
                {marqueePhrases.map((phrase) => (
                  <div
                    key={`${dup}-${phrase}`}
                    className="flex items-center gap-4 px-3"
                  >
                    <span className="font-clash font-bold uppercase text-sm sm:text-base lg:text-lg tracking-[-0.02em] whitespace-nowrap">
                      {phrase}
                    </span>
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0A0A0A] text-[#C8FF00] shrink-0"
                      aria-hidden="true"
                    >
                      <AdinkraDiamond className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Trust Row */}
        <div className="hidden lg:flex items-center justify-between px-12 py-5 font-satoshi text-sm font-medium text-[#A1A1A1]">
          <div className="flex items-center gap-2.5">
            <span>Trusted by organisers in</span>
            <span className="text-base tracking-wider" aria-label="Nigeria, Kenya, Ghana, South Africa, Rwanda">
              🇳🇬 🇰🇪 🇬🇭 🇿🇦 🇷🇼
            </span>
          </div>
          <span className="text-xs text-[#A1A1A1]/80">Your event co-pilot.</span>
        </div>
      </div>
    </aside>
  );
};
