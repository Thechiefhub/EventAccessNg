import React from "react";
import { AdinkraDiamond } from "@/assets/patterns";

const marqueeItems = [
  "TECH SUMMITS",
  "AWARD NIGHTS",
  "CULTURE FESTIVALS",
  "HACKATHONS",
  "INVESTOR MIXERS",
  "PRODUCT LAUNCHES",
];

export const Marquee: React.FC = () => {
  return (
    <div
      aria-label="Event categories marquee"
      className="marquee-wrapper relative w-full overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-on-light)] border-y-2 border-[#0A0A0A] py-5 sm:py-6 select-none"
    >
      <div className="animate-editorial-marquee items-center">
        {[0, 1].map((dupIndex) => (
          <div
            key={dupIndex}
            aria-hidden={dupIndex === 1}
            className="flex items-center shrink-0"
          >
            {marqueeItems.map((item) => (
              <div
                key={`${dupIndex}-${item}`}
                className="flex items-center gap-6 sm:gap-8 px-4 sm:px-6"
              >
                <span className="font-clash font-bold uppercase text-[clamp(1.85rem,3.8vw,3.4rem)] leading-none tracking-[-0.03em] whitespace-nowrap">
                  {item}
                </span>
                <span
                  className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A0A0A] text-[#C8FF00] shrink-0"
                  aria-hidden="true"
                >
                  <AdinkraDiamond className="w-5 h-5" />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
