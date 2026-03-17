import React from "react";

export function Loader() {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <div className="w-8 h-8 border-4 border-white/10 border-t-[#00e5ff] rounded-full animate-spin"></div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
  );
}
