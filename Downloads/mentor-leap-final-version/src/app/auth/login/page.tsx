"use client";
import React, { useState } from "react";
import { Reveal } from "@/components/ui/Animation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { handleAuthError } from "@/lib/auth-errors";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const syncUserToFirestore = async (uid: string, name: string, email: string) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, name, email }),
    });
  };

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push(user.email === "admin@mentorleap.com" ? "/admin" : "/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setToast({ show: true, message: "Logged in successfully!", type: "success" });

      const destination = user.email === "admin@mentorleap.com" ? "/admin" : "/dashboard";
      setTimeout(() => router.push(destination), 1000);
    } catch (error: any) {
      const { message } = handleAuthError(error);
      setToast({ show: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      try {
        await syncUserToFirestore(user.uid, user.displayName || "Google User", user.email || "");
      } catch (e) {
        console.error("Failed to sync user", e);
      }
      setToast({ show: true, message: "Logged in with Google!", type: "success" });
      // The push will also happen automatically from user auth state useEffect, but we'll leave this here for snappiness.
      const destination = user.email === "admin@mentorleap.com" ? "/admin" : "/dashboard";
      router.push(destination);
    } catch (error: any) {
      const { message } = handleAuthError(error);
      setToast({ show: true, message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00e5ff10] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6366f110] blur-[120px] rounded-full"></div>

      <Reveal>
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <Link href="/">
              <Image
                src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg"
                alt="MentorLeap"
                width={160}
                height={56}
                style={{ height: "56px", width: "auto" }}
                priority
              />
            </Link>
          </div>

          <Card className="!p-10 border-white/5 shadow-2xl relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-[#94a3b8] text-sm">Sign in to your MentorLeap account.</p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 py-3 rounded-xl transition-all mb-8 group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-white">Sign in with Google</span>
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f172a] px-4 text-[#475569] font-bold tracking-widest">Or continue with</span></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-[#cbd5f5] font-medium">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#cbd5f5] font-medium">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#00e5ff] hover:underline">Forgot password?</Link>
                </div>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </div>
              <Button fullWidth className="!mt-8 shadow-[0_0_20px_rgba(0,229,255,0.2)]" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center mt-10 text-sm text-[#94a3b8]">
              Don't have an account? <Link href="/auth/register" className="text-[#00e5ff] hover:underline font-semibold">Sign up</Link>
            </div>
          </Card>
        </div>
      </Reveal>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
