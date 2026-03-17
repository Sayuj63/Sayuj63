"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, Settings, User, LogOut, FileText, PlusCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
    const { userData, user, logout } = useAuth();
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    return (
        <header className="h-[72px] border-b border-white/5 bg-[#020617]/95 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search users, reports, settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#04091a] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Quick Actions & Nav */}
            <div className="flex flex-1 items-center justify-center gap-6 hidden lg:flex text-sm font-bold text-[#94a3b8]">
                <Link href="/admin/users/all-users" className="hover:text-white flex items-center gap-2 transition-colors">
                    <User size={16} /> Users
                </Link>
                <Link href="/admin/analytics" className="hover:text-white flex items-center gap-2 transition-colors">
                    <FileText size={16} /> Reports
                </Link>
                <Link href="/admin/settings" className="hover:text-white flex items-center gap-2 transition-colors">
                    <Settings size={16} /> Settings
                </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 relative">
                {/* Admin Quick Action Button */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-[#cbd5f5] transition-all">
                    <PlusCircle size={14} className="text-purple-400" />
                    New Course
                </button>

                <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-[#94a3b8] hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 pl-2 group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-tight group-hover:text-purple-300 transition-colors">{userData?.name || "Admin"}</p>
                            <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                                <ShieldAlert size={10} /> {userData?.role || "Administrator"}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                {(userData?.photoURL || user?.photoURL) ? (
                                    <img src={userData?.photoURL || user?.photoURL || ""} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-purple-400" />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-[#04091a] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                <p className="text-sm font-bold text-white">{userData?.name}</p>
                                <p className="text-xs text-[#94a3b8] truncate">{user?.email}</p>
                            </div>
                            <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cbd5f5] hover:bg-white/5 hover:text-white transition-colors">
                                <User size={16} className="text-purple-400" /> View Profile
                            </Link>
                            <Link href="/admin/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cbd5f5] hover:bg-white/5 hover:text-white transition-colors">
                                <Settings size={16} className="text-purple-400" /> Account Settings
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
