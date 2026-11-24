import React from "react";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  eventName: string;
  flag: string;
  tag: string;
  tagVariant: "lime" | "violet";
  tiltDirection: "left" | "right";
  offsetClass?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  eventName,
  flag,
  tag,
  tagVariant,
  tiltDirection,
  offsetClass = "",
}) => {
  const isLime = tagVariant === "lime";

  return (
    <article
      className={`group relative rounded-[1.5rem] border-2 border-[#0A0A0A] bg-[#FFFFFF] text-[#0A0A0A] p-7 sm:p-9 transition-transform duration-200 ease-out ${
        tiltDirection === "right" ? "hover:rotate-1" : "hover:-rotate-1"
      } ${offsetClass}`}
    >
      {/* Top row: Editorial tag in corner that fills with its accent colour on hover */}
      <div className="flex items-center justify-between gap-3 mb-7">
        <span className="font-satoshi text-xs font-bold uppercase tracking-wider text-[#525252]">
          Verified organiser
        </span>
        <span
          className={`font-satoshi text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-colors duration-200 whitespace-nowrap ${
            isLime
              ? "border-[#0A0A0A] text-[#0A0A0A] bg-transparent group-hover:bg-[#C8FF00]"
              : "border-[#6C1EF5] text-[#6C1EF5] bg-transparent group-hover:bg-[#6C1EF5] group-hover:text-[#F5F0E6]"
          }`}
        >
          {tag}
        </span>
      </div>

      {/* Big editorial pull-quote in Instrument Serif Italic */}
      <blockquote className="font-editorial italic text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.18] tracking-[-0.01em] text-[#0A0A0A]">
        “{quote}”
      </blockquote>

      {/* Attribution */}
      <footer className="mt-8 pt-5 border-t border-[#0A0A0A]/12 flex items-center justify-between gap-3">
        <div>
          <p className="font-satoshi font-bold text-base text-[#0A0A0A]">
            {name}
          </p>
          <p className="font-satoshi font-medium text-sm text-[#525252]">
            {role} · {eventName}
          </p>
        </div>
        <span className="text-2xl shrink-0" aria-hidden="true">
          {flag}
        </span>
      </footer>
    </article>
  );
};

const proofStats = [
  { value: "500+", label: "events shipped" },
  { value: "12", label: "African countries" },
  { value: "40k+", label: "offline QR check-ins" },
];

const testimonials: TestimonialCardProps[] = [
  {
    quote:
      "We stopped using five tools. Checking is now our whole back office — from sponsor pitch decks to the final QR scan at the gate.",
    name: "Tunde Adeyemi",
    role: "Co-Founder",
    eventName: "Lagos Builders Summit",
    flag: "🇳🇬",
    tag: "Tech Summit",
    tagVariant: "lime",
    tiltDirection: "right",
    offsetClass: "lg:mt-0",
  },
  {
    quote:
      "We closed two Tier-1 banking sponsors in three weeks using Chase. For the first time, our proposals looked like a continental awards show.",
    name: "Wanjiku Kamau",
    role: "Program Director",
    eventName: "Nairobi FinTech Forum",
    flag: "🇰🇪",
    tag: "Sponsor Win",
    tagVariant: "violet",
    tiltDirection: "left",
    offsetClass: "lg:mt-12",
  },
  {
    quote:
      "Venue Wi-Fi dropped right as 1,800 guests arrived for the red carpet. D-Day kept scanning offline without slowing a single VIP lane.",
    name: "Kwame Mensah",
    role: "Executive Producer",
    eventName: "Accra Creators Awards",
    flag: "🇬🇭",
    tag: "Award Night",
    tagVariant: "lime",
    tiltDirection: "right",
    offsetClass: "lg:mt-5",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      className="relative bg-[var(--bg-secondary)] text-[var(--text-on-light)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* Header + 3 Stat Pills */}
        <div className="flex flex-col items-center text-center mb-14 lg:mb-18">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
            {proofStats.map((stat) => (
              <div
                key={stat.label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--contrast-on-secondary)] bg-[var(--contrast-on-secondary)] text-[var(--contrast-on-secondary-inv)] px-4 py-1.5 font-satoshi text-sm"
              >
                <span className="font-clash font-bold text-[var(--stat-accent-on-secondary)] tabular-nums">
                  {stat.value}
                </span>
                <span className="opacity-90">{stat.label}</span>
              </div>
            ))}
          </div>

          <h2
            id="stories-heading"
            className="font-cabinet font-extrabold text-[clamp(2.5rem,5.4vw,4.85rem)] leading-[1.0] tracking-[-0.03em] text-balance"
          >
            Trusted on the ground.
          </h2>
          <p className="mt-4 font-satoshi text-[17px] sm:text-[18px] text-[var(--text-muted-light)] max-w-xl">
            Built with real organisers shipping conferences, festivals, and black-tie
            award nights across the continent.
          </p>
        </div>

        {/* Staggered Masonry Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-start">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};
