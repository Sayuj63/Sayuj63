"use client";
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  const baseClasses = `rounded-full font-semibold transition-all inline-flex items-center justify-center cursor-pointer ${sizeClasses[size]}`;
  const widthClass = fullWidth ? 'w-full' : '';

  let styles = {};
  if (variant === 'primary') {
    styles = {
      background: 'linear-gradient(90deg, #00e5ff, #6366f1)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(0,229,255,0.3)',
    };
  } else if (variant === 'secondary') {
    styles = {
      background: '#0f172a',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.1)',
    };
  } else {
    styles = {
      background: 'transparent',
      color: '#00e5ff',
      border: '1px solid #00e5ff',
    };
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.03, boxShadow: variant === 'primary' ? '0 10px 28px rgba(0,229,255,0.5)' : variant === 'outline' ? '0 0 16px rgba(0,229,255,0.25)' : 'none' }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${widthClass} ${className}`}
      style={styles}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
