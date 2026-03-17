"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export function ToastProvider() {
  // A simple placeholder toast integration
  // Real implementation would use context or a library like sonner
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Toast items would render here */}
    </div>
  );
}

export function Toast({ message, type = "success", isVisible, onClose }: any) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`p-4 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md ${type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
        >
          <span>{type === 'success' ? '✓' : '✕'}</span>
          <span className="text-sm font-medium text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
