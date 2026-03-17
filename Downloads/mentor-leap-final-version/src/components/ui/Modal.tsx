"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";

export function Modal({ isOpen, onClose, title, children }: any) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">{title}</h3>
               <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors">✕</button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
