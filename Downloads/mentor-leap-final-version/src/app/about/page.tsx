"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="px-5 pt-[120px] pb-[80px] max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <SectionHeading>Our <GradientText>Mission & Vision</GradientText></SectionHeading>
            <Paragraph className="max-w-[800px] mx-auto mt-6 text-lg">
              Empowering professionals and founders to master the art of communication and leadership.
            </Paragraph>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-6.16.25-AM.jpeg" 
                alt="Founder" 
                fill 
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight">Meet <GradientText>Mridu Bhandari</GradientText></h2>
              <p className="text-[#cbd5f5] leading-relaxed text-lg">
                With over a decade of experience in executive coaching and public speaking, Mridu Bhandari has helped thousands of professionals find their voice and lead with impact.
              </p>
              <p className="text-[#94a3b8] leading-relaxed">
                MentorLeap was born out of a passion for bridging the gap between technical expertise and leadership presence. Our goal is to provide a comprehensive ecosystem for growth, combining structured courses, live bootcamps, and personalized coaching.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <Card className="!p-6 text-center">
                  <div className="text-3xl font-black text-[#00e5ff] mb-2">10k+</div>
                  <div className="text-[10px] text-[#475569] font-black uppercase tracking-widest">Students Mentored</div>
                </Card>
                <Card className="!p-6 text-center">
                  <div className="text-3xl font-black text-[#6366f1] mb-2">500+</div>
                  <div className="text-[10px] text-[#475569] font-black uppercase tracking-widest">Corporate Workshops</div>
                </Card>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] text-2xl font-bold">01</div>
              <h3 className="text-xl font-bold">Authenticity</h3>
              <p className="text-[#94a3b8] text-sm">We believe true leadership starts with being yourself. We help you find your unique voice.</p>
            </Card>
            <Card className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1] text-2xl font-bold">02</div>
              <h3 className="text-xl font-bold">Impact</h3>
              <p className="text-[#94a3b8] text-sm">Communication is not just about words; it's about the results you create and the legacy you leave.</p>
            </Card>
            <Card className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] text-2xl font-bold">03</div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-[#94a3b8] text-sm">Join a vibrant network of high-achievers who are committed to continuous learning and mutual growth.</p>
            </Card>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
