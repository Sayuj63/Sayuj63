"use client";

import { useEffect, useRef, useState } from "react";

import { fetchFAQs } from "@/lib/api";

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

export default function FAQSection() {
  const { ref, visible } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs().then((data: any[]) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <>
      <style>{`
        .faq-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .faq-answer-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s ease;
        }
        .faq-answer-wrap.open {
          grid-template-rows: 1fr;
        }
        .faq-answer-inner {
          overflow: hidden;
        }
        .faq-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .faq-chevron {
          width: 20px;
          height: 20px;
          border-right: 2px solid #00e5ff;
          border-bottom: 2px solid #00e5ff;
          transform: rotate(45deg);
          transition: transform 0.35s ease, border-color 0.3s ease;
          flex-shrink: 0;
          margin-left: auto;
        }
        .faq-chevron.open {
          transform: rotate(-135deg);
        }
        .faq-card {
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .faq-card:hover {
          border-color: rgba(0,229,255,0.4) !important;
          box-shadow: 0 16px 50px rgba(0,229,255,0.12);
        }
        .faq-card.active-card {
          border-color: #00e5ff !important;
          box-shadow: 0 20px 60px rgba(0,229,255,0.15);
          background: rgba(0,229,255,0.03) !important;
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center relative"
        style={{ padding: "140px 20px" }}
      >
        {/* TITLE */}
        <h2
          className="text-white font-bold mb-3"
          style={{
            fontSize: "44px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          Frequently Asked{" "}
          <span className="faq-gradient-text">Questions</span>
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
          Everything you need to know about MentorLeap programs and the MISHA
          AI learning assistant.
        </p>

        {/* FAQ LIST */}
        <div
          className="mx-auto flex flex-col"
          suppressHydrationWarning
          style={{ maxWidth: "900px", gap: "18px" }}
        >
          {[
            { q: "What is MentorLeap?", a: "MentorLeap is an AI-powered professional development platform founded by Mridu Bhandari. It combines real-world leadership frameworks with MISHA — an intelligent mentorship assistant designed to help professionals master communication, confidence, and career growth." },
            { q: "How does MISHA help learners?", a: "MISHA provides 24×7 support by helping you structure your narrative, increase visibility, and strengthen your professional voice. Whether you are preparing for high-stakes meetings or seeking career clarity, MISHA offers instant, intelligence-driven guidance." },
            { q: "Is there a certificate for the programs?", a: "Yes, every professional program at MentorLeap, including our bootcamps and masterclasses, comes with a verified Certificate of Completion. These certificates recognize your commitment to strategic leadership and advanced communication skills." }
          ].map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`faq-card rounded-2xl text-left ${isOpen ? "active-card" : ""}`}
                onClick={() => toggle(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "rgba(2,6,23,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "20px 24px",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${0.2 + i * 0.08}s, transform 0.5s ease ${0.2 + i * 0.08}s, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease`,
                }}
              >
                {/* QUESTION ROW */}
                <div className="flex items-center gap-3">
                  <div
                    className="faq-icon-btn"
                    style={{
                      background: isOpen
                        ? "linear-gradient(135deg, #00e5ff, #6366f1)"
                        : "#00e5ff",
                      color: "#020617",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    {isOpen ? "×" : "?"}
                  </div>

                  <span
                    className="font-medium flex-1"
                    style={{
                      fontSize: "17px",
                      color: isOpen ? "white" : "#e2e8f0",
                    }}
                  >
                    {faq.q}
                  </span>

                  <div className={`faq-chevron ${isOpen ? "open" : ""}`} />
                </div>

                {/* ANSWER */}
                <div className={`faq-answer-wrap ${isOpen ? "open" : ""}`}>
                  <div className="faq-answer-inner">
                    <p
                      style={{
                        color: "#cbd5f5",
                        fontSize: "14px",
                        lineHeight: "1.7",
                        paddingTop: "16px",
                        paddingLeft: "38px",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        marginTop: "16px",
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}