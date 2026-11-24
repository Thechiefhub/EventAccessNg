import { useEffect, useState } from "react";
import {
  Navbar,
  Hero,
  Marquee,
  ModulesSection,
  HowItWorks,
  TestimonialsSection,
  AwardMoment,
  FinalCTA,
  Footer,
  TourModal,
  PricingModal,
  DemoModal,
} from "@/components/home";

const Index = () => {
  // Default to dark off-black canvas, while honouring saved preference or explicit toggle
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [tourOpen, setTourOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  // Respect prefers-color-scheme on initial load if user explicitly saved a choice
  useEffect(() => {
    const saved = window.localStorage.getItem("checking-homepage-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("checking-homepage-theme", next);
      return next;
    });
  };

  return (
    <div
      data-checking-theme={theme}
      className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-satoshi antialiased selection:bg-[#C8FF00] selection:text-[#0A0A0A]"
    >
      {/* 1% Editorial grain texture overlay across the entire homepage */}
      <div
        className="editorial-grain fixed inset-0 z-[60]"
        aria-hidden="true"
      />

      {/* Section 1 — Sticky Floating Pill Navbar */}
      <Navbar onOpenPricing={() => setPricingOpen(true)} />

      {/* Main content */}
      <main>
        {/* Section 2 — Asymmetric Editorial Hero */}
        <Hero onOpenTour={() => setTourOpen(true)} />

        {/* Section 3 — Full-Bleed Cream Marquee Transition */}
        <Marquee />

        {/* Section 4 — The Four Modules (2x2 Colour Blocks) */}
        <ModulesSection />

        {/* Section 5 — How It Works (Dark Vertical Timeline / Mobile Snap) */}
        <HowItWorks />

        {/* Section 6 — Proof / Testimonials (Cream Staggered Masonry) */}
        <TestimonialsSection />

        {/* Section 7 — Award-Show Moment (Dark + Scroll Confetti) */}
        <AwardMoment />

        {/* Section 8a — Final CTA (Cream) */}
        <FinalCTA onOpenDemo={() => setDemoOpen(true)} />
      </main>

      {/* Section 8b — Editorial Dark Footer with CHECKING Watermark */}
      <Footer
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPricing={() => setPricingOpen(true)}
        onOpenDemo={() => setDemoOpen(true)}
      />

      {/* Functional Interactive Dialogs */}
      <TourModal open={tourOpen} onClose={() => setTourOpen(false)} />
      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        onBookDemo={() => setDemoOpen(true)}
      />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default Index;
