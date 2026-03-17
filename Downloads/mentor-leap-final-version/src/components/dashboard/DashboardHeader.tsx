"use client";
import React from "react";
import { Bell, Search, Settings, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardHeader() {
    const { userData, user } = useAuth();

    return (
        <header className="h-[72px] border-b border-white/5 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] group-focus-within:text-[#00e5ff] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search classes, events, resources..."
                        className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/10 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5">
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-[#94a3b8] hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-[#94a3b8] hover:text-white">
                    <Settings size={20} />
                </button>

                <div className="h-8 w-px bg-white/10 mx-1"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-tight">{userData?.name || "Student"}</p>
                        <p className="text-[10px] text-[#00e5ff] font-bold uppercase tracking-widest">{userData?.role || "Basic Plan"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#6366f1] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                        <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} className="text-[#00e5ff]" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
