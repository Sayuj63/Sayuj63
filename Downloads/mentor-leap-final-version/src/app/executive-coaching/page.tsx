"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal, FadeIn } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { fetchCoachingPrograms, submitCoachingRequest } from "@/lib/api";
import { useState, useEffect } from "react";

export default function CoachingPage() {
  const [status, setStatus] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoachingPrograms().then((data: any[]) => {
      setPrograms(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  
  const submitForm = async (e: any) => {
    e.preventDefault();
    setStatus("submitting");
    await submitCoachingRequest({});
    setStatus("success");
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="px-5 py-[120px] max-w-[1200px] mx-auto text-center flex flex-col items-center">
        <Reveal>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00e5ff] text-xs font-semibold tracking-wider uppercase mb-6">
            Executive Coaching
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading>
            Elevate Your Leadership with <GradientText>1:1 Coaching</GradientText>
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.2}>
          <Paragraph className="max-w-[700px] mx-auto mt-2">
            Tailored coaching programs for executives, founders, and professionals who want to master strategic communication and build an influential personal brand.
          </Paragraph>
        </Reveal>
        <Reveal delay={0.3}>
          <a href="#booking">
            <Button className="mt-6">Book a Discovery Call</Button>
          </a>
        </Reveal>
      </section>

      {/* Programs */}
      <section className="px-5 py-[100px] max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-4">Coaching Programs</h3>
            <p className="text-[#cbd5f5]">Choose the track that fits your career stage.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
             <p className="text-center text-[#94a3b8] col-span-3">Syncing coaching frameworks...</p>
          ) : programs.length > 0 ? programs.map((p, i) => (
            <Reveal key={p.id || p.title} delay={0.1 * i}>
              <Card>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  {p.icon || '👔'}
                </div>
                <h4 className="text-xl font-bold mb-3">{p.title}</h4>
                <p className="text-sm text-[#94a3b8] mb-6">{p.description || p.desc}</p>
                <ul className="space-y-3 mb-8">
                  {(p.features || []).map((item: string) => (
                    <li key={item} className="flex items-start text-sm text-[#cbd5f5]">
                      <span className="text-[#00e5ff] mr-2">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" fullWidth>Learn More</Button>
              </Card>
            </Reveal>
          )) : (
            <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
               <p className="text-[#94a3b8] italic">We're finalizing new coaching modules. Contact us for custom availability.</p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="px-5 py-[120px] max-w-[800px] mx-auto">
        <Reveal>
          <Card className="!p-10">
            <h3 className="text-3xl font-bold mb-2">Book a Discovery Call</h3>
            <p className="text-[#94a3b8] text-sm mb-10">Fill out the form below to see if we're a good fit for 1:1 coaching.</p>
            
            {status === "success" ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] flex items-center justify-center mx-auto text-3xl mb-4">✓</div>
                <h4 className="text-xl font-bold">Request Received!</h4>
                <p className="text-[#94a3b8] mt-2">Our team will get back to you shortly to schedule your call.</p>
              </div>
            ) : (
              <form onSubmit={submitForm} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[#cbd5f5] font-medium">Full Name</label>
                    <Input required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#cbd5f5] font-medium">Email Address</label>
                    <Input required type="email" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[#cbd5f5] font-medium">Phone Number</label>
                    <Input required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#cbd5f5] font-medium">Preferred Date</label>
                    <Input required type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#cbd5f5] font-medium">What is your primary coaching goal?</label>
                  <Textarea required placeholder="E.g. I want to improve my board-level presentations..." />
                </div>
                <Button fullWidth disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            )}
          </Card>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
