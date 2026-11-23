import React from "react";

interface SvgProps {
  className?: string;
}

/** Hand-drawn spark / lightbulb icon for the Spark module */
export const SparkIcon: React.FC<SvgProps> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M24 5V11M24 37V43M9.5 14L14.5 17M33.5 31L38.5 34M38.5 14L33.5 17M14.5 31L9.5 34"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
    />
    <path
      d="M24 14.5C18.75 14.5 14.5 18.75 14.5 24C14.5 27.3 16.2 30.2 18.8 31.9C19.5 32.35 19.9 33.1 20 33.9V35.2C20 36.2 20.8 37 21.8 37H26.2C27.2 37 28 36.2 28 35.2V33.9C28.1 33.1 28.5 32.35 29.2 31.9C31.8 30.2 33.5 27.3 33.5 24C33.5 18.75 29.25 14.5 24 14.5Z"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <path
      d="M21 24.5L23.2 21.5L24.8 25.5L27 22.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Decorative corner radiating spark burst lines */
export const SparkBurstPattern: React.FC<SvgProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 220 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="170" y1="50" x2="170" y2="8" />
      <line x1="170" y1="50" x2="212" y2="50" />
      <line x1="170" y1="50" x2="170" y2="112" />
      <line x1="170" y1="50" x2="96" y2="50" />
      <line x1="170" y1="50" x2="204" y2="16" />
      <line x1="170" y1="50" x2="122" y2="98" />
      <line x1="170" y1="50" x2="132" y2="12" />
      <line x1="170" y1="50" x2="208" y2="88" />
      <circle cx="170" cy="50" r="16" fill="currentColor" fillOpacity="0.12" />
      <circle cx="170" cy="50" r="5" fill="currentColor" />
      <path d="M98 118L104 130L116 136L104 142L98 154L92 142L80 136L92 130L98 118Z" strokeWidth="1.8" />
    </g>
  </svg>
);
