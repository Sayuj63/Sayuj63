"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Award,
    Bot,
    User,
    Settings,
    LogOut,
    Shield,
    Search
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const navItems = [
    { label: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
    { label: 'Explore Courses', href: '/dashboard/explore', icon: Search },
    { label: 'My Courses', href: '/dashboard/my-courses', icon: BookOpen },
    { label: 'My Events', href: '/dashboard/my-events', icon: Calendar },
    { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
    { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot },
];

const secondaryItems = [
    { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, isAdmin } = useAuth();

    return (
        <aside className="w-[280px] flex-shrink-0 border-r border-white/5 flex flex-col bg-[#020617] h-screen sticky top-0">
            {/* Logo Section */}
            <div className="p-8">
                <Link href="/dashboard" className="block">
                    <img
                        src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg"
                        alt="MentorLeap"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                <nav className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-4">Main Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                    ? 'bg-[#00e5ff]/10 text-[#00e5ff]'
                                    : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={active ? 'text-[#00e5ff]' : 'text-[#64748b] group-hover:text-white'} />
                                <span className="text-sm font-medium">{item.label}</span>
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>}
                            </Link>
                        );
                    })}
                </nav>

                <nav className="mt-10 space-y-1">
                    <p className="px-4 text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-4">Account</p>
                    {secondaryItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                    ? 'bg-[#00e5ff]/10 text-[#00e5ff]'
                                    : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={active ? 'text-[#00e5ff]' : 'text-[#64748b] group-hover:text-white'} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* ADMIN SHORTCUT */}
                {isAdmin && (
                    <nav className="mt-10 space-y-1">
                        <p className="px-4 text-[10px] font-bold text-[#facc15] uppercase tracking-widest mb-4">Management</p>
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] border border-amber-500/20"
                        >
                            <Shield size={20} />
                            <span className="text-sm font-bold">Admin Panel</span>
                        </Link>
                    </nav>
                )}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
