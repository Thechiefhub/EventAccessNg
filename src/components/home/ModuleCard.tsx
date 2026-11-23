import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  SparkIcon,
  SparkBurstPattern,
  ChaseIcon,
  ChaseTargetPattern,
  BuzzIcon,
  BuzzWaveformPattern,
  DDayIcon,
  DDayBarcodePattern,
} from "@/assets/patterns";

export interface ModuleCardProps {
  number: string;
  name: string;
  tagline: string;
  features: [string, string, string];
  bgColor: string;
  textColor: string;
  dotColor: string;
  to: string;
  Icon: React.FC<{ className?: string }>;
  CornerPattern: React.FC<{ className?: string }>;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  number,
  name,
  tagline,
  features,
  bgColor,
  textColor,
  dotColor,
  to,
  Icon,
  CornerPattern,
}) => {
  return (
    <Link
      to={to}
      style={{ backgroundColor: bgColor, color: textColor }}
      className="myevent-focus group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] p-7 sm:p-9 lg:p-11 min-h-[370px] sm:min-h-[420px] border-2 border-[#0A0A0A] transition-transform duration-200 ease-out hover:-translate-y-1.5"
    >
      {/* Subtle darkener overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-200"
        aria-hidden="true"
      />

      {/* Decorative SVG corner pattern */}
      <div
        className="pointer-events-none absolute -top-2 -right-2 w-44 h-44 sm:w-52 sm:h-52 opacity-20 group-hover:opacity-30 transition-opacity duration-200"
        aria-hidden="true"
      >
        <CornerPattern className="w-full h-full" />
      </div>

      {/* Top row: module number + custom icon */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-clash font-bold text-lg sm:text-xl tracking-tight tabular-nums">
          {number}
        </span>
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-current/20"
          style={{
            backgroundColor:
              textColor === "#0A0A0A"
                ? "rgba(10,10,10,0.08)"
                : "rgba(245,240,230,0.12)",
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>

      {/* Middle: Module display name + tagline + 3-line feature list */}
      <div className="relative z-10 mt-8 sm:mt-10">
        <h3 className="font-clash font-bold text-[clamp(2.8rem,5.2vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
          {name}
        </h3>
        <p className="mt-4 font-satoshi font-medium text-lg sm:text-[19px] leading-snug max-w-[440px] opacity-95">
          {tagline}
        </p>

        <ul className="mt-6 space-y-2.5 font-satoshi text-[15px] sm:text-base">
          {features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 leading-snug">
              <span
                className="mt-2 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              <span className="opacity-90">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom-right: Circular arrow button */}
      <div className="relative z-10 mt-8 flex items-center justify-between">
        <span className="font-satoshi text-sm font-bold tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
          Open {name}
        </span>
        <span
          className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#0A0A0A] bg-transparent text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-[#C8FF00] transition-colors duration-200"
          style={
            textColor === "#F5F0E6"
              ? { borderColor: "#F5F0E6", color: "#F5F0E6" }
              : undefined
          }
          aria-hidden="true"
        >
          <ArrowUpRight className="w-6 h-6 transition-transform duration-200 group-hover:rotate-45 group-hover:text-[#C8FF00]" />
        </span>
      </div>
    </Link>
  );
};

const modulesData: ModuleCardProps[] = [
  {
    number: "01",
    name: "Spark",
    tagline: "AI-powered naming, theming & visual identity with African aesthetics.",
    features: [
      "Culturally grounded event names & taglines in seconds",
      "Instant Narrative Studio for pitch copy & speaker briefs",
      "Cohesive colour & typography palettes ready for print",
    ],
    bgColor: "#C8FF00",
    textColor: "#0A0A0A",
    dotColor: "#0A0A0A",
    to: "/dashboard/spark",
    Icon: SparkIcon,
    CornerPattern: SparkBurstPattern,
  },
  {
    number: "02",
    name: "Chase",
    tagline: "Find sponsors who fit your audience, generate decks & close faster.",
    features: [
      "Curated Pan-African brand & corporate sponsor matches",
      "Tailored sponsorship proposals & tier rate cards",
      "Live deal tracker from first email to signed cheque",
    ],
    bgColor: "#6C1EF5",
    textColor: "#F5F0E6",
    dotColor: "#C8FF00",
    to: "/dashboard/chase",
    Icon: ChaseIcon,
    CornerPattern: ChaseTargetPattern,
  },
  {
    number: "03",
    name: "Buzz",
    tagline: "90-day hype calendars, social copy & countdown drops that sell out.",
    features: [
      "Day-by-day campaign playbook tuned for IG, X & WhatsApp",
      "Speaker spotlight cards & early-bird urgency templates",
      "Consistent rollout cadence without hiring an agency",
    ],
    bgColor: "#FF5C5C",
    textColor: "#0A0A0A",
    dotColor: "#0A0A0A",
    to: "/dashboard/buzz",
    Icon: BuzzIcon,
    CornerPattern: BuzzWaveformPattern,
  },
  {
    number: "04",
    name: "D-Day",
    tagline: "Check-ins that just work — instant QR scanning, badges & live stats.",
    features: [
      "Offline-first QR scanner built for shaky venue Wi-Fi",
      "Auto-generated VIP/VVIP badges & post-event certificates",
      "Real-time door telemetry across General, VIP & press lanes",
    ],
    bgColor: "#FFB800",
    textColor: "#0A0A0A",
    dotColor: "#0A0A0A",
    to: "/dashboard/dday",
    Icon: DDayIcon,
    CornerPattern: DDayBarcodePattern,
  },
];

export const ModulesSection: React.FC = () => {
  return (
    <section
      id="modules"
      aria-labelledby="modules-heading"
      className="relative bg-[var(--bg-secondary)] text-[var(--text-on-light)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* Centered Header */}
        <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
          <p className="font-clash font-bold text-sm tracking-[0.14em] uppercase opacity-75">
            01 — THE SYSTEM
          </p>
          <h2
            id="modules-heading"
            className="mt-4 font-cabinet text-[clamp(2.4rem,5.2vw,4.85rem)] leading-[1.02] tracking-[-0.03em] text-balance"
          >
            <span className="font-extrabold">Four modules.</span>{" "}
            <span className="font-light">One seamless workflow.</span>
          </h2>
          <p className="mt-5 font-satoshi text-[17px] sm:text-[18px] leading-relaxed text-[var(--text-muted-light)] max-w-xl mx-auto">
            Each module handles a critical phase — designed for the African context,
            not adapted to it.
          </p>
        </div>

        {/* 2x2 Full-Bleed Colour Block Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {modulesData.map((mod) => (
            <ModuleCard key={mod.name} {...mod} />
          ))}
        </div>
      </div>
    </section>
  );
};
