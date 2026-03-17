"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchResources } from "@/lib/api";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources().then((data: any[]) => {
      setResources(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
          {loading ? (
             <p className="text-center text-[#94a3b8] col-span-3 py-20">Accessing digital archives...</p>
          ) : resources.length > 0 ? resources.map((res, i) => (
            <Reveal key={res.id || i} delay={i * 0.1}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#00e5ff] mb-2">{res.type}</div>
                  <h3 className="text-xl font-bold mb-3">{res.title}</h3>
                  <p className="text-[#94a3b8] text-sm mb-6">{res.description || res.desc}</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-4">{res.price === 0 || res.price === '0' || !res.price ? 'Free' : `₹${res.price}`}</div>
                  <Link href={res.link || `/resources/${res.id}`} className="block">
                    <Button fullWidth variant={(res.price === 0 || res.price === 'Free') ? 'outline' : 'secondary'}>Access Now</Button>
                  </Link>
                </div>
              </Card>
            </Reveal>
          )) : (
            <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-[#94a3b8] italic">Our resource library is currently being updated. Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
