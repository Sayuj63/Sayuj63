"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AudioBundlesPage() {
  return (
    <PageWrapper>
      <section className="px-5 py-[100px] max-w-[1200px] mx-auto text-center">
        <Reveal>
          <SectionHeading>Audio <GradientText>Bundles</GradientText></SectionHeading>
          <Paragraph className="max-w-[600px] mx-auto mt-4">Start your day with high-energy leadership affirmations and quick communication tips on the go.</Paragraph>
        </Reveal>
      </section>
      
      <section className="px-5 pb-[140px] max-w-[1200px] mx-auto flex flex-col gap-6">
        {[1, 2].map((i) => (
          <Reveal key={i} delay={i * 0.1}>
            <Card className="flex flex-col md:flex-row items-center gap-8 !p-6">
               <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#6366f1] flex items-center justify-center text-3xl shadow-lg shrink-0">🎧</div>
               <div className="flex-1 text-center md:text-left">
                 <h3 className="text-xl font-bold mb-2">Morning Motivation Series</h3>
                 <p className="text-[#94a3b8] text-sm">15 quick 5-minute audio tracks designed to prime your mindset before stepping into the office or onto the stage.</p>
                 <p className="text-xs text-[#cbd5f5] mt-2 font-medium">15 Tracks • 1h 15m Total Time</p>
               </div>
               <div className="shrink-0 w-full md:w-auto">
                 <div className="text-2xl font-bold mb-3 text-center md:text-right">$19</div>
                 <Button fullWidth>Unlock Access</Button>
               </div>
            </Card>
          </Reveal>
        ))}
      </section>
    </PageWrapper>
  );
}
