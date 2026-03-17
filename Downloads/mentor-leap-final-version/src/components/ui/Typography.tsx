import React from 'react';

export function SectionHeading({ children, className = '' }: any) {
  return (
    <h2
      className={`text-white font-bold mb-4 ${className}`}
      style={{ fontSize: "44px", lineHeight: 1.2 }}
    >
      {children}
    </h2>
  );
}

export function GradientText({ children }: any) {
  return (
    <span style={{
      background: 'linear-gradient(90deg, #00e5ff, #6366f1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      {children}
    </span>
  );
}

export function Paragraph({ children, className = '' }: any) {
  return (
    <p className={`mb-6 ${className}`} style={{ color: "#cbd5f5", fontSize: "16px", lineHeight: "1.7" }}>
      {children}
    </p>
  );
}
