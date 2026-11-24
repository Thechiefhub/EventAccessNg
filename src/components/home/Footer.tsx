import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

interface FooterProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenPricing: () => void;
  onOpenDemo: () => void;
}

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", action: "pricing" as const },
      { label: "Book a Demo", action: "demo" as const },
      { label: "Certificate Lookup", to: "/certificate" },
    ],
  },
  {
    heading: "Modules",
    links: [
      { label: "01 Spark", to: "/dashboard/spark" },
      { label: "02 Chase", to: "/dashboard/chase" },
      { label: "03 Buzz", to: "/dashboard/buzz" },
      { label: "04 D-Day", to: "/dashboard/dday" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Organiser Stories", href: "#stories" },
      { label: "The Engine", to: "/dashboard/engine" },
      { label: "Registration Pages", to: "/dashboard/registration" },
      { label: "Sign In", to: "/signin" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#footer-legal" },
      { label: "Terms of Service", href: "#footer-legal" },
      { label: "Data Protection (NDPR)", href: "#footer-legal" },
      { label: "Security", href: "#footer-legal" },
    ],
  },
];

const socials = [
  {
    name: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m5.81 14.08c-.24.68-1.42 1.3-1.95 1.38-.5.08-1.14.11-1.84-.11-.42-.14-.97-.32-1.67-.62-2.94-1.27-4.86-4.24-5.01-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.52.24.59.84 2.05.91 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.66 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
      </svg>
    ),
  },
];

export const Footer: React.FC<FooterProps> = ({
  theme,
  onToggleTheme,
  onOpenPricing,
  onOpenDemo,
}) => {
  return (
    <footer
      id="footer-legal"
      className="relative overflow-hidden bg-[#0A0A0A] text-[#F5F0E6] pt-20 pb-10"
    >
      {/* Giant outlined CHECKING watermark across footer background at ~6% opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden leading-none"
      >
        <span className="font-clash font-bold uppercase text-[18vw] tracking-[-0.04em] text-stroke-watermark translate-y-[18%] whitespace-nowrap">
          CHECKING
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#262626]">
          {/* Left: Wordmark + tagline + flags + theme switcher */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="checking-focus inline-flex items-center gap-1.5 font-cabinet font-extrabold text-2xl uppercase tracking-[-0.03em] text-[#F5F0E6]"
            >
              <span>CHECKING</span>
              <span
                className="checking-dot-pulse w-2.5 h-2.5 rounded-full bg-[#C8FF00]"
                aria-hidden="true"
              />
            </Link>
            <p className="font-satoshi text-[15px] leading-relaxed text-[#A1A1A1] max-w-xs">
              Your event co-pilot. Built for African conferences, summits, festivals,
              and award nights.
            </p>
            <div className="flex items-center gap-2 text-lg pt-1" aria-label="Operating across Nigeria, Kenya, Ghana, South Africa, Rwanda">
              <span>🇳🇬</span>
              <span>🇰🇪</span>
              <span>🇬🇭</span>
              <span>🇿🇦</span>
              <span>🇷🇼</span>
            </div>

            {/* Explicit dark/light canvas switcher */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="checking-focus inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] hover:border-[#C8FF00] px-4 py-2 min-h-[44px] font-satoshi text-xs font-medium text-[#F5F0E6] transition-colors"
                aria-label={`Switch homepage to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-[#FFB800]" />
                    <span>Switch to Cream Canvas</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#C8FF00]" />
                    <span>Switch to Off-Black Canvas</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle: 4 columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <h3 className="font-clash font-bold text-xs uppercase tracking-[0.14em] text-[#C8FF00] mb-4">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5 font-satoshi text-sm text-[#A1A1A1]">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      {"to" in item && item.to ? (
                        <Link
                          to={item.to}
                          className="checking-focus hover:text-[#F5F0E6] transition-colors py-0.5 inline-block"
                        >
                          {item.label}
                        </Link>
                      ) : "action" in item && item.action ? (
                        <button
                          type="button"
                          onClick={item.action === "pricing" ? onOpenPricing : onOpenDemo}
                          className="checking-focus hover:text-[#F5F0E6] transition-colors py-0.5 text-left"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          className="checking-focus hover:text-[#F5F0E6] transition-colors py-0.5 inline-block"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: Social icons as outlined circles that fill lime on hover */}
          <div className="lg:col-span-2 flex flex-col lg:items-end justify-start gap-4">
            <h3 className="font-clash font-bold text-xs uppercase tracking-[0.14em] text-[#C8FF00]">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#F5F0E6]/25 text-[#F5F0E6] hover:bg-[#C8FF00] hover:border-[#C8FF00] hover:text-[#0A0A0A] hover:scale-105 transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-satoshi text-sm text-[#A1A1A1]">
          <p className="font-medium text-[#F5F0E6]">
            Made in Africa. Built for the world. Powered by Checking.
          </p>
          <p className="text-xs text-[#A1A1A1]">© 2025 Checking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
