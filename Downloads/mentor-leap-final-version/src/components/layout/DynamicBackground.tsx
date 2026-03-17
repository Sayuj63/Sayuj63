"use client";

import { useEffect, useRef } from "react";

const texts = [
  "Leadership", "Confidence", "Communication", "Strategy", "Growth",
  "AI Mentorship", "Innovation", "Clarity", "Learning", "Professional Growth",
  "Presentation Skills", "Emotional Intelligence", "Career Growth",
  "Public Speaking", "Mindset", "Knowledge", "Impact", "Influence",
  "Future Leaders", "MentorLeap",
];

// subtle cyan/indigo/white tints to add depth
const colors = [
  "rgba(255,255,255,0.06)",
  "rgba(0,229,255,0.07)",
  "rgba(99,102,241,0.07)",
  "rgba(255,255,255,0.04)",
  "rgba(0,229,255,0.05)",
];

export default function DynamicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spawn = () => {
      const span = document.createElement("span");

      const text = texts[Math.floor(Math.random() * texts.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const fontSize = 16 + Math.random() * 14;         // 16–30px
      const duration = 28 + Math.random() * 22;         // 28–50s
      const left = Math.random() * 95;                   // 0–95%
      const drift = (Math.random() - 0.5) * 120;        // –60 to +60px horizontal drift
      const delay = Math.random() * -10;                 // stagger start

      span.innerText = text;
      span.style.cssText = `
        position: absolute;
        color: ${color};
        font-size: ${fontSize}px;
        font-weight: 600;
        letter-spacing: 1.5px;
        white-space: nowrap;
        left: ${left}%;
        bottom: -60px;
        animation: floatWord ${duration}s ${delay}s linear forwards;
        --drift: ${drift}px;
        pointer-events: none;
        user-select: none;
      `;

      container.appendChild(span);
      setTimeout(() => span.remove(), (duration + 10) * 1000);
    };

    // seed a few immediately so page isn't empty on load
    for (let i = 0; i < 6; i++) {
      setTimeout(spawn, i * 300);
    }

    const interval = setInterval(spawn, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatWord {
          0% {
            transform: translateX(0px) translateY(0px);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          50% {
            transform: translateX(var(--drift)) translateY(-50vh);
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(var(--drift) * -0.5)) translateY(-110vh);
            opacity: 0;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </>
  );
}