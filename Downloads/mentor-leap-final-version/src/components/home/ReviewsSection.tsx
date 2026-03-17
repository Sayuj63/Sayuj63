"use client";

import { useEffect, useRef, useState } from "react";

import { fetchReviews } from "@/lib/api";

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

const companies = [
  { name: "Deloitte", id: "deloitte", domain: "deloitte.com" },
  { name: "Wipro", id: "wipro", domain: "wipro.com" },
  { name: "Accenture", id: "accenture", domain: "accenture.com" },
  { name: "Microsoft", id: "microsoft", domain: "microsoft.com" },
  { name: "Infosys", id: "infosys", domain: "infosys.com" },
  { name: "IBM", id: "ibm", domain: "ibm.com" },
  { name: "EY", id: "ey", domain: "ey.com" },
  { name: "PwC", id: "pwc", domain: "pwc.com" },
  { name: "DataFlow", id: "dataflowgroup", domain: "dataflowgroup.com" },
  { name: "HSBC Bank", id: "hsbc", domain: "hsbc.com" },
  { name: "Sarita Handa", id: "saritahanda", domain: "saritahanda.com" },
  { name: "Ratan Textiles", id: "ratantextiles", domain: "ratantextiles.com" },
  { name: "360 One Wealth", id: "360one", domain: "360.one" }
];

function LogoRender({ name, id, heightClass }: { name: string, id: string, heightClass: string }) {
  const [error, setError] = useState(false);

  return (
    <div className={`bg-white/95 hover:bg-white rounded-lg px-3 py-1.5 flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] ${heightClass} min-w-[100px] md:min-w-[140px]`}>
      {error ? (
        <span className="text-[#020617] font-bold text-sm md:text-base whitespace-nowrap">{name}</span>
      ) : (
        <img 
          src={`/logos/${id}.png`}
          alt={name}
          title={name}
          className={`${heightClass} object-contain mix-blend-multiply w-auto max-w-full`}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ color: "#facc15", fontSize: "15px", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            opacity: s <= count ? 1 : 0.25,
            display: "inline-block",
            transition: `opacity 0.3s ease ${s * 0.05}s`,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// rolling big number counter
function RatingCounter({ visible, target = 4.9 }: { visible: boolean; target?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(parseFloat(current.toFixed(1)));
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <>{val.toFixed(1)}</>;
}

export default function ReviewsSection() {
  const { ref, visible } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews().then((data: any[]) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  // avatar gradient colours cycling
  const avatarColors = [
    "#00e5ff", "#6366f1", "#00e5ff", "#6366f1", "#00e5ff", "#6366f1",
  ];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.stars || 5), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <>
      <style>{`
        .reviews-gradient-text {
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .review-card {
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .review-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0,229,255,0.35) !important;
          box-shadow: 0 20px 50px rgba(0,229,255,0.1);
        }
        .review-avatar {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .review-card:hover .review-avatar {
          transform: scale(1.1);
          box-shadow: 0 0 16px rgba(0,229,255,0.5);
        }
        .review-quote {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 48px;
          line-height: 1;
          color: rgba(0,229,255,0.08);
          font-family: Georgia, serif;
          pointer-events: none;
          transition: color 0.3s ease;
        }
        .review-card:hover .review-quote {
          color: rgba(0,229,255,0.15);
        }
        @keyframes ratingPulse {
          0%   { text-shadow: 0 0 20px rgba(0,229,255,0.4); }
          50%  { text-shadow: 0 0 40px rgba(0,229,255,0.8); }
          100% { text-shadow: 0 0 20px rgba(0,229,255,0.4); }
        }
        .rating-number {
          animation: ratingPulse 3s ease-in-out infinite;
        }
        @keyframes summaryFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .summary-animate {
          animation: summaryFadeUp 0.7s ease 0.3s both;
        }
        @keyframes marqueeX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .marquee-content {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marqueeX 45s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        ref={ref}
        className="w-full px-5 text-center"
        style={{ padding: "120px 20px" }}
      >
        {/* TITLE */}
        <h2
          className="text-white font-bold mb-10"
          style={{
            fontSize: "42px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          What Professionals Say About{" "}
          <span className="reviews-gradient-text">MentorLeap</span>
        </h2>

        {/* RATING SUMMARY */}
        {visible && (
          <div className="summary-animate mb-14">
            <h3
              className="rating-number font-bold mb-2"
              style={{ fontSize: "56px", color: "#00e5ff" }}
            >
              <RatingCounter visible={visible} target={Number(averageRating)} />
            </h3>
            <div style={{ color: "#facc15", fontSize: "22px", marginBottom: "8px" }}>
              ★★★★★
            </div>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Based on {reviews.length} professional reviews
            </p>
          </div>
        )}

        {/* GRID */}
        <div
          className="mx-auto grid gap-8"
          suppressHydrationWarning
          style={{
            maxWidth: "1200px",
            gridTemplateColumns: loading || reviews.length === 0 ? "1fr" : "repeat(3, 1fr)",
          }}
        >
          {loading ? (
            <div className="text-[#94a3b8] animate-pulse py-20 bg-white/5 rounded-3xl border border-white/10">Synchronizing testimonials...</div>
          ) : reviews.length === 0 ? (
            <div className="text-[#94a3b8] italic py-20 bg-white/5 rounded-3xl border border-white/10">Be the first to share your experience with MentorLeap.</div>
          ) : reviews.map((r, i) => (
            <div
              key={r.id || r.name}
              className="review-card relative rounded-xl text-left"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "#020617",
                padding: "25px",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${0.3 + i * 0.08}s, transform 0.5s ease ${0.3 + i * 0.08}s`,
              }}
            >
              {/* BIG QUOTE */}
              <div className="review-quote">"</div>

              {/* HEADER */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="review-avatar flex items-center justify-center rounded-full font-bold flex-shrink-0"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}, #020617)`,
                    border: `2px solid ${avatarColors[i % avatarColors.length]}`,
                    color: avatarColors[i % avatarColors.length],
                    fontSize: "16px",
                  }}
                >
                  {r.initial || (r.name ? r.name[0] : "?")}
                </div>
                <div>
                  <h4 className="text-white font-semibold" style={{ fontSize: "15px" }}>
                    {r.name}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    📍 {r.location}
                  </span>
                </div>
              </div>

              {/* STARS */}
              <Stars count={r.stars || 5} />

              {/* TEXT */}
              <p style={{ color: "#cbd5f5", fontSize: "14px", lineHeight: "1.6" }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>

        {/* WHERE OUR LEARNERS WORK (COMPANIES) */}
        <div className="mt-28" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}>
          <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.3em] mb-10">
            Our Learners Work At
          </h3>
          <div className="marquee-container opacity-90 pt-4 pb-4">
            <div className="marquee-content">
              {companies.map((logo, i) => (
                <div key={logo.name + i} className="px-6 md:px-10 flex-shrink-0">
                  <LogoRender name={logo.name} id={logo.id} heightClass="h-7 md:h-12" />
                </div>
              ))}
              {/* Duplicate for infinite loop without gaps */}
              {companies.map((logo, i) => (
                <div key={logo.name + "-dup-" + i} className="px-6 md:px-10 flex-shrink-0">
                  <LogoRender name={logo.name} id={logo.id} heightClass="h-7 md:h-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}