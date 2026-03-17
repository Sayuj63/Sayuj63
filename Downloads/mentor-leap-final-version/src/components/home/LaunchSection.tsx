"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const LAUNCH_DATE = new Date("March 15, 2026 00:00:00").getTime();

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetMs: number): TimeLeft {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const dist = targetMs - Date.now();
      if (dist <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(dist / 86400000),
        hours: Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000) / 60000),
        seconds: Math.floor((dist % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl"
      style={{
        background: "#020617",
        border: "1px solid rgba(0,229,255,0.15)",
        padding: "20px 28px",
        minWidth: "90px",
        boxShadow: "0 4px 24px rgba(0,229,255,0.08)",
      }}
    >
      <span
        style={{
          fontSize: "42px",
          fontWeight: 700,
          color: flash ? "#ffffff" : "#00e5ff",
          transition: "color 0.3s ease, transform 0.3s ease",
          transform: flash ? "scale(1.15)" : "scale(1)",
          display: "block",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginTop: "6px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

import { fetchEvents } from "@/lib/api";

export default function LaunchSection() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);
  const time = useCountdown(LAUNCH_DATE);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data.slice(0, 2)); // Show top 2 events
      setLoading(false);
    });
  }, []);

  return (
    <>
      <style>{`
        .launch-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes glowRotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ai-glow {
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(0,229,255,0.12), transparent);
          animation: glowRotate 8s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        .launch-btn {
          display: inline-block;
          padding: 13px 26px;
          border-radius: 30px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          color: white;
          text-decoration: none;
          font-size: 14px;
          box-shadow: 0 6px 20px rgba(0,229,255,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 2;
        }
        .launch-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 30px rgba(0,229,255,0.45);
        }
        .launch-btn:active { transform: scale(0.97); }

        @keyframes countdownIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .countdown-animate {
          animation: countdownIn 0.7s ease 0.8s both;
        }

        /* separator colon blink */
        @keyframes colonBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        .colon {
          font-size: 36px;
          color: rgba(0,229,255,0.4);
          font-weight: 300;
          animation: colonBlink 1s step-end infinite;
          padding-bottom: 16px;
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center relative overflow-hidden"
        style={{ padding: "140px 20px" }}
      >
        {/* TITLE */}
        <h2
          className="text-white font-bold mb-3"
          style={{
            fontSize: "46px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          Join the{" "}
          <span className="launch-gradient-text">MentorLeap Launch</span>
        </h2>

        <p
          className="mb-16"
          style={{
            color: "#94a3b8",
            fontSize: "15px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          Unlock leadership confidence with Mridu Bhandari and the MentorLeap
          AI ecosystem.
        </p>

        {/* CARDS GRID */}
        {!loading && events.length > 0 && (
          <div
            className="mx-auto grid gap-10"
            style={{ 
              maxWidth: "1100px", 
              gridTemplateColumns: events.length === 1 ? "1fr" : "repeat(2, 1fr)" 
            }}
            suppressHydrationWarning
          >
            {events.map((event, i) => (
              <div
                key={event.id}
                className="relative rounded-2xl overflow-hidden text-left"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#020617",
                  padding: "40px",
                  border: hovered === i
                    ? "1px solid #00e5ff"
                    : "1px solid rgba(255,255,255,0.08)",
                  transform: visible
                    ? hovered === i ? "translateY(-10px)" : "translateY(0)"
                    : "translateY(40px)",
                  boxShadow: hovered === i
                    ? "0 30px 70px rgba(0,229,255,0.2)"
                    : "none",
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.6s ease ${0.2 + i * 0.15}s, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease`,
                }}
              >
                <div className="ai-glow" />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <h3
                    className="text-white font-bold mb-2"
                    style={{ fontSize: "24px" }}
                  >
                    {event.title}
                  </h3>

                  <p
                    className="mb-4 font-medium"
                    style={{ color: "#00e5ff", fontSize: "14px" }}
                  >
                    📅 {event.date?._seconds ? new Date(event.date._seconds * 1000).toLocaleDateString() : new Date(event.date).toLocaleDateString()}
                  </p>

                  <p
                    className="mb-6"
                    style={{ color: "#cbd5f5", fontSize: "14px", lineHeight: "1.6" }}
                  >
                    {event.description}
                  </p>

                  {/* PRICE */}
                  <div
                    className="font-bold mb-6"
                    style={{ fontSize: "24px", color: "white" }}
                  >
                    {event.price === 0 ? "FREE" : `₹${event.price}`}
                  </div>

                  <Link href={`/events/${event.id}`} className="launch-btn">
                    Reserve Your Seat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COUNTDOWN */}
        {visible && (
          <div className="countdown-animate mt-20">
            <h4
              className="text-white font-semibold mb-6"
              style={{ fontSize: "18px", letterSpacing: "1px" }}
            >
              🚀 Launch Starts In
            </h4>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <CountdownUnit value={time.days} label="Days" />
              <span className="colon">:</span>
              <CountdownUnit value={time.hours} label="Hours" />
              <span className="colon">:</span>
              <CountdownUnit value={time.minutes} label="Minutes" />
              <span className="colon">:</span>
              <CountdownUnit value={time.seconds} label="Seconds" />
            </div>
          </div>
        )}
      </section>
    </>
  );
}