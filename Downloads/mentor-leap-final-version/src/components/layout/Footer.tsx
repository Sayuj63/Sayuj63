"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "Hire Mridu", href: "/hire-anchor" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#020617" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .footer-nav-link {
          position: relative;
          color: #94a3b8;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .footer-nav-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          transition: width 0.3s ease;
        }
        .footer-nav-link:hover { color: #00e5ff; }
        .footer-nav-link:hover::after { width: 100%; }

        .footer-social-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 13px;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid transparent;
          transition: color 0.25s ease, border-color 0.25s ease,
                      background 0.25s ease, transform 0.25s ease;
        }
        .footer-social-link:hover {
          color: #00e5ff;
          border-color: rgba(0,229,255,0.25);
          background: rgba(0,229,255,0.06);
          transform: translateY(-2px);
        }

        .footer-shimmer {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,229,255,0.3),
            rgba(99,102,241,0.3),
            transparent
          );
        }

        .footer-copyright-text {
          transition: color 0.3s ease;
        }
        .footer-copyright-text:hover {
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .footer-inner {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center;
          }
          .footer-nav-links {
            flex-wrap: wrap;
            justify-content: center !important;
          }
          .footer-social-links {
            justify-content: center !important;
          }
        }
      `}</style>

      <footer
        suppressHydrationWarning
        style={{
          width: "100%",
          background: "#020617",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* SHIMMER TOP LINE */}
        <div className="footer-shimmer" suppressHydrationWarning />

        {/* MAIN ROW */}
        <div
          className="footer-inner"
          suppressHydrationWarning
          style={{
            maxWidth: "1350px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "40px",
            padding: "80px 20px 60px",
          }}
        >
          {/* BRAND */}
          <div className="md:col-span-3">
            <Link href="/" style={{ display: "inline-block", marginBottom: "24px" }}>
              <Image
                src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg"
                alt="MentorLeap"
                width={120}
                height={40}
                style={{ height: "32px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered professional development platform helping professionals master communication and leadership.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">
              MentorLeap
            </h4>
            <ul className="space-y-4 p-0 list-none">
              <li><Link href="/about" className="footer-nav-link">About</Link></li>
              <li><Link href="/events" className="footer-nav-link">Programs</Link></li>
              <li><Link href="/corporate" className="footer-nav-link">Corporate Training</Link></li>
              <li><Link href="/courses" className="footer-nav-link">Recorded Courses</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">
              Resources
            </h4>
            <ul className="space-y-4 p-0 list-none">
              <li><Link href="/studio" className="footer-nav-link">MentorLeap Studio</Link></li>
              <li><Link href="/privacy" className="footer-nav-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-nav-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">
              Stay Informed
            </h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Join the community for leadership insights.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-[#00e5ff]"
              />
              <button className="bg-[#00e5ff] text-[#020617] p-2 rounded-full hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          suppressHydrationWarning
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <p
            className="footer-copyright-text"
            style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}
          >
            © 2026 MentorLeap AI · All rights reserved · Built with{" "}
            <span style={{ color: "rgba(0,229,255,0.5)" }}>MISHA AI</span>
          </p>
        </div>
      </footer>
    </>
  );
}