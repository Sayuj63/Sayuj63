"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { auth } = await import("@/lib/firebase");
      const { sendPasswordResetEmail } = await import("firebase/auth");
      
      await sendPasswordResetEmail(auth, email);
      setToast({ show: true, message: "Password reset instructions sent to your email.", type: "success" });
    } catch (error: any) {
      setToast({ show: true, message: error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 pb-20 px-4">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-black text-center mb-2">Reset Password</h1>
        <p className="text-[#94a3b8] text-sm text-center mb-8">
          Enter your email address to receive password reset instructions.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            placeholder="you@example.com"
          />

          <Button fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#94a3b8]">
          Remember your password? <a href="/auth/login" className="text-[#00e5ff] hover:underline hover:text-white transition-colors">Sign in here</a>
        </div>
      </div>

      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}
