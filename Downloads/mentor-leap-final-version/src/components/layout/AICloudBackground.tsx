"use client";

import { useEffect, useRef } from "react";

const words = [
  "Leadership", "Confidence", "Strategy", "Growth", "AI",
  "Mentorship", "Communication", "Clarity", "Innovation", "Learning",
  "Vision", "Thinking", "Influence", "Insight", "Purpose",
  "Impact", "Progress", "Knowledge", "Future", "Creativity",
];

export default function AICloudBackground() {
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const els = wordsRef.current;
    if (!els.length) return;

    // give each word a unique randomised base style on mount
    els.forEach((el) => {
      const scale = 0.75 + Math.random() * 0.6;       // 0.75–1.35x
      el.style.setProperty("--base-scale", String(scale));
    });

    const animate = () => {
      // reset all
      els.forEach((el) => {
        el.classList.remove("cloud-active", "cloud-glow", "cloud-soft");
      });

      // pick 5–7 random words to activate
      const count = 5 + Math.floor(Math.random() * 3);
      const shuffled = [...els].sort(() => Math.random() - 0.5).slice(0, count);

      shuffled.forEach((el, i) => {
        const r = Math.random();
        if (r > 0.72) {
          el.classList.add("cloud-active", "cloud-glow");   // bright cyan glow
        } else if (r > 0.4) {
          el.classList.add("cloud-active");                  // normal white
        } else {
          el.classList.add("cloud-soft");                    // very subtle
        }
      });
    };

    animate();
    const id = setInterval(animate, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        .ai-cloud-bg {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(4, 1fr);
          align-items: center;
          justify-items: center;
          pointer-events: none;
          z-index: -1;
          font-family: "Inter", sans-serif;
        }

        .ai-cloud-word {
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: calc(20px * var(--base-scale, 1));
          color: rgba(255,255,255,0);
          opacity: 0;
          transform: translateY(12px) scale(0.94);
          transition:
            color 1.6s ease,
            opacity 1.6s ease,
            transform 1.6s ease,
            text-shadow 1.6s ease,
            filter 1.6s ease;
          user-select: none;
        }

        /* SOFT — barely visible */
        .ai-cloud-word.cloud-soft {
          color: rgba(255,255,255,0.04);
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ACTIVE — clean white */
        .ai-cloud-word.cloud-active {
          color: rgba(255,255,255,0.09);
          opacity: 1;
          transform: translateY(0) scale(calc(var(--base-scale, 1)));
        }

        /* GLOW — cyan highlight */
        .ai-cloud-word.cloud-glow {
          color: rgba(0,229,255,0.22);
          text-shadow:
            0 0 12px rgba(0,229,255,0.35),
            0 0 30px rgba(99,102,241,0.2);
          filter: blur(0px);
          transform: translateY(0) scale(calc(var(--base-scale, 1) * 1.08));
        }
      `}</style>

      <div className="ai-cloud-bg" suppressHydrationWarning>
        {words.map((word, i) => (
          <span
            key={word}
            className="ai-cloud-word"
            ref={(el) => {
              if (el) wordsRef.current[i] = el;
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </>
  );
}