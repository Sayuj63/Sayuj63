"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export function Drawer({ isOpen, onClose, position = 'right', children }: any) {
  const isRight = position === 'right';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ [isRight ? 'x' : 'y']: isRight ? '100%' : '100%' }}
            animate={{ [isRight ? 'x' : 'y']: 0 }}
            exit={{ [isRight ? 'x' : 'y']: isRight ? '100%' : '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute bg-[#0f172a] border-white/10 shadow-2xl overflow-y-auto ${isRight ? 'top-0 right-0 h-full w-full max-w-md border-l' : 'bottom-0 left-0 w-full rounded-t-3xl border-t h-[80vh]'}`}
          >
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
