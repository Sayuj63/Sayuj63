"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import DynamicBackground from "@/components/layout/DynamicBackground";
import AICloudBackground from "@/components/layout/AICloudBackground";
import CursorParticles from "@/components/layout/CursorParticles";
import FloatingChatbot from "@/components/layout/FloatingChatbot";
import Header from "@/components/layout/Header";
import OfferBanner from "@/components/layout/OfferBanner";
import Footer from "@/components/layout/Footer";
import AuthProvider, { useAuth } from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, loading, user } = useAuth();

  const isAuthPath = pathname.startsWith("/auth") || pathname === "/auth/login" || pathname === "/auth/register";
  const isAdminPath = pathname.startsWith("/admin");
  const isDashboardPath = pathname.startsWith("/dashboard");
  const isCoursePath = pathname.startsWith("/courses") || pathname.startsWith("/course-player");

  useEffect(() => {
    if (!loading && user && pathname === "/") {
      router.replace(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isAdmin, loading, pathname, router]);

  // Routes that should NOT have marketing header/footer
  const isExcludedPath = isAdminPath || isDashboardPath || isAuthPath || pathname.startsWith("/course-player");

  if (isExcludedPath) {
    return (
      <main className="min-h-screen bg-[#020617] relative">
        {children}
      </main>
    );
  }

  // Marketing/Landing Page Layout
  return (
    <>
      <AICloudBackground />
      <DynamicBackground />
      <CursorParticles />
      <OfferBanner />
      <Header />
      <main style={{ paddingTop: "70px" }}>
        {children}
      </main>
      <Footer />
      <FloatingChatbot />
    </>
  );
}

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        <LayoutContent>{children}</LayoutContent>
      </QueryProvider>
    </AuthProvider>
  );
}
