"use client";

import { useEffect, useRef, useState } from "react";

const mediaLogos = [
  { name: "BBC London", id: "bbc", domain: "bbc.com" },
  { name: "CNBC-TV18", id: "cnbctv18", domain: "cnbctv18.com" },
  { name: "Forbes India", id: "forbesindia", domain: "forbesindia.com" },
  { name: "Moneycontrol", id: "moneycontrol", domain: "moneycontrol.com" },
  { name: "Times Network", id: "timesnetwork", domain: "timesnetwork.in" }
];
const awards = [
  "British Chevening Scholar",
  "Ramnath Goenka Award for Excellence in Journalism",
  "Dean’s Award – University College London"
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

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function RecognitionSection() {
  const { ref, visible } = useInView();

  return (
    <>
      <style>{`
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
      <section ref={ref} className="w-full px-5 pb-24 pt-0 bg-[#020617] text-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-24">
          
          {/* AWARDS */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
            <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.3em] mb-10">Awards & Recognition</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {awards.map((award) => (
                <div key={award} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00e5ff]/30 transition-all">
                  <span className="text-3xl mb-4 block">🏆</span>
                  <p className="text-white font-medium text-sm leading-relaxed">{award}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RUNNING LOGOS BLOCK */}
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
            <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.3em] mb-10">
              Featured On
            </h3>
            <div className="marquee-container opacity-90 pt-4 pb-4">
              <div className="marquee-content" style={{ animationDuration: '25s' }}>
                {mediaLogos.map((logo, i) => (
                  <div key={logo.name + i} className="px-6 md:px-10 flex-shrink-0">
                    <LogoRender name={logo.name} id={logo.id} heightClass="h-7 md:h-12" />
                  </div>
                ))}
                {/* Duplicate for infinite loop without gaps */}
                {mediaLogos.map((logo, i) => (
                  <div key={logo.name + "-dup-" + i} className="px-6 md:px-10 flex-shrink-0">
                    <LogoRender name={logo.name} id={logo.id} heightClass="h-7 md:h-12" />
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
