"use client";
import React, { useState } from "react";
import { Reveal } from "@/components/ui/Animation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const syncUserToFirestore = async (uid: string, name: string, email: string) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, name, email }),
    });
    if (!res.ok) throw new Error("Failed to save user data.");
  };

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.name });
      await syncUserToFirestore(user.uid, formData.name, formData.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Google Sign-up failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00e5ff10] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6366f110] blur-[120px] rounded-full"></div>

      <Reveal>
        <div className="w-full max-w-md">
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-[#94a3b8] text-sm">Join the MentorLeap community.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 py-3 rounded-xl transition-all mb-8 group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-white">Sign up with Google</span>
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f172a] px-4 text-[#475569] font-bold tracking-widest">Or create with email</span></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-[#cbd5f5] font-medium">Full Name</label>
                <Input
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#cbd5f5] font-medium">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#cbd5f5] font-medium">Password</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <Button fullWidth className="!mt-8 shadow-[0_0_20px_rgba(0,229,255,0.2)]" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
            <div className="text-center mt-10 text-sm text-[#94a3b8]">
              Already have an account? <Link href="/auth/login" className="text-[#00e5ff] hover:underline font-semibold">Sign in</Link>
            </div>
          </Card>
        </div>
      </Reveal>
    </div>
  );
}
