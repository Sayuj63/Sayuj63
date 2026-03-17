"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ShieldCheck,
    Users,
    BookOpen,
    Calendar,
    Package,
    Settings,
    LogOut,
    ChevronLeft,
    BarChart3,
    Layers
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const navItems = [
    { label: 'Admin Dashboard', href: '/admin', icon: ShieldCheck },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Blog CMS', href: '/admin/blog', icon: BookOpen },
    { label: 'Curriculum', href: '/admin/courses', icon: BookOpen },
    { label: 'Events & Live', href: '/admin/events', icon: Calendar },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    return (
        <aside className="w-[280px] flex-shrink-0 border-r border-white/5 flex flex-col bg-[#020617] h-screen sticky top-0">
            <div className="p-8">
                <Link href="/admin" className="flex items-center gap-3 mb-2">
                    <img
                        src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg"
                        alt="MentorLeap"
                        className="h-8 w-auto object-contain"
                    />
                    <span className="text-[10px] font-bold bg-[#00e5ff] text-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Admin</span>
                </Link>
                <p className="text-[10px] text-[#475569] font-bold uppercase tracking-[0.2em] pl-1">Management Suite</p>
            </div>

            <div className="flex-1 px-4 overflow-y-auto">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${active
                                    ? 'bg-[#00e5ff]/20 text-[#00e5ff]'
                                    : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={active ? 'text-[#00e5ff]' : 'text-[#64748b] group-hover:text-white'} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 space-y-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#94a3b8] hover:bg-white/5 transition-all text-sm font-medium border border-transparent hover:border-white/10"
                >
                    <ChevronLeft size={18} />
                    <span>Student View</span>
                </Link>

                <button
                    onClick={() => {
                        logout();
                        router.push('/auth/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium"
                >
                    <LogOut size={20} />
                    <span>Exit Admin</span>
                </button>
            </div>
        </aside>
    );
}
