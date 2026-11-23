import React from "react";

interface SvgProps {
  className?: string;
}

/** Target / Partnership icon for the Chase module */
export const ChaseIcon: React.FC<SvgProps> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.75" />
    <circle cx="24" cy="24" r="10.5" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
    <circle cx="24" cy="24" r="4" fill="currentColor" />
    <path
      d="M36 12L26.5 21.5M36 12H29.5M36 12V18.5"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Decorative Adinkra-inspired geometric concentric target corner pattern */
export const ChaseTargetPattern: React.FC<SvgProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 220 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="2">
      <circle cx="176" cy="44" r="88" strokeOpacity="0.35" strokeDasharray="8 6" />
      <circle cx="176" cy="44" r="62" strokeOpacity="0.55" />
      <circle cx="176" cy="44" r="36" strokeOpacity="0.8" />
      <rect x="160" y="28" width="32" height="32" transform="rotate(45 176 44)" strokeWidth="2.2" />
      <line x1="70" y1="44" x2="120" y2="44" strokeLinecap="round" />
      <line x1="176" y1="98" x2="176" y2="152" strokeLinecap="round" />
      <circle cx="176" cy="44" r="6" fill="currentColor" />
    </g>
  </svg>
);
