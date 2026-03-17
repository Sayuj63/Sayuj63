"use client";

import { useEffect } from "react";

export default function CursorParticles() {
  useEffect(() => {
    // don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const colors = ["#00e5ff", "#6366f1", "#00e5ff"];
    let lastX = 0;
    let lastY = 0;

    const spawn = (x: number, y: number) => {
      const particle = document.createElement("div");

      // pick a slight random offset so particles don't all stack perfectly
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 4 + Math.random() * 4; // 4–8px

      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        left: ${x + offsetX}px;
        top:  ${y + offsetY}px;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 8px ${color}, 0 0 18px #6366f1;
        animation: particleFade 0.9s linear forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 900);
    };

    const onMove = (e: MouseEvent) => {
      // throttle: only spawn if cursor moved at least 4px
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) < 4) return;
      lastX = e.clientX;
      lastY = e.clientY;
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
        window.removeEventListener("mousemove", onMove);
      };
  }, []);

  return (
    <style>{`
      @keyframes particleFade {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.9;
        }
        100% {
          transform: translate(-50%, -50%) scale(0.2);
          opacity: 0;
        }
      }
    `}</style>
  );
}