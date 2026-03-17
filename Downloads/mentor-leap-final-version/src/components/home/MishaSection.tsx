"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  "Simulate interviews",
  "Refine investor pitches",
  "Practice speeches & presentations",
  "Boardroom conversations prep",
  "Executive articulation",
  "Strategic visibility",
];

const TYPING_TEXT = "Hi, I'm MISHA — your AI mentor at MentorLeap.";

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

export default function MishaSection() {
  const { ref, visible } = useInView();
  const [typed, setTyped] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  // start typing only once section is visible
  useEffect(() => {
    if (!visible || typingStarted) return;
    setTypingStarted(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < TYPING_TEXT.length) {
        setTyped(TYPING_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [visible, typingStarted]);

  return (
    <>
      <style>{`
        @keyframes gridMove {
          0%   { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        .misha-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 15s linear infinite;
          z-index: 0;
        }
        @keyframes hologramPulse {
          0%   { transform: translate(-50%, -50%) scale(1); }
          50%  { transform: translate(-50%, -50%) scale(1.25); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .misha-hologram {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(0,229,255,0.2), transparent);
          border-radius: 50%;
          animation: hologramPulse 5s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes hologramRing {
          0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .misha-hologram-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 360px; height: 360px;
          border: 1px solid rgba(0,229,255,0.3);
          border-radius: 50%;
          animation: hologramRing 3s ease-out infinite;
          z-index: 1;
        }
        .misha-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .misha-img {
          transition: transform 0.4s ease, filter 0.4s ease;
        }
        .misha-img:hover {
          transform: scale(1.03) translateY(-6px);
          filter: drop-shadow(0 0 30px rgba(0,229,255,0.4));
        }
        .misha-cap-card {
          transition: transform 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        .misha-cap-card:hover {
          border-color: #00e5ff !important;
          transform: translateY(-4px);
          color: #e2e8f0 !important;
          box-shadow: 0 8px 20px rgba(0,229,255,0.12);
        }
        .misha-btn {
          display: inline-block;
          padding: 13px 26px;
          border-radius: 30px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          color: white;
          text-decoration: none;
          font-size: 14px;
          box-shadow: 0 6px 20px rgba(0,229,255,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .misha-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 30px rgba(0,229,255,0.5);
        }
        .misha-btn:active { transform: scale(0.97); }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 18px;
          background: #00e5ff;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      <section
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{ padding: "140px 20px" }}
      >
        {/* GRID BG */}
        <div className="misha-grid-bg" />

        <div
          className="relative mx-auto flex items-center flex-wrap"
          style={{ maxWidth: "1300px", gap: "90px", zIndex: 2 }}
          suppressHydrationWarning
        >
          {/* MISHA AVATAR */}
          <div
            className="relative text-center"
            style={{
              width: "40%",
              minWidth: "280px",
              flex: "1",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            <div className="misha-hologram" />
            <div className="misha-hologram-ring" />
            <Image
              src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/ChatGPT-Image-Mar-4-2026-06_35_38-PM.png"
              alt="MISHA AI"
              width={320}
              height={380}
              className="misha-img relative"
              style={{ zIndex: 3, objectFit: "contain" }}
            />
          </div>

          {/* CONTENT */}
          <div
            style={{
              width: "60%",
              minWidth: "280px",
              flex: "1",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            {/* HEADING */}
            <h2
              className="text-white font-bold mb-2"
              style={{ fontSize: "46px" }}
            >
              Meet <span className="misha-gradient-text">MISHA</span>
            </h2>

            <p className="text-[#94a3b8] mb-6 text-sm">
              MentorLeap’s proprietary AI leadership engine, designed to support professionals throughout their learning journeys. She is structured around MentorLeap’s five-part leadership philosophy:
            </p>

            {/* PHILOSOPHY */}
            <div className="grid gap-2 mb-6 mt-4">
              <div className="flex gap-3"><span className="text-[#00e5ff] font-bold">M –</span> <span className="text-[#cbd5f5]">Mentorship</span></div>
              <div className="flex gap-3"><span className="text-[#00e5ff] font-bold">I –</span> <span className="text-[#cbd5f5]">Intelligence</span></div>
              <div className="flex gap-3"><span className="text-[#00e5ff] font-bold">S –</span> <span className="text-[#cbd5f5]">Strategic</span></div>
              <div className="flex gap-3"><span className="text-[#00e5ff] font-bold">H –</span> <span className="text-[#cbd5f5]">Humanise</span></div>
              <div className="flex gap-3"><span className="text-[#00e5ff] font-bold">A –</span> <span className="text-[#cbd5f5]">Advancement</span></div>
            </div>

            {/* FULL FORM OMITTED */}

            {/* TYPING OMITTED */}
            <h3
              className="font-medium mb-4 mt-8"
              style={{ color: "#00e5ff", fontSize: "18px" }}
            >
              Hi, I'm MISHA — your AI mentor at MentorLeap.
            </h3>

            {/* PARAGRAPHS */}
            <p
              className="mb-8"
              style={{
                color: "#cbd5f5",
                lineHeight: "1.7",
                fontSize: "15px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s",
              }}
            >
              MISHA is not a generic chatbot. She is a partner to learners, helping them to simulate interviews, refine investor pitches, practice speeches & presentations, prepare for boardroom conversations, improve executive articulation, and build strategic visibility.
            </p>

            {/* CAPABILITIES */}
            <div
              className="grid gap-4 my-8"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              {capabilities.map((cap, i) => (
                <div
                  key={cap}
                  className="misha-cap-card rounded-lg px-4 py-3"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "13px",
                    color: "#94a3b8",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.4s ease ${0.6 + i * 0.08}s, transform 0.4s ease ${0.6 + i * 0.08}s, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease`,
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      color: "#00e5ff",
                      fontSize: "15px",
                    }}
                  >
                    ✦
                  </span>
                  {cap}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.5s ease 0.85s, transform 0.5s ease 0.85s",
              }}
            >
              <Link href="/dashboard/ai-assistant" className="misha-btn">
                Start Conversation with MISHA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}