"use client";
import { motion } from 'framer-motion';
import React from 'react';

export function Card({ children, className = '', hoverable = true, style: customStyle, ...props }: any) {
  const hasBg = className.includes('bg-');
  const hasBorder = className.includes('border-');

  return (
    <motion.div
      whileHover={hoverable ? {
        y: -10,
        borderColor: '#00e5ff',
        boxShadow: '0 20px 50px rgba(0,229,255,0.2)',
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl p-8 ${className}`}
      style={{
        background: hasBg ? undefined : 'rgba(2,6,23,0.9)',
        border: hasBorder ? undefined : '1px solid rgba(255,255,255,0.05)',
        ...customStyle
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
