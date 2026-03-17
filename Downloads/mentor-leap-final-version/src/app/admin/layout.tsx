"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader } from "@/components/ui/Loader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-[#04091a] p-10 custom-scrollbar relative">
          {/* Subtle admin-themed glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00e5ff08] blur-[150px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
