"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { fetchFounderInfo } from "@/lib/api";

const defaultStats = [
  { target: 20,    label: "Years Broadcast Media Experience" },
  { target: 900,   label: "Corporate & Leadership Events Anchored" },
  { target: 250,   label: "Hours Coaching Senior Leaders" },
  { target: 10000, label: "Professionals Impacted" },
];

const defaultVideos = [
  "PWTz7eGclu8",
  "bZ9BtRfgg6o",
  "ZrVv0gkkaMs",
  "i5pDykiREPw",
  "YkdiS_guFrc",
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
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

function Counter({ target, visible }: { target: number; visible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const increment = target / 80;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span>
      {count.toLocaleString()}
      {count >= target ? "+" : ""}
    </span>
  );
}

export default function VisionFounder() {
  const { ref: sectionRef, visible } = useInView();
  const [founderInfo, setFounderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFounderInfo().then(data => {
      setFounderInfo(data);
      setLoading(false);
    });
  }, []);

  const info = founderInfo || {
    name: "Mridu Bhandari",
    image: "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/MG_4654.jpg",
    tagline: "Transforming professionals into confident communicators and strategic leaders.",
    bio: [
      "After moderating hundreds of leadership forums and corporate conversations, Mridu Bhandari observed a recurring challenge among professionals. Many individuals possess knowledge and expertise but struggle to communicate ideas with clarity, structure and confidence.",
      "MentorLeap was created to bridge this gap by combining real-world leadership frameworks with MISHA. This AI learning companion supports professionals throughout their learning and career journey.",
      "The mission of MentorLeap is simple yet powerful: help professionals think clearly, communicate confidently and lead effectively.",
    ],
    stats: defaultStats,
    videos: defaultVideos,
  };

  return (
    <>
      <style>{`
        @keyframes glowMove {
          0%   { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }
        .img-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120%; height: 120%;
          background: radial-gradient(circle, rgba(0,229,255,0.25), transparent);
          filter: blur(40px);
          z-index: 1;
          animation: glowMove 6s ease-in-out infinite alternate;
        }
        .vision-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-card {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,229,255,0.3) !important;
          box-shadow: 0 8px 24px rgba(0,229,255,0.1);
        }
        .video-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .video-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        .video-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,229,255,0.3);
          border-radius: 4px;
        }
        .video-frame {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex-shrink: 0;
        }
        .video-frame:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        .founder-img {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .founder-img:hover {
          transform: scale(1.02);
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="w-full px-5"
        style={{ paddingTop: "140px", paddingBottom: "70px", paddingLeft: "20px", paddingRight: "20px" }}
      >
        <div className="mx-auto" style={{ maxWidth: "1300px" }} suppressHydrationWarning>

          {/* TOP: IMAGE + CONTENT */}
          <div
            className="flex items-center flex-wrap mb-16"
            style={{ gap: "70px" }}
          >
            {/* IMAGE */}
            <div
              className="relative"
              style={{
                width: "40%",
                minWidth: "280px",
                flex: "1",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
              }}
            >
              <div className="img-glow" />
              <Image
                src={info.image || "https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/MG_4654.jpg"}
                alt={info.name || "Mridu Bhandari"}
                width={600}
                height={700}
                className="founder-img rounded-2xl w-full relative"
                style={{ zIndex: 2, objectFit: "cover" }}
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
              <h2
                className="text-white font-bold mb-4"
                style={{ fontSize: "46px", lineHeight: "1.2" }}
              >
                Meet the Founder
              </h2>

              <p
                className="font-medium mb-5"
                style={{ color: "#00e5ff", fontSize: "18px" }}
              >
                {info.tagline || "Transforming professionals into confident communicators and strategic leaders."}
              </p>

              {(info.bio || []).map((text: string, i: number) => (
                <p
                  key={i}
                  className="mb-4"
                  style={{
                    color: "#cbd5f5",
                    lineHeight: "1.7",
                    fontSize: "15px",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${0.4 + i * 0.1}s, transform 0.5s ease ${0.4 + i * 0.1}s`,
                  }}
                >
                  {text}
                </p>
              ))}

              {/* STATS */}
              <div
                className="flex flex-wrap mt-8"
                style={{ gap: "25px" }}
              >
                {(info.stats || []).map((stat: any, i: number) => (
                  <div
                    key={stat.label}
                    className="stat-card rounded-xl text-center"
                    style={{
                      background: "#020617",
                      padding: "20px 24px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 0.5s ease ${0.7 + i * 0.12}s, transform 0.5s ease ${0.7 + i * 0.12}s`,
                    }}
                  >
                    <h3
                      className="font-bold mb-1"
                      style={{ color: "#00e5ff", fontSize: "34px" }}
                    >
                      <Counter target={stat.target} visible={visible} />
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>
                      {stat.label}
                    </p>
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