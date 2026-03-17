"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading } from "@/components/ui/Typography";

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper>
      <section className="px-5 py-[100px] max-w-[800px] mx-auto">
        <Reveal>
          <SectionHeading>Privacy Policy</SectionHeading>
          <div className="mt-8 prose prose-invert max-w-none text-[#cbd5f5]">
            <p>Last updated: March 12, 2026</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h3>
            <p>We collect information that you explicitly provide to us when creating an account, booking a session, or purchasing a course. This includes name, email, phone number, and professional details.</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h3>
            <p>Your information is used to provide, maintain, and improve our services, communicate with you, and personalize your learning experience on MentorLeap.</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Data Security</h3>
            <p>We implement robust security measures to protect your personal data, utilizing industry-standard encryption and secure cloud infrastructure through Google Firebase.</p>
            <p className="mt-10 text-sm">For comprehensive details about our data handling practices, please contact our support team.</p>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
