"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Clarity in Communication",
    desc: "Professionals learn structured communication frameworks that help them express ideas clearly and confidently in meetings, presentations and leadership discussions.",
  },
  {
    title: "Strategic Thinking",
    desc: "MentorLeap programs train professionals to think in structured frameworks, helping them make better decisions and approach complex problems with clarity.",
  },
  {
    title: "AI Learning Support",
    desc: "MISHA AI assists professionals 24×7 with research support, interview preparation, presentation development and career insights.",
  },
  {
    title: "Leadership Presence",
    desc: "Professionals develop confidence and executive presence required to influence teams, lead discussions and represent organizations effectively.",
  },
  {
    title: "Career Growth",
    desc: "By combining mentorship, frameworks and AI guidance, MentorLeap prepares professionals for long-term career growth and leadership success.",
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

export default function JourneySection() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // animate the timeline line drawing down on scroll
  useEffect(() => {
    if (!visible) return;
    let frame: number;
    let current = 0;
    const animate = () => {
      current += 1.2;
      if (current >= 100) { setLineHeight(100); return; }
      setLineHeight(current);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <>
      <style>{`
        .journey-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .journey-dot {
          width: 14px;
          height: 14px;
          background: #00e5ff;
          border-radius: 50%;
          position: absolute;
          left: -47px;
          top: 6px;
          box-shadow: 0 0 15px rgba(0,229,255,0.8);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .journey-step:hover .journey-dot {
          transform: scale(1.5);
          box-shadow: 0 0 25px rgba(0,229,255,1);
        }
        .journey-content-box {
          transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 18px 20px;
        }
        .journey-content-box:hover {
          background: rgba(0,229,255,0.04);
          border-color: rgba(0,229,255,0.15);
          transform: translateX(6px);
        }
        .step-number {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #6366f1;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5"
        style={{ padding: "140px 20px" }}
      >
        <div className="mx-auto" style={{ maxWidth: "900px" }} suppressHydrationWarning>

          {/* TITLE */}
          <h2
            className="text-white font-bold text-center mb-3"
            style={{
              fontSize: "44px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-20px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            Why Professionals Choose{" "}
            <span className="journey-gradient-text">MentorLeap</span>
          </h2>

          {/* SUBTITLE */}
          <p
            className="text-center mb-20"
            style={{
              color: "#94a3b8",
              fontSize: "15px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            A structured journey designed to transform professionals into
            confident leaders.
          </p>

          {/* TIMELINE */}
          <div
            ref={wrapperRef}
            className="relative pl-10"
            style={{ paddingLeft: "40px" }}
          >
            {/* ANIMATED LINE */}
            <div
              className="absolute top-0 left-0"
              style={{
                width: "2px",
                height: `${lineHeight}%`,
                background: "linear-gradient(180deg, #00e5ff, #6366f1)",
                transition: "height 0.05s linear",
                borderRadius: "2px",
              }}
            />
            {/* FADED TRACK */}
            <div
              className="absolute top-0 left-0"
              style={{
                width: "2px",
                height: "100%",
                background: "rgba(0,229,255,0.1)",
                borderRadius: "2px",
              }}
            />

            {/* STEPS */}
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="journey-step relative mb-12"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 0.5s ease ${0.3 + i * 0.12}s, transform 0.5s ease ${0.3 + i * 0.12}s`,
                }}
              >
                <div className="journey-dot" />

                <div className="journey-content-box">
                  <p className="step-number">Step {String(i + 1).padStart(2, "0")}</p>
                  <h3
                    className="text-white font-semibold mb-2"
                    style={{ fontSize: "20px" }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: "#cbd5f5", lineHeight: "1.6", fontSize: "15px" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}