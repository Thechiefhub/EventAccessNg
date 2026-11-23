import React from "react";

interface SvgProps {
  className?: string;
}

/** Megaphone with speed lines icon for the Buzz module */
export const BuzzIcon: React.FC<SvgProps> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M10 21.5V28.5C10 29.88 11.12 31 12.5 31H16.5L32 37.5V12.5L16.5 19H12.5C11.12 19 10 20.12 10 21.5Z"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <path
      d="M16 31L18.2 38.5C18.5 39.5 19.4 40.2 20.5 40.2H22"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
    />
    <path
      d="M36.5 19.5L41.5 16.5M37.5 25H43M36.5 30.5L41.5 33.5"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
    />
  </svg>
);

/** Decorative frequency waveform lines corner SVG pattern */
export const BuzzWaveformPattern: React.FC<SvgProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 220 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
      <line x1="76" y1="60" x2="76" y2="90" strokeOpacity="0.4" />
      <line x1="92" y1="44" x2="92" y2="106" strokeOpacity="0.55" />
      <line x1="108" y1="26" x2="108" y2="124" strokeOpacity="0.7" />
      <line x1="124" y1="50" x2="124" y2="100" strokeOpacity="0.6" />
      <line x1="140" y1="18" x2="140" y2="132" strokeOpacity="0.85" />
      <line x1="156" y1="36" x2="156" y2="114" strokeOpacity="0.75" />
      <line x1="172" y1="12" x2="172" y2="140" strokeOpacity="0.95" />
      <line x1="188" y1="42" x2="188" y2="110" strokeOpacity="0.65" />
      <line x1="204" y1="58" x2="204" y2="94" strokeOpacity="0.45" />
    </g>
    <path
      d="M68 158C96 140 120 176 148 158C176 140 194 166 212 156"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
  </svg>
);
