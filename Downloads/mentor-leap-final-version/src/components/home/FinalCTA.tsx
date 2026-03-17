"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useInView(threshold = 0.15) {
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

export default function FinalCTA() {
  const { ref, visible } = useInView();

  return (
    <>
      <style>{`
        .cta-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes aiMove {
          0%   { transform: scale(1)   rotate(0deg); }
          100% { transform: scale(1.2) rotate(3deg); }
        }
        .cta-ai-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 40%, rgba(0,229,255,0.18), transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(99,102,241,0.18), transparent 40%);
          animation: aiMove 12s ease-in-out infinite alternate;
          z-index: 0;
        }

        /* extra subtle grid overlay for depth */
        .cta-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes pulseBtn {
          0%   { box-shadow: 0 0 0 0   rgba(0,229,255,0.55); }
          70%  { box-shadow: 0 0 0 20px rgba(0,229,255,0);   }
          100% { box-shadow: 0 0 0 0   rgba(0,229,255,0);    }
        }
        .cta-btn-primary {
          padding: 14px 30px;
          border-radius: 30px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          animation: pulseBtn 2.5s infinite;
          transition: transform 0.2s ease, opacity 0.2s ease;
          display: inline-block;
        }
        .cta-btn-primary:hover {
          transform: translateY(-3px) scale(1.04);
          opacity: 0.92;
        }
        .cta-btn-primary:active { transform: scale(0.97); }

        .cta-btn-secondary {
          padding: 14px 30px;
          border-radius: 30px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: inline-block;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-3px);
        }

        .cta-btn-outline {
          padding: 14px 30px;
          border-radius: 30px;
          border: 1px solid #00e5ff;
          color: #00e5ff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: inline-block;
          transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .cta-btn-outline:hover {
          background: rgba(0,229,255,0.08);
          box-shadow: 0 0 20px rgba(0,229,255,0.25);
          transform: translateY(-3px);
        }

        /* highlight row */
        .cta-highlight-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .cta-highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #00e5ff;
          transition: transform 0.25s ease;
        }
        .cta-highlight-item:hover {
          transform: translateY(-2px);
        }
        .cta-highlight-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00e5ff;
          box-shadow: 0 0 8px rgba(0,229,255,0.7);
          flex-shrink: 0;
        }

        /* border glow on section */
        .cta-section-border {
          border-top: 1px solid rgba(0,229,255,0.1);
          border-bottom: 1px solid rgba(99,102,241,0.1);
        }
      `}</style>

      <section
        ref={ref}
        className="cta-section-border relative w-full text-center overflow-hidden"
        style={{ padding: "140px 20px" }}
      >
        {/* BACKGROUNDS */}
        <div className="cta-ai-bg" />
        <div className="cta-grid-overlay" />

        {/* CONTENT */}
        <div
          className="relative mx-auto"
          style={{ maxWidth: "900px", zIndex: 2 }}
          suppressHydrationWarning
        >

          {/* EYEBROW */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.2)",
              borderRadius: "20px",
              padding: "6px 16px",
              marginBottom: "24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            <span style={{ color: "#00e5ff", fontSize: "11px", fontWeight: 700, letterSpacing: "2px" }}>
              🚀 LAUNCHING MARCH 2026
            </span>
          </div>

          {/* HEADING */}
          <h2
            className="text-white font-bold mb-8"
            style={{
              fontSize: "44px",
              lineHeight: "1.2",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            Ready to Master the{" "}
            <span className="cta-gradient-text">Language of Leadership?</span>
          </h2>


          {/* PARAGRAPH */}
          <p
            className="mx-auto mb-8"
            style={{
              color: "#cbd5f5",
              fontSize: "16px",
              lineHeight: "1.7",
              maxWidth: "680px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
            }}
          >
            Join thousands of professionals preparing to upgrade their
            communication, leadership presence and career clarity with
            MentorLeap and MISHA AI.
          </p>

          {/* HIGHLIGHT PILLS */}
          <div
            className="cta-highlight-row mb-10"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            }}
          >
            {[
              "Expert Led Communication Mastery",
              "AI-Powered Personalized Growth",
              "Global Professional Community"
            ].map((item) => (
              <div key={item} className="cta-highlight-item">
                <span className="cta-highlight-dot" />
                {item}
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div
            className="flex flex-wrap justify-center gap-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.95)",
              transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
            }}
          >
            <Link
              href="/courses/speak-with-impact-bootcamp"
              className="px-10 py-4 bg-[#00e5ff] text-[#020617] font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all no-underline"
            >
              Secure Your Seat
            </Link>
            <Link
              href="/events/speak-with-impact-bootcamp"
              className="px-10 py-4 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all no-underline"
            >
              Explore Bootcamp Details
            </Link>
            <Link
              href="/hire-anchor"
              className="px-10 py-4 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-full hover:bg-[#00e5ff]/5 transition-all no-underline"
            >
              Hire Mridu as Anchor
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}