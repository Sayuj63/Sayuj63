"use client";
import React, { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader } from "@/components/ui/Loader";
import { Toast } from "@/components/ui/Toast";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user, userData } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      return res.json();
    }
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        router.push("/auth/login?redirect=" + id);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setToast({ show: true, message: "Successfully registered!", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: (error: any) => {
      setToast({ show: true, message: error.message, type: "error" });
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;
  if (!event) return <div className="h-screen flex items-center justify-center bg-[#020617]"><div className="text-xl font-bold">Event not found</div></div>;

  const isRegistered = userData?.registeredEvents?.includes(id as string);

  return (
    <PageWrapper>
      <section className="px-5 py-[120px] max-w-[1200px] mx-auto overflow-hidden">
        <Reveal>
          <div>
            <div className="relative aspect-[21/9] w-full rounded-3xl bg-[#0f172a] border border-white/10 mb-10 overflow-hidden flex items-center justify-center shadow-2xl">
              {event.imageUrl ? (
                <img src={event.imageUrl} className="w-full h-full object-cover opacity-60" alt={event.title} />
              ) : (
                <div className="text-5xl font-bold opacity-10 uppercase tracking-tighter italic">MentorLeap Masterclass</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-16">
              <div className="space-y-10">
                <div>
                  <span className="px-4 py-1.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-4 inline-block">{event.category || "Professional Development"}</span>
                  <h1 className="text-5xl font-bold mb-6 text-white leading-tight">{event.title}</h1>
                  <p className="text-[#94a3b8] text-xl leading-relaxed">{event.description}</p>
                </div>

                <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8">
                  <h3 className="text-2xl font-bold text-[#00e5ff]">Masterclass Agenda</h3>
                  <div className="space-y-6">
                    <div className="flex gap-6 items-start pb-6 border-b border-white/5">
                      <div className="text-[#00e5ff] font-bold text-lg min-w-[100px]">10:00 AM</div>
                      <div className="text-[#cbd5f5] font-medium text-lg">Foundations of Executive Presence</div>
                    </div>
                    <div className="flex gap-6 items-start pb-6 border-b border-white/5">
                      <div className="text-[#00e5ff] font-bold text-lg min-w-[100px]">12:00 PM</div>
                      <div className="text-[#cbd5f5] font-medium text-lg">Live Framework Application Workshop</div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="text-[#00e5ff] font-bold text-lg min-w-[100px]">02:30 PM</div>
                      <div className="text-[#cbd5f5] font-medium text-lg">High-Stakes Positioning & Hotseats</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-10 border border-white/10 sticky top-32 shadow-3xl">
                  <div className="text-4xl font-black mb-4 tracking-tight">
                    {event.price === 0 ? <span className="text-[#00e5ff]">FREE</span> : `₹${event.price}`}
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-sm text-[#cbd5f5]">
                      <span className="text-[#00e5ff] font-bold w-16 uppercase text-[10px]">Date</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#cbd5f5]">
                      <span className="text-[#00e5ff] font-bold w-16 uppercase text-[10px]">Host</span>
                      <span>Mridu Bhandari</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#cbd5f5]">
                      <span className="text-[#00e5ff] font-bold w-16 uppercase text-[10px]">Link</span>
                      <span>Google Meet (Sent on Email)</span>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    disabled={registerMutation.isPending || isRegistered}
                    onClick={() => registerMutation.mutate()}
                    className={isRegistered ? "bg-emerald-500 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""}
                  >
                    {registerMutation.isPending ? "Processing..." : isRegistered ? "Already Registered" : "Complete Registration"}
                  </Button>

                  {!user && (
                    <p className="text-[10px] text-center text-[#475569] mt-6 font-bold uppercase tracking-widest">Login required to access link</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </PageWrapper>
  );
}
