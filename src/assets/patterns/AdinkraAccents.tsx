import React from "react";

interface SvgProps {
  className?: string;
}

/** Subtle Adinkra-inspired four-point Nsoromma (star/guardian) diamond separator */
export const AdinkraDiamond: React.FC<SvgProps> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M16 2L19.8 12.2L30 16L19.8 19.8L16 30L12.2 19.8L2 16L12.2 12.2L16 2Z"
      fill="currentColor"
    />
    <circle cx="16" cy="16" r="3" fill="#0A0A0A" />
  </svg>
);

/** Subtle Adinkra-inspired geometric lattice micro-graphic */
export const AdinkraMicroMark: React.FC<SvgProps> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="20" y="3" width="24" height="24" transform="rotate(45 20 3)" stroke="currentColor" strokeWidth="1.5" />
    <rect x="20" y="10" width="14" height="14" transform="rotate(45 20 10)" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
  </svg>
);

/** Minimal Kente-inspired colour-blocked horizontal hairline accent */
export const KenteStripeAccent: React.FC<SvgProps> = ({ className = "w-full h-1.5" }) => (
  <svg
    viewBox="0 0 400 6"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="0" y="0" width="90" height="6" fill="#C8FF00" />
    <rect x="90" y="0" width="20" height="6" fill="#0A0A0A" />
    <rect x="110" y="0" width="80" height="6" fill="#6C1EF5" />
    <rect x="190" y="0" width="20" height="6" fill="#0A0A0A" />
    <rect x="210" y="0" width="90" height="6" fill="#FF5C5C" />
    <rect x="300" y="0" width="20" height="6" fill="#0A0A0A" />
    <rect x="320" y="0" width="80" height="6" fill="#FFB800" />
  </svg>
);
