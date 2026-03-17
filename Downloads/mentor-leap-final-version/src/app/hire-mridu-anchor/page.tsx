"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { useState } from "react";

export default function HireAnchorPage() {
    const [status, setStatus] = useState("");

    const submitForm = async (e: any) => {
        e.preventDefault();
        setStatus("submitting");
        setTimeout(() => setStatus("success"), 1500);
    }

    return (
        <PageWrapper>
            <section className="px-5 py-[120px] max-w-[1200px] mx-auto text-center flex flex-col items-center">
                <Reveal>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00e5ff] text-xs font-semibold tracking-wider uppercase mb-6">
                        Hire Mridu as an Anchor
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <SectionHeading>
                        Elevate Your Event with a <GradientText>Professional Anchor</GradientText>
                    </SectionHeading>
                </Reveal>
                <Reveal delay={0.2}>
                    <Paragraph className="max-w-[700px] mx-auto mt-2">
                        Engage your audience with an experienced moderator, event host, and communications expert with a background in journalism.
                    </Paragraph>
                </Reveal>
                <Reveal delay={0.3}>
                    <a href="#booking-form">
                        <Button className="mt-6">Submit Event Inquiry</Button>
                    </a>
                </Reveal>
            </section>

            <section className="px-5 py-[80px] max-w-[1200px] mx-auto text-center">
                <Reveal>
                    <h3 className="text-3xl font-bold mb-10">Watch Mridu in Action</h3>
                    <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                        {[
                            "PWTz7eGclu8",
                            "bZ9BtRfgg6o",
                            "ZrVv0gkkaMs",
                            "i5pDykiREPw",
                            "YkdiS_guFrc"
                        ].map((id) => (
                            <iframe
                                key={id}
                                className="rounded-xl flex-shrink-0"
                                src={`https://www.youtube.com/embed/${id}`}
                                width={360}
                                height={200}
                                style={{ border: "none", scrollSnapAlign: 'start', transition: 'transform 0.3s' }}
                                allowFullScreen
                            />
                        ))}
                    </div>
                </Reveal>
            </section>

            <section id="booking-form" className="px-5 py-[80px] max-w-[800px] mx-auto">
                <Reveal>
                    <Card className="!p-10">
                        <h3 className="text-3xl font-bold mb-2">Event Inquiry</h3>
                        <p className="text-[#94a3b8] text-sm mb-10">Fill out the form below to inquire about dates and availability.</p>

                        {status === "success" ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] flex items-center justify-center mx-auto text-3xl mb-4">✓</div>
                                <h4 className="text-xl font-bold">Inquiry Sent!</h4>
                                <p className="text-[#94a3b8] mt-2">Our team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitForm} className="space-y-6 text-left">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-[#cbd5f5] font-medium">Full Name</label>
                                        <Input required placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-[#cbd5f5] font-medium">Company/Organization</label>
                                        <Input required placeholder="Acme Corp" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-[#cbd5f5] font-medium">Email Address</label>
                                        <Input required type="email" placeholder="john@company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-[#cbd5f5] font-medium">Event Date</label>
                                        <Input required type="date" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-[#cbd5f5] font-medium">Event Details</label>
                                    <Textarea required placeholder="Describe the event size, location, and role required..." />
                                </div>
                                <Button fullWidth disabled={status === "submitting"}>
                                    {status === "submitting" ? "Submitting..." : "Send Inquiry"}
                                </Button>
                            </form>
                        )}
                    </Card>
                </Reveal>
            </section>
        </PageWrapper>
    );
}