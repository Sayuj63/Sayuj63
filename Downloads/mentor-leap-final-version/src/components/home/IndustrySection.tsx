"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Animation";

const cards = [
  {
    img: "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/Delltechforum2.jpeg",
    title: "Global Leadership Forums",
    desc: "Moderating discussions with business leaders and industry innovators.",
  },
  {
    img: "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/TVAnchorin.jpeg",
    title: "Media & Broadcast Hosting",
    desc: "Professional moderator and anchor for high-profile leadership conversations.",
  },
  {
    img: "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsAppImage2024-04-05at7.30.09PM.jpeg",
    title: "Corporate Leadership Events",
    desc: "Hosting impactful leadership events for corporate organizations.",
  },
  {
    img: "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/IMG_0380.jpg",
    title: "Global Conference Moderation",
    desc: "Facilitating conversations between leaders shaping the future.",
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

export default function IndustrySection() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .industry-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes scanMove {
          0%   { top: -4px; opacity: 0.8; }
          80%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00e5ff, transparent);
          animation: scanMove 4s linear infinite;
          z-index: 4;
          pointer-events: none;
        }
        .industry-card-img {
          transition: transform 0.5s ease, opacity 0.5s ease;
        }
        .industry-card:hover .industry-card-img {
          transform: scale(1.06);
          opacity: 0.9 !important;
        }
        .industry-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(2,6,23,0.95) 0%,
            rgba(2,6,23,0.5) 50%,
            transparent 100%
          );
          z-index: 2;
          transition: opacity 0.3s ease;
        }
        .industry-card:hover .industry-overlay {
          opacity: 0.85;
        }
        .industry-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #00e5ff;
          margin-bottom: 6px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .industry-card:hover .industry-tag {
          opacity: 1;
          transform: translateY(0);
        }
        .industry-desc {
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 0.7;
          transform: translateY(4px);
        }
        .industry-card:hover .industry-desc {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center"
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
          Industry Presence &{" "}
          <span className="industry-gradient-text">Leadership Moments</span>
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
          Mridu Bhandari moderates conversations with global leaders,
          innovators and industry pioneers.
        </p>

        {/* GRID */}
        <div
          className="mx-auto grid gap-9"
          style={{
            maxWidth: "1300px",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
          suppressHydrationWarning
        >
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="industry-card relative rounded-2xl overflow-hidden"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "#020617",
                border: hovered === i
                  ? "1px solid #00e5ff"
                  : "1px solid rgba(255,255,255,0.08)",
                transform: visible
                  ? hovered === i
                    ? "translateY(-10px)"
                    : "translateY(0)"
                  : "translateY(40px)",
                boxShadow: hovered === i
                  ? "0 30px 70px rgba(0,229,255,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ease ${0.2 + i * 0.1}s, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease`,
              }}
            >
              {/* SCAN LINE */}
              <div className="scan-line" />

              {/* IMAGE */}
              <div className="overflow-hidden" style={{ height: "320px" }}>
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="industry-card-img"
                  style={{
                    objectFit: "cover",
                    opacity: 0.75,
                    position: "absolute",
                    zIndex: 1,
                  }}
                />
              </div>

              {/* GRADIENT OVERLAY */}
              <div className="industry-overlay" />

              {/* CONTENT */}
              <div
                className="absolute text-left"
                style={{
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  zIndex: 3,
                }}
              >
                <p className="industry-tag">Leadership Moment</p>
                <h3
                  className="text-white font-semibold mb-2"
                  style={{ fontSize: "20px" }}
                >
                  {card.title}
                </h3>
                <p
                  className="industry-desc"
                  style={{ color: "#cbd5f5", fontSize: "14px" }}
                >
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* HIRE MRIDU AS ANCHOR */}
        <Reveal delay={0.4}>
          <div className="mt-32 p-12 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-l from-[#00e5ff] to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-[800px] mx-auto text-center">
                {/* TITLE & CONTENT */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Hire Mridu as <span className="text-[#00e5ff]">Anchor</span>
                </h2>
                <p className="text-[#94a3b8] text-lg leading-relaxed mb-8">
                  As an experienced TV journalist and lifestyle anchor, Mridu brings professional polish, high energy and deep expertise to live events, corporate conferences and moderated panels. Her ability to navigate complex discussions with ease makes her the perfect choice for high-impact professional stage and screen engagements.
                </p>

                {/* CTA BUTTON */}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#00e5ff] text-[#020617] font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all group no-underline"
                >
                  Book a Discovery Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}