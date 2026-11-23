import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenPricing: () => void;
}

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing", isModal: true },
  { label: "Stories", href: "#stories" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenPricing }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isModal?: boolean
  ) => {
    if (isModal) {
      e.preventDefault();
      setMobileOpen(false);
      onOpenPricing();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    }
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto mx-auto flex items-center justify-between gap-4 md:gap-8 rounded-full transition-all duration-200 ease-out backdrop-blur-xl ${
            scrolled
              ? "max-w-4xl px-4 sm:px-5 py-2 bg-[#0A0A0A]/88 border border-[#F5F0E6]/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
              : "max-w-5xl px-5 sm:px-6 py-2.5 bg-[#0A0A0A]/75 border border-[#F5F0E6]/10"
          }`}
        >
          {/* Left: Wordmark with subtle lime dot */}
          <Link
            to="/"
            className="myevent-focus flex items-center gap-1.5 font-cabinet font-extrabold text-xl sm:text-2xl tracking-tight text-[#F5F0E6] whitespace-nowrap shrink-0 rounded-full px-1"
          >
            <span>Myevent</span>
            <span
              className="inline-block w-2 h-2 rounded-full bg-[#C8FF00] translate-y-[2px]"
              aria-hidden="true"
            />
          </Link>

          {/* Center: Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href, item.isModal)}
                className="myevent-focus nav-underline font-satoshi font-medium text-sm text-[#F5F0E6]/85 hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: Actions + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/auth"
              className="myevent-focus hidden sm:inline-flex items-center justify-center font-satoshi font-medium text-sm text-[#F5F0E6]/85 hover:text-[#F5F0E6] px-3.5 py-2 min-h-[40px] rounded-full transition-colors whitespace-nowrap shrink-0"
            >
              Log in
            </Link>

            <Link
              to="/auth"
              className="myevent-focus group inline-flex items-center justify-center gap-1.5 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-sm px-4 sm:px-5 py-2.5 min-h-[42px] rounded-full hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(200,255,0,0.45)] transition-all duration-150 whitespace-nowrap shrink-0"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="myevent-focus md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#F5F0E6]/15 text-[#F5F0E6] hover:border-[#C8FF00] transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen Mobile Editorial Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-[#0A0A0A] flex flex-col justify-between px-6 pt-28 pb-10 overflow-y-auto"
          >
            {/* Mesh-gradient background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                background:
                  "radial-gradient(circle at 80% 18%, rgba(108,30,245,0.65) 0%, transparent 50%), radial-gradient(circle at 18% 82%, rgba(255,92,92,0.45) 0%, transparent 48%), radial-gradient(circle at 50% 50%, rgba(200,255,0,0.14) 0%, transparent 55%)",
              }}
              aria-hidden="true"
            />
            <div className="editorial-grain absolute inset-0" aria-hidden="true" />

            <div className="relative z-10 flex flex-col gap-3 mt-4">
              {navLinks.map((item, idx) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href, item.isModal)}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: prefersReducedMotion ? 0 : idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="myevent-focus font-clash font-bold text-5xl sm:text-6xl tracking-tight text-[#F5F0E6] hover:text-[#C8FF00] transition-colors py-1"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              className="relative z-10 flex flex-col gap-3 pt-8 border-t border-[#F5F0E6]/15"
            >
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="myevent-focus w-full inline-flex items-center justify-center gap-2 bg-[#C8FF00] text-[#0A0A0A] font-satoshi font-bold text-base min-h-[52px] rounded-full"
              >
                Start planning free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="myevent-focus w-full inline-flex items-center justify-center border border-[#F5F0E6]/25 text-[#F5F0E6] font-satoshi font-medium text-base min-h-[52px] rounded-full"
              >
                Log in to workspace
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
