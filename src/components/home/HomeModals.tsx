import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SparkIcon, ChaseIcon, BuzzIcon, DDayIcon } from "@/assets/patterns";
import { toast } from "sonner";

/* --------------------------------------------------------------------------
   1. Interactive 60-Second Guided Tour Modal (lightweight, zero autoplay video)
   -------------------------------------------------------------------------- */
const tourSlides = [
  {
    step: "01 / 04",
    duration: "0:00 – 0:15",
    name: "Spark",
    title: "Name & brand your event in 90 seconds",
    description:
      "Tell Spark your city, target crowd, and energy. It produces culturally sharp event titles, theme narratives, and a colour system ready for designers and sponsors.",
    highlight: "Example output: “AfroStack Lagos ’26 — Where Builders Ship Loud”",
    color: "#C8FF00",
    fg: "#0A0A0A",
    Icon: SparkIcon,
  },
  {
    step: "02 / 04",
    duration: "0:15 – 0:30",
    name: "Chase",
    title: "Turn sponsor outreach into signed deals",
    description:
      "Match your event with banks, telcos, and fintech brands already funding events in Nigeria, Kenya, Ghana, and South Africa. Generate tailored pitch letters with one click.",
    highlight: "Pipeline view: Contacted → Pitch Sent → Term Sheet → Funded",
    color: "#6C1EF5",
    fg: "#F5F0E6",
    Icon: ChaseIcon,
  },
  {
    step: "03 / 04",
    duration: "0:30 – 0:45",
    name: "Buzz",
    title: "Run a 90-day hype engine without burnout",
    description:
      "Buzz builds your complete countdown calendar — speaker reveals, early-bird drops, WhatsApp community broadcasts, and sponsor shoutouts scheduled to perfection.",
    highlight: "Built for IG Reels, X threads, LinkedIn & WhatsApp channels",
    color: "#FF5C5C",
    fg: "#0A0A0A",
    Icon: BuzzIcon,
  },
  {
    step: "04 / 04",
    duration: "0:45 – 1:00",
    name: "D-Day",
    title: "Zero-lag QR check-in, even when Wi-Fi drops",
    description:
      "Scan 1,500+ attendees on standard Android phones with offline sync, separate VIP/VVIP counters, instant badge printing, and verifiable post-event certificates.",
    highlight: "0.3s scan speed · Works on 2G/3G & completely offline",
    color: "#FFB800",
    fg: "#0A0A0A",
    Icon: DDayIcon,
  },
];

export const TourModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [idx, setIdx] = useState(0);
  if (!open) return null;

  const slide = tourSlides[idx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-[1.5rem] border border-[#262626] bg-[#0A0A0A] text-[#F5F0E6] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top module colour banner */}
        <div
          style={{ backgroundColor: slide.color, color: slide.fg }}
          className="p-6 sm:p-8 flex items-start justify-between gap-4 transition-colors duration-200"
        >
          <div>
            <div className="flex items-center gap-3 font-satoshi text-xs font-bold uppercase tracking-wider opacity-80">
              <span>{slide.step}</span>
              <span>·</span>
              <span>{slide.duration}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <slide.Icon className="w-8 h-8" />
              <h3
                id="tour-modal-title"
                className="font-clash font-bold text-3xl sm:text-4xl leading-none"
              >
                {slide.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tour"
            className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/15 hover:bg-black/25 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <h4 className="font-cabinet font-extrabold text-2xl sm:text-3xl leading-tight">
            {slide.title}
          </h4>
          <p className="font-satoshi text-base leading-relaxed text-[#A1A1A1]">
            {slide.description}
          </p>
          <div className="rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 font-satoshi text-sm text-[#C8FF00]">
            {slide.highlight}
          </div>

          {/* Step progress tabs */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {tourSlides.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Jump to ${s.name}`}
                className="checking-focus group py-2 text-left"
              >
                <div
                  className="h-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: i <= idx ? slide.color : "#262626",
                  }}
                />
                <span
                  className={`mt-1.5 block font-satoshi text-xs font-medium ${
                    i === idx ? "text-[#F5F0E6]" : "text-[#A1A1A1]"
                  }`}
                >
                  {s.name}
                </span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIdx((prev) => (prev === 0 ? tourSlides.length - 1 : prev - 1))}
                aria-label="Previous step"
                className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#262626] hover:border-[#C8FF00] text-[#F5F0E6]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIdx((prev) => (prev + 1) % tourSlides.length)}
                aria-label="Next step"
                className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#262626] hover:border-[#C8FF00] text-[#F5F0E6]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/signup"
              onClick={onClose}
              className="checking-focus inline-flex items-center gap-2 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-sm px-6 py-3 min-h-[44px] rounded-full hover:scale-[1.03] transition-transform"
            >
              <span>Try it free now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   2. Transparent Pricing Modal (NGN / KES / USD)
   -------------------------------------------------------------------------- */
type CurrencyCode = "NGN" | "KES" | "USD";

const pricingMap: Record<CurrencyCode, { pro: string; summit: string }> = {
  NGN: { pro: "₦25,000", summit: "₦95,000" },
  KES: { pro: "KSh 2,400", summit: "KSh 8,900" },
  USD: { pro: "$19", summit: "$69" },
};

export const PricingModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onBookDemo: () => void;
}> = ({ open, onClose, onBookDemo }) => {
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  if (!open) return null;

  const prices = pricingMap[currency];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-[1.5rem] border border-[#262626] bg-[#0A0A0A] text-[#F5F0E6] p-6 sm:p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#262626]">
          <div>
            <p className="font-clash font-bold text-xs uppercase tracking-[0.16em] text-[#C8FF00]">
              Simple Pan-African Pricing
            </p>
            <h3
              id="pricing-modal-title"
              className="mt-1 font-cabinet font-extrabold text-3xl sm:text-4xl"
            >
              Start free. Scale when you sell out.
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-[#262626] bg-[#141414] p-1">
              {(["NGN", "KES", "USD"] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`checking-focus px-3 py-1.5 rounded-full font-satoshi text-xs font-bold transition-colors ${
                    currency === c
                      ? "bg-[#C8FF00] text-[#0A0A0A]"
                      : "text-[#A1A1A1] hover:text-[#F5F0E6]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close pricing"
              className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#262626] hover:border-[#C8FF00]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter Free */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 flex flex-col justify-between">
            <div>
              <p className="font-clash font-bold text-lg">Starter</p>
              <p className="mt-3 font-clash font-bold text-4xl tabular-nums">Free</p>
              <p className="mt-1 font-satoshi text-xs text-[#A1A1A1]">
                Forever · No card required
              </p>
              <ul className="mt-6 space-y-2.5 font-satoshi text-sm text-[#F5F0E6]/85">
                {[
                  "1 active event workspace",
                  "Spark AI naming & theme studio",
                  "Up to 250 QR check-ins",
                  "Public registration link",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C8FF00] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/signup"
              onClick={onClose}
              className="checking-focus mt-7 inline-flex items-center justify-center border border-[#F5F0E6]/30 hover:border-[#C8FF00] font-satoshi font-bold text-sm min-h-[44px] rounded-full transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Organiser Pro */}
          <div className="rounded-2xl border-2 border-[#C8FF00] bg-[#141414] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-clash font-bold text-lg text-[#C8FF00]">Organiser Pro</p>
                <span className="font-satoshi text-[11px] font-bold uppercase text-[#0A0A0A] bg-[#C8FF00] px-2.5 py-0.5 rounded-full">
                  Popular
                </span>
              </div>
              <p className="mt-3 font-clash font-bold text-4xl tabular-nums">
                {prices.pro}
                <span className="font-satoshi text-sm font-normal text-[#A1A1A1]"> /event</span>
              </p>
              <p className="mt-1 font-satoshi text-xs text-[#A1A1A1]">
                Pay via Paystack, Flutterwave or M-Pesa
              </p>
              <ul className="mt-6 space-y-2.5 font-satoshi text-sm text-[#F5F0E6]/90">
                {[
                  "All 4 modules: Spark, Chase, Buzz, D-Day",
                  "Unlimited AI sponsor pitch decks",
                  "Up to 3,000 offline QR check-ins",
                  "VIP/VVIP badges & auto certificates",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C8FF00] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/signup"
              onClick={onClose}
              className="checking-focus mt-7 inline-flex items-center justify-center gap-1.5 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-sm min-h-[44px] rounded-full hover:scale-[1.02] transition-transform"
            >
              <span>Launch with Pro</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Summit & Awards */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 flex flex-col justify-between">
            <div>
              <p className="font-clash font-bold text-lg">Summit &amp; Gov</p>
              <p className="mt-3 font-clash font-bold text-4xl tabular-nums">
                {prices.summit}
                <span className="font-satoshi text-sm font-normal text-[#A1A1A1]"> /event</span>
              </p>
              <p className="mt-1 font-satoshi text-xs text-[#A1A1A1]">
                For corporate summits &amp; national galas
              </p>
              <ul className="mt-6 space-y-2.5 font-satoshi text-sm text-[#F5F0E6]/85">
                {[
                  "Unlimited attendees & team seats",
                  "Dedicated multi-gate D-Day ops",
                  "Custom sponsor portal & invoicing",
                  "Priority WhatsApp war-room support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C8FF00] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookDemo();
              }}
              className="checking-focus mt-7 inline-flex items-center justify-center border border-[#F5F0E6]/30 hover:border-[#C8FF00] font-satoshi font-bold text-sm min-h-[44px] rounded-full transition-colors"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   3. Validated Book-a-Demo Modal
   -------------------------------------------------------------------------- */
export const DemoModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Lagos, Nigeria");
  const [eventSize, setEventSize] = useState("500 – 2,000 attendees");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter your name and a valid work email.");
      return;
    }
    setSubmitted(true);
    toast.success("Demo request received! We’ll send calendar slots within 2 hours.");
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={resetAndClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[1.5rem] border border-[#262626] bg-[#0A0A0A] text-[#F5F0E6] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-clash font-bold text-xs uppercase tracking-[0.16em] text-[#C8FF00]">
              Live Walkthrough
            </p>
            <h3
              id="demo-modal-title"
              className="mt-1 font-cabinet font-extrabold text-3xl"
            >
              Book a 15-min demo
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close demo dialog"
            className="checking-focus inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#262626] hover:border-[#C8FF00]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-[#C8FF00]/40 bg-[#141414] p-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#C8FF00] text-[#0A0A0A] flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-cabinet font-extrabold text-2xl">You’re on the list!</h4>
            <p className="font-satoshi text-sm text-[#A1A1A1]">
              Our partnerships team will email <span className="text-[#F5F0E6]">{email}</span> with
              a live walkthrough link tailored for <span className="text-[#F5F0E6]">{city}</span>.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="checking-focus mt-3 inline-flex items-center justify-center bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-sm px-6 py-3 min-h-[44px] rounded-full"
            >
              Back to Checking
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="demo-name" className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#A1A1A1] mb-1.5">
                Full Name
              </label>
              <input
                id="demo-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amara Okafor"
                className="checking-focus w-full rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 font-satoshi text-base text-[#F5F0E6] placeholder:text-[#A1A1A1]/50"
              />
            </div>

            <div>
              <label htmlFor="demo-email" className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#A1A1A1] mb-1.5">
                Work Email
              </label>
              <input
                id="demo-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amara@africatechsummit.com"
                className="checking-focus w-full rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 font-satoshi text-base text-[#F5F0E6] placeholder:text-[#A1A1A1]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="demo-city" className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#A1A1A1] mb-1.5">
                  Event City
                </label>
                <input
                  id="demo-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="checking-focus w-full rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 font-satoshi text-base text-[#F5F0E6]"
                />
              </div>
              <div>
                <label htmlFor="demo-size" className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#A1A1A1] mb-1.5">
                  Expected Crowd
                </label>
                <select
                  id="demo-size"
                  value={eventSize}
                  onChange={(e) => setEventSize(e.target.value)}
                  className="checking-focus w-full rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 font-satoshi text-base text-[#F5F0E6]"
                >
                  <option>Under 500 attendees</option>
                  <option>500 – 2,000 attendees</option>
                  <option>2,000 – 10,000 attendees</option>
                  <option>10,000+ festival / gala</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="checking-focus w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-base min-h-[52px] rounded-full hover:scale-[1.01] transition-transform"
            >
              <span>Request Live Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
