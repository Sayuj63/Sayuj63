"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { fetchServices } from "@/lib/api";

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

export default function ServicesSection() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices().then((data: any[]) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <style>{`
        .services-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .service-card-link {
          color: #00e5ff;
          text-decoration: none;
          font-size: 13px;
          position: relative;
          display: inline-block;
          transition: letter-spacing 0.2s ease;
        }
        .service-card-link::after {
          content: " →";
          opacity: 0;
          transform: translateX(-4px);
          display: inline-block;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .service-card:hover .service-card-link::after {
          opacity: 1;
          transform: translateX(2px);
        }
        .service-card:hover .service-card-link {
          letter-spacing: 0.3px;
        }
        .service-icon-wrap {
          font-size: 42px;
          margin-bottom: 15px;
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .service-card:hover .service-icon-wrap {
          transform: scale(1.15) rotate(-4deg);
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center"
        style={{ padding: "140px 20px" }}
      >
        <div className="mx-auto" style={{ maxWidth: "1200px" }} suppressHydrationWarning>

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
            Explore{" "}
            <span className="services-gradient-text">MentorLeap Services</span>
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
            MentorLeap provides structured learning programs designed to help professionals achieve confident communication, leadership thinking and enhanced executive presence.
          </p>

          <div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            suppressHydrationWarning
          >
            {[
              { title: "Executive Coaching", icon: "👔", desc: "Hyper-personalised 1:1 coaching designed for senior professionals, founders and leaders who want to improve public speaking, communication, leadership presence or media readiness." },
              { title: "Corporate Training", icon: "🏢", desc: "Customised training programs and workshops designed for organisations that want to strengthen communication, leadership conversations and structured thinking across teams." },
              { title: "Live Online Events", icon: "🌐", desc: "Interactive masterclasses, bootcamps and cohorts for public speaking, leadership communication and executive presence - transforming professionals through applied learning." },
              { title: "Recorded Courses", icon: "🎥", desc: "Self-paced learning programs that help professionals build communication frameworks and leadership thinking at their own pace." },
              { title: "Mentorleap Studio", icon: "🎙", desc: "Your one-stop hub for articles, insights, content into everything that’s changing at the modern global workplace – helping you become future-ready." },
              { title: "Digital Resources", icon: "💻", desc: "A comprehensive library of frameworks, templates, and tools to help you communicate more effectively and build strategic leadership presence." }
            ].map((s, i) => (
              <div
                key={s.title}
                className="service-card rounded-2xl text-left"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "rgba(2,6,23,0.9)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  aspectRatio: "1/1",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  border: hovered === i
                    ? "1px solid #00e5ff"
                    : "1px solid rgba(255,255,255,0.05)",
                  transform: visible
                    ? hovered === i
                      ? "translateY(-10px)"
                      : "translateY(0)"
                    : "translateY(30px)",
                  boxShadow: hovered === i
                    ? "0 20px 50px rgba(0,229,255,0.2)"
                    : "none",
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.2 + i * 0.08}s, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease`,
                }}
              >
                <div className="service-icon-wrap mb-2" style={{ fontSize: "36px" }}>{s.icon}</div>
                <h3
                  className="text-white font-semibold mb-2 leading-tight"
                  style={{ fontSize: "15px" }}
                >
                  {s.title}
                </h3>
                <p className="mb-4 line-clamp-3" style={{ color: "#94a3b8", fontSize: "12px", flexGrow: 1 }}>
                  {s.desc}
                </p>
                <Link href="/contact" className="service-card-link">
                  Learn More
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}