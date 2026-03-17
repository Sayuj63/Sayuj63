"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  "Executive communication training",
  "Leadership presence development",
  "Team confidence and collaboration",
  "Strategic communication frameworks",
  "Professional presentation skills",
  "AI-assisted learning with MentorLeap",
];

const corpReviews = [
  {
    text: "Mridu Bhandari's session transformed the way our leadership team approaches communication and executive presence.",
    author: "HR Director — Technology Company, Bangalore",
  },
  {
    text: "The leadership communication frameworks shared during the training were extremely practical and impactful for our management team.",
    author: "VP Human Resources — Financial Services, Mumbai",
  },
  {
    text: "One of the most engaging corporate sessions we have conducted for our team. The impact was visible immediately.",
    author: "Learning & Development Head — Consulting Firm, Delhi",
  },
  {
    text: "Highly insightful leadership communication training. Our managers gained clarity on professional presence and influence.",
    author: "HR Business Partner — Global IT Company, Hyderabad",
  },
];

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

export default function CorporateSection() {
  const { ref, visible } = useInView();
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .corp-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .corp-btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 30px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          color: white;
          text-decoration: none;
          font-size: 14px;
          box-shadow: 0 6px 20px rgba(0,229,255,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .corp-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 30px rgba(0,229,255,0.45);
        }
        .corp-btn:active { transform: scale(0.97); }

        .benefit-li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cbd5f5;
          font-size: 14px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .benefit-li:last-child { border-bottom: none; }
        .benefit-li:hover {
          color: white;
          transform: translateX(4px);
        }
        .benefit-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00e5ff, #6366f1);
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .benefit-li:hover .benefit-dot {
          transform: scale(1.6);
        }

        .corp-review-card {
          transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
          border-left: 2px solid rgba(0,229,255,0.2);
        }
        .corp-review-card:hover {
          transform: translateX(5px);
          border-left-color: #00e5ff;
          background: rgba(0,229,255,0.03) !important;
        }

        .corp-quote-mark {
          font-size: 32px;
          color: rgba(0,229,255,0.15);
          font-family: Georgia, serif;
          line-height: 1;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }
        .corp-review-card:hover .corp-quote-mark {
          color: rgba(0,229,255,0.35);
        }

        .panel-hover {
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .panel-hover:hover {
          border-color: rgba(0,229,255,0.2) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center"
        style={{ padding: "120px 20px" }}
      >
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>

          {/* TITLE */}
          <h2
            className="text-white font-bold mb-3"
            style={{
              fontSize: "40px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-20px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            Corporate Leadership Training by{" "}
            <span className="corp-gradient-text">Mridu Bhandari</span>
          </h2>

          {/* SUBTITLE */}
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
            MentorLeap delivers high-impact communication and leadership
            training programs designed specifically for corporate teams,
            executives, and emerging leaders.
          </p>

          {/* GRID */}
          <div
            className="grid gap-12 text-left"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            suppressHydrationWarning
          >

            {/* BENEFITS PANEL */}
            <div
              className="panel-hover rounded-xl"
              style={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "35px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-30px)",
                transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
              }}
            >
              <h3
                className="text-white font-semibold mb-5"
                style={{ fontSize: "18px" }}
              >
                🏢 What Organizations Gain
              </h3>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
                {benefits.map((b, i) => (
                  <li
                    key={b}
                    className="benefit-li"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateX(0)" : "translateX(-12px)",
                      transition: `opacity 0.4s ease ${0.4 + i * 0.07}s, transform 0.4s ease ${0.4 + i * 0.07}s`,
                    }}
                  >
                    <span className="benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="corp-btn">
                Book Corporate Training
              </Link>
            </div>

            {/* REVIEWS PANEL */}
            <div
              className="panel-hover rounded-xl"
              style={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "35px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(30px)",
                transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
              }}
            >
              <h3
                className="text-white font-semibold mb-6"
                style={{ fontSize: "18px" }}
              >
                💬 What Corporate Teams Say
              </h3>

              <div className="flex flex-col gap-5">
                {corpReviews.map((r, i) => (
                  <div
                    key={i}
                    className="corp-review-card rounded-r-lg pl-4 py-2 pr-2"
                    onMouseEnter={() => setHoveredReview(i)}
                    onMouseLeave={() => setHoveredReview(null)}
                    style={{
                      background: "transparent",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 0.4s ease ${0.5 + i * 0.1}s, transform 0.4s ease ${0.5 + i * 0.1}s`,
                    }}
                  >
                    <div className="corp-quote-mark">"</div>
                    <p
                      className="mb-2"
                      style={{ color: "#cbd5f5", fontSize: "14px", lineHeight: "1.6" }}
                    >
                      {r.text}
                    </p>
                    <span
                      style={{
                        color: "#00e5ff",
                        fontSize: "12px",
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      — {r.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}