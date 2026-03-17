"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const resources = [
  { type: "Course", title: "Public Speaking Mastery", desc: "A comprehensive guide to delivering impactful speeches.", price: "$149" },
  { type: "PDF Template", title: "Leadership Communication Framework", desc: "Actionable frameworks for tough conversations.", price: "Free" },
  { type: "Audio Bundle", title: "Morning Motivation Tracks", desc: "Start your day with high-energy leadership affirmations.", price: "$19" }
];

export default function ResourcesPage() {
  return (
    <PageWrapper>
      <section className="px-5 pt-[100px] pb-[60px] max-w-[1200px] mx-auto text-center">
        <Reveal>
          <SectionHeading>Resource <GradientText>Library</GradientText></SectionHeading>
          <Paragraph className="max-w-[600px] mx-auto mt-4">Elevate your skills with our premium collection of digital courses, PDFs, and audio bundles.</Paragraph>
        </Reveal>
      </section>
      
      <section className="px-5 pb-[140px] max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((res, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#00e5ff] mb-2">{res.type}</div>
                  <h3 className="text-xl font-bold mb-3">{res.title}</h3>
                  <p className="text-[#94a3b8] text-sm mb-6">{res.desc}</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-4">{res.price}</div>
                  <Button fullWidth variant={res.price === 'Free' ? 'outline' : 'secondary'}>Access Now</Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
