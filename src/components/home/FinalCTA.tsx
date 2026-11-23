import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { KenteStripeAccent } from "@/assets/patterns";

interface FinalCTAProps {
  onOpenDemo: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenDemo }) => {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative bg-[var(--bg-secondary)] text-[var(--text-on-light)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1220px] px-5 sm:px-8 text-center">
        <div className="mx-auto max-w-4xl">
          <h2
            id="final-cta-heading"
            className="font-clash font-bold text-[clamp(3.2rem,8.5vw,7.5rem)] leading-[0.95] tracking-[-0.04em]"
          >
            Let’s make it loud.
          </h2>

          <p className="mt-5 font-satoshi text-[18px] sm:text-[20px] text-[var(--text-muted-light)] max-w-xl mx-auto">
            Launch your next conference, hackathon, or awards gala with one workspace
            built for African organisers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="myevent-focus group inline-flex items-center justify-center gap-2.5 bg-[#C8FF00] text-[#0A0A0A] border-2 border-[#0A0A0A] font-satoshi font-bold text-base sm:text-lg px-9 py-4 min-h-[56px] rounded-full hover:scale-[1.03] hover:shadow-[4px_4px_0px_#0A0A0A] transition-all duration-150 w-full sm:w-auto whitespace-nowrap"
            >
              <span>Start free</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={onOpenDemo}
              className="myevent-focus inline-flex items-center justify-center gap-2 border-2 border-[var(--contrast-on-secondary)] bg-transparent hover:bg-[var(--contrast-on-secondary)] hover:text-[var(--contrast-on-secondary-inv)] text-[var(--contrast-on-secondary)] font-satoshi font-bold text-base sm:text-lg px-8 py-4 min-h-[56px] rounded-full hover:scale-[1.02] transition-all duration-150 w-full sm:w-auto whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Kente-inspired geometric hairline strip dividing CTA & Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <KenteStripeAccent className="w-full h-1.5" />
      </div>
    </section>
  );
};
