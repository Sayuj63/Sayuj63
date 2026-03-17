"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading } from "@/components/ui/Typography";

export default function TermsPage() {
  return (
    <PageWrapper>
      <section className="px-5 py-[100px] max-w-[800px] mx-auto">
        <Reveal>
          <SectionHeading>Terms & Conditions</SectionHeading>
          <div className="mt-8 prose prose-invert max-w-none text-[#cbd5f5]">
            <p>Last updated: March 12, 2026</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h3>
            <p>By accessing and using MentorLeap, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Intellectual Property</h3>
            <p>All content included on this site, such as courses, videos, PDFs, and audio tracks, is the property of MentorLeap and protected by copyright laws. You may not distribute or modify this content without express permission.</p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Refund Policy</h3>
            <p>Due to the digital nature of our resources and recorded courses, all sales are final. For live events and bootcamps, cancellation policies will be outlined on the specific event registration page.</p>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
