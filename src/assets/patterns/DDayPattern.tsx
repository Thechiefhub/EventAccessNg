import React from "react";

interface SvgProps {
  className?: string;
}

/** Checkmark inside a ticket stub icon for the D-Day module */
export const DDayIcon: React.FC<SvgProps> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M7 15C7 13.34 8.34 12 10 12H38C39.66 12 41 13.34 41 15V19.5C38.79 19.5 37 21.29 37 23.5C37 25.71 38.79 27.5 41 27.5V32C41 33.66 39.66 35 38 35H10C8.34 35 7 33.66 7 32V27.5C9.21 27.5 11 25.71 11 23.5C11 21.29 9.21 19.5 7 19.5V15Z"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <path
      d="M19 23.5L22.5 27L29.5 19.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Decorative ticket barcode stripes corner SVG pattern */
export const DDayBarcodePattern: React.FC<SvgProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 220 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g fill="currentColor">
      <rect x="78" y="18" width="6" height="96" rx="1" fillOpacity="0.7" />
      <rect x="90" y="18" width="2.5" height="96" rx="1" fillOpacity="0.55" />
      <rect x="98" y="18" width="9" height="96" rx="1" fillOpacity="0.8" />
      <rect x="114" y="18" width="3" height="96" rx="1" fillOpacity="0.5" />
      <rect x="122" y="18" width="6" height="96" rx="1" fillOpacity="0.75" />
      <rect x="134" y="18" width="11" height="96" rx="1" fillOpacity="0.9" />
      <rect x="151" y="18" width="3" height="96" rx="1" fillOpacity="0.55" />
      <rect x="160" y="18" width="7" height="96" rx="1" fillOpacity="0.8" />
      <rect x="173" y="18" width="3" height="96" rx="1" fillOpacity="0.6" />
      <rect x="182" y="18" width="10" height="96" rx="1" fillOpacity="0.85" />
      <rect x="198" y="18" width="4" height="96" rx="1" fillOpacity="0.6" />
    </g>
    <line
      x1="74"
      y1="128"
      x2="204"
      y2="128"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="6 5"
      strokeOpacity="0.65"
    />
  </svg>
);
