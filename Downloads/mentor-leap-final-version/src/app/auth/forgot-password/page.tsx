"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <PageWrapper>
      <div className="min-h-[60vh] flex items-center justify-center px-5 py-20">
        <Reveal>
          <Card className="w-full max-w-md !p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
              <p className="text-[#94a3b8] text-sm">Enter your email to receive a reset link.</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm text-[#cbd5f5] font-medium">Email Address</label>
                <Input type="email" required placeholder="you@domain.com" />
              </div>
              <Button fullWidth className="!mt-8">Send Reset Link</Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </PageWrapper>
  );
}
