"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="px-5 py-[120px] max-w-[1000px] mx-auto grid md:grid-cols-2 gap-16">
        <Reveal>
          <SectionHeading>Get In <GradientText>Touch</GradientText></SectionHeading>
          <Paragraph>Have a question about our programs? Want to collaborate? Drop us a message and our team will get back to you shortly.</Paragraph>
          <div className="mt-10 space-y-6">
            <div className="flex gap-4">
               <div className="text-2xl">📧</div>
               <div><h4 className="font-bold text-white">Email</h4><p className="text-[#94a3b8] text-sm">support@mentorleap.com</p></div>
            </div>
            <div className="flex gap-4">
               <div className="text-2xl">📍</div>
               <div><h4 className="font-bold text-white">Office</h4><p className="text-[#94a3b8] text-sm">Virtual HQ, Global Reach</p></div>
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={0.2}>
          <Card className="!p-8">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <Input placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Input placeholder="Subject" required />
              <Textarea placeholder="How can we help you?" required />
              <Button fullWidth>SendMessage</Button>
            </form>
          </Card>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
