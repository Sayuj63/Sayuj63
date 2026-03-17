"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Courses", href: "/courses" },
  { label: "Executive Coaching", href: "/executive-coaching" },
  { label: "Live Events", href: "/events" },
  { label: "MentorLeap Studio", href: "/mentorleap-studio" },
  { label: "Hire Mridu as Anchor", href: "/hire-mridu-anchor" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .ml-nav-link {
          position: relative;
          color: #cbd5f5;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .ml-nav-link::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          transition: width 0.3s ease;
        }
        .ml-nav-link:hover {
          color: white;
        }
        .ml-nav-link:hover::after {
          width: 100%;
        }
        .ml-cta-btn {
          padding: 10px 20px;
          border-radius: 25px;
          background: linear-gradient(90deg, #00e5ff, #6366f1);
          color: white;
          font-size: 13px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(0, 229, 255, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ml-auth-link {
          color: #cbd5f5;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 500;
        }
        .ml-auth-link:hover {
          color: white;
        }
        .ml-cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 28px rgba(0, 229, 255, 0.5);
          opacity: 0.95;
        }
        .ml-cta-btn:active {
          transform: scale(0.97);
        }
        .ml-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #cbd5f5;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .ml-hamburger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .ml-hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .ml-hamburger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }
        .ml-mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .ml-mobile-menu.open {
          max-height: 500px;
          opacity: 1;
        }
        @keyframes headerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .ml-header-animate {
          animation: headerSlideDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <header
        className="ml-header-animate"
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: scrolled
            ? "rgba(2, 6, 23, 0.97)"
            : "rgba(2, 6, 23, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          zIndex: 9999,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* MAIN ROW */}
        <div
          suppressHydrationWarning
          style={{
            maxWidth: "1400px",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
          }}
        >
          {/* LOGO */}
          <div
            suppressHydrationWarning
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}
          >
            <Image
              src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg"
              alt="MentorLeap Logo"
              width={120}
              height={42}
              style={{ height: "42px", width: "auto", objectFit: "contain" }}
              priority
            />
          </div>

          {/* DESKTOP NAV */}
          <nav
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.5s ease 0.3s",
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className="ml-nav-link"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(-8px)",
                  transition: `opacity 0.4s ease ${0.3 + i * 0.05}s, transform 0.4s ease ${0.3 + i * 0.05}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + HAMBURGER */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(20px)",
                transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s",
                display: "flex",
                alignItems: "center",
                gap: "20px"
              }}
              className="hidden-mobile"
              suppressHydrationWarning
            >
              {!loading && !user && (
                <>
                  <Link href="/auth/login" className="ml-auth-link">
                    Log In
                  </Link>
                  <Link href="/auth/register" className="ml-cta-btn">
                    Sign Up
                  </Link>
                </>
              )}
              {user && (
                <Link href="/events" className="ml-cta-btn">
                  Explore Events
                </Link>
              )}
            </div>

            {/* HAMBURGER - mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`ml-hamburger ${menuOpen ? "open" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "none",
                flexDirection: "column",
                gap: "6px",
                padding: "4px",
              }}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`ml-mobile-menu ${menuOpen ? "open" : ""}`} suppressHydrationWarning>
          <div
            suppressHydrationWarning
            style={{
              padding: "12px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="ml-nav-link"
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "14px" }}
              >
                {link.label}
              </Link>
            ))}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              {!loading && !user && (
                <>
                  <Link 
                    href="/auth/login" 
                    className="ml-auth-link"
                    onClick={() => setMenuOpen(false)}
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="ml-cta-btn"
                    onClick={() => setMenuOpen(false)}
                    style={{ textAlign: "center" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {user && (
                <Link 
                  href="/events" 
                  className="ml-cta-btn" 
                  onClick={() => setMenuOpen(false)}
                  style={{ textAlign: "center" }}
                >
                  Explore Events
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* RESPONSIVE OVERRIDES */}
      <style>{`
        @media (max-width: 1000px) {
          .hidden-mobile { display: none !important; }
          .ml-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}