"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchEvents } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <section className="px-5 pt-[100px] pb-[60px] max-w-[1200px] mx-auto text-center">
        <Reveal>
          <SectionHeading>Live <GradientText>Events & Bootcamps</GradientText></SectionHeading>
          <Paragraph className="max-w-[600px] mx-auto mt-4">Join our high-impact live learning experiences designed for rapid skill acquisition and networking.</Paragraph>
        </Reveal>
      </section>
      <section className="px-5 pb-[140px] max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {loading ? (
            <p className="text-center text-[#94a3b8] col-span-2">Syncing with event registry...</p>
          ) : events.length > 0 ? events.map((ev, i) => (
            <Reveal key={ev.id} delay={i * 0.1}>
              <Card>
                <div className="aspect-video w-full rounded-xl bg-[#0f172a] mb-6 flex items-center justify-center overflow-hidden border border-white/5 shadow-2xl">
                  {ev.banner ? (
                    <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{i % 2 === 0 ? '🎙' : '⚡'}</span>
                  )}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[#00e5ff] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      {ev.date?._seconds ? new Date(ev.date._seconds * 1000).toLocaleDateString() : new Date(ev.date).toLocaleDateString()}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{ev.title}</h3>
                  </div>
                  <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 px-3 py-1 rounded-full text-xs font-black text-[#00e5ff]">
                    ₹{ev.price}
                  </div>
                </div>
                <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-widest mb-6">
                  Speaker: {ev.speaker || 'Mridu Bhandari'} • {ev.seats || 0} Seats left
                </p>
                <Link href={`/events/${ev.id}`} className="block">
                  <Button fullWidth variant="secondary" className="font-black uppercase tracking-widest text-xs">View Details</Button>
                </Link>
              </Card>
            </Reveal>
          )) : (
            <div className="col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-[#94a3b8] italic">No live events scheduled at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
