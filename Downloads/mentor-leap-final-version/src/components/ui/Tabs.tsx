"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export function Tabs({ tabs, defaultActive = 0 }: any) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-6 gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab: any, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative px-1 py-4 text-sm font-medium transition-colors whitespace-nowrap ${active === i ? 'text-[#00e5ff]' : 'text-[#94a3b8] hover:text-[#cbd5f5]'}`}
          >
            {tab.label}
            {active === i && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00e5ff] to-[#6366f1]"
              />
            )}
          </button>
        ))}
      </div>
      <div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabs[active].content}
        </motion.div>
      </div>
    </div>
  );
}
