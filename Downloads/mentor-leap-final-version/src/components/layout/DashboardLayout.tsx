"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { Loader } from "@/components/ui/Loader";

import { isProfileComplete } from "@/utils/profileValidation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
    // Route guard for Profile Setup
    if (!loading && user && userData && !isProfileComplete(userData) && window.location.pathname !== '/dashboard/profile/setup') {
      router.replace("/dashboard/profile/setup");
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      {/* PROFESSIONAL SIDEBAR */}
      <Sidebar />

      {/* DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP DASHBOARD HEADER */}
        <StudentHeader />

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#04091a] relative custom-scrollbar">
          {/* Subtle gradient glow in background */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00e5ff10] blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#6366f108] blur-[150px] rounded-full pointer-events-none"></div>

          <div className="p-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
