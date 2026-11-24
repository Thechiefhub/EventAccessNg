import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { AdinkraMicroMark } from "@/assets/patterns";

export interface CountdownEventItem {
  id: string;
  name: string;
  event_date: string | null;
  city: string | null;
  country: string | null;
  event_type: string | null;
}

interface EventCountdownTimerProps {
  events: CountdownEventItem[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLiveOrPast: boolean;
}

function computeRemaining(targetIso: string): TimeRemaining {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  if (Number.isNaN(target) || target <= now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLiveOrPast: true };
  }
  const diffSec = Math.floor((target - now) / 1000);
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  return { days, hours, minutes, seconds, isLiveOrPast: false };
}

export const EventCountdownTimer: React.FC<EventCountdownTimerProps> = ({ events }) => {
  const datedEvents = useMemo(
    () =>
      events
        .filter((e) => Boolean(e.event_date))
        .sort(
          (a, b) =>
            new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime()
        ),
    [events]
  );

  const upcomingDefault = useMemo(() => {
    const now = Date.now();
    return (
      datedEvents.find((e) => new Date(e.event_date!).getTime() > now) ||
      datedEvents[0] ||
      null
    );
  }, [datedEvents]);

  const [selectedId, setSelectedId] = useState<string>("");

  const activeEvent = useMemo(() => {
    if (selectedId) {
      const found = datedEvents.find((e) => e.id === selectedId);
      if (found) return found;
    }
    return upcomingDefault;
  }, [selectedId, datedEvents, upcomingDefault]);

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    activeEvent?.event_date
      ? computeRemaining(activeEvent.event_date)
      : { days: 0, hours: 0, minutes: 0, seconds: 0, isLiveOrPast: false }
  );

  useEffect(() => {
    if (!activeEvent?.event_date) return;
    setTimeLeft(computeRemaining(activeEvent.event_date));
    const timer = window.setInterval(() => {
      setTimeLeft(computeRemaining(activeEvent.event_date!));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeEvent?.event_date]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      aria-label="Active event countdown"
      className="relative overflow-hidden rounded-[1.5rem] bg-[#0A0A0A] text-[#F5F0E6] border-2 border-[#262626] p-6 sm:p-8 lg:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      {/* Award-show spotlight glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-35 blur-[95px]"
        style={{
          background:
            "radial-gradient(circle, rgba(200,255,0,0.5) 0%, rgba(108,30,245,0.45) 55%, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div className="editorial-grain absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none hidden sm:block absolute bottom-4 right-6 text-[#C8FF00]/10"
        aria-hidden="true"
      >
        <AdinkraMicroMark className="w-16 h-16" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Active Event Context */}
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/50 bg-[#141414] px-3.5 py-1">
            <span className="checking-dot-pulse w-2 h-2 rounded-full bg-[#C8FF00]" aria-hidden="true" />
            <span className="font-clash font-bold text-[11px] uppercase tracking-[0.18em] text-[#C8FF00]">
              {activeEvent
                ? timeLeft.isLiveOrPast
                  ? "Showtime Live"
                  : "Countdown to Doors Open"
                : "Showtime Clock"}
            </span>
          </div>

          {activeEvent ? (
            <>
              <h2 className="font-clash font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[0.98] tracking-[-0.03em] text-[#F5F0E6]">
                {activeEvent.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-satoshi text-sm text-[#A1A1A1]">
                {activeEvent.event_date && (
                  <span className="inline-flex items-center gap-1.5 text-[#F5F0E6]/90">
                    <CalendarDays className="w-4 h-4 text-[#C8FF00]" />
                    {format(new Date(activeEvent.event_date), "EEEE, MMM d, yyyy")}
                  </span>
                )}
                {(activeEvent.city || activeEvent.country) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FFB800]" />
                    {[activeEvent.city, activeEvent.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>

              {datedEvents.length > 1 && (
                <div className="pt-1">
                  <label htmlFor="countdown-event-picker" className="sr-only">
                    Select active project for countdown
                  </label>
                  <select
                    id="countdown-event-picker"
                    value={activeEvent.id}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="checking-focus rounded-lg border border-[#262626] bg-[#141414] px-3 py-1.5 font-satoshi text-xs font-medium text-[#F5F0E6]"
                  >
                    {datedEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        Switch project: {ev.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-clash font-bold text-3xl sm:text-4xl leading-[1.02] tracking-[-0.03em] text-[#F5F0E6]">
                Set your <span className="text-stroke-lime">showtime</span> date.
              </h2>
              <p className="font-satoshi text-sm sm:text-base text-[#A1A1A1]">
                Create an event with a target date to fire up your live Award-Show
                countdown clock across Checking.
              </p>
            </>
          )}
        </div>

        {/* Right: Award-Show Clash Display Countdown Digits */}
        {activeEvent ? (
          timeLeft.isLiveOrPast ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="rounded-2xl border-2 border-[#C8FF00] bg-[#C8FF00]/10 px-6 py-4">
                <p className="font-clash font-bold text-3xl sm:text-4xl uppercase tracking-[-0.03em] text-[#C8FF00] flex items-center gap-2">
                  <Sparkles className="w-7 h-7" />
                  IT’S SHOWTIME
                </p>
              </div>
              <Link
                to="/dashboard/dday"
                className="checking-focus inline-flex items-center gap-2 rounded-full bg-[#C8FF00] text-[#0A0A0A] font-cabinet font-bold text-sm px-5 py-3 min-h-[44px] hover:scale-[1.03] transition-transform"
              >
                <span>Launch D-Day Gate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div
              className="grid grid-cols-4 gap-2.5 sm:gap-4 shrink-0"
              role="timer"
              aria-live="off"
            >
              {[
                { label: "DAYS", value: pad(timeLeft.days) },
                { label: "HRS", value: pad(timeLeft.hours) },
                { label: "MIN", value: pad(timeLeft.minutes) },
                { label: "SEC", value: pad(timeLeft.seconds) },
              ].map((unit, idx) => (
                <div
                  key={unit.label}
                  className={`rounded-2xl border px-3 py-3.5 sm:px-5 sm:py-4 text-center min-w-[70px] sm:min-w-[96px] ${
                    idx === 0
                      ? "bg-[#C8FF00] text-[#0A0A0A] border-[#C8FF00]"
                      : "bg-[#141414] text-[#F5F0E6] border-[#262626]"
                  }`}
                >
                  <div
                    className={`font-clash font-bold text-3xl sm:text-5xl leading-none tracking-[-0.04em] tabular-nums ${
                      idx === 0 ? "text-[#0A0A0A]" : "text-[#C8FF00]"
                    }`}
                  >
                    {unit.value}
                  </div>
                  <div
                    className={`mt-1.5 font-satoshi text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase ${
                      idx === 0 ? "text-[#0A0A0A]/80" : "text-[#A1A1A1]"
                    }`}
                  >
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 opacity-50 select-none">
            {["DAYS", "HRS", "MIN", "SEC"].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-[#262626] bg-[#141414] px-4 py-4 text-center min-w-[70px] sm:min-w-[90px]"
              >
                <div className="font-clash font-bold text-3xl sm:text-4xl text-[#C8FF00] tabular-nums">
                  00
                </div>
                <div className="mt-1 font-satoshi text-[10px] font-bold tracking-[0.16em] text-[#A1A1A1]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
