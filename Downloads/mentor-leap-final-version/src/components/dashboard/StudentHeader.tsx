"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, BookOpen, Calendar, MessageSquare, User, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function StudentHeader() {
    const { userData, user, logout } = useAuth();
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    return (
        <header className="h-[72px] border-b border-white/5 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] group-focus-within:text-[#00e5ff] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses, library, masters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/10 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Quick Actions & Nav */}
            <div className="flex flex-1 items-center justify-center gap-8 hidden xl:flex text-sm font-bold text-[#94a3b8]">
                <Link href="/dashboard/my-courses" className="hover:text-white flex items-center gap-2 transition-colors">
                    <BookOpen size={16} className="text-[#00e5ff]" /> Courses
                </Link>
                <Link href="/dashboard/my-events" className="hover:text-white flex items-center gap-2 transition-colors">
                    <Calendar size={16} className="text-[#00e5ff]" /> Events
                </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5 relative">
                <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-[#94a3b8] hover:text-white">
                    <MessageSquare size={18} />
                </button>

                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-[#94a3b8] hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00e5ff] rounded-full border-2 border-[#020617] animate-pulse"></span>
                </button>

                <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 pl-2 group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-tight group-hover:text-[#00e5ff] transition-colors">{userData?.name || "Student"}</p>
                            <p className="text-[10px] text-[#00e5ff] font-bold uppercase tracking-widest">{userData?.role || "Academic Plan"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#6366f1] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                {(user?.photoURL || userData?.photoURL) ? (
                                    <img src={userData?.photoURL || user?.photoURL || ""} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-[#00e5ff]" />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-[#04091a] border border-[#00e5ff]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-white/5 mb-2 bg-[#00e5ff]/5">
                                <p className="text-sm font-bold text-white">{userData?.name || "Student"}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff] mt-0.5">{userData?.enrolledCourses?.length || 0} Active Courses</p>
                            </div>
                            <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cbd5f5] hover:bg-white/5 hover:text-white transition-colors">
                                <User size={16} className="text-[#00e5ff]" /> View Profile
                            </Link>
                            <Link href="/dashboard/overview" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cbd5f5] hover:bg-white/5 hover:text-white transition-colors">
                                <TrendingUp size={16} className="text-[#00e5ff]" /> My Progress
                            </Link>
                            <div className="h-px bg-white/5 my-2"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for dropdown */}
            {profileOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setProfileOpen(false)}></div>
            )}
        </header>
    );
}
