"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Calendar, Clock, MapPin, Users, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MyEventsPage() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const { auth } = await import("@/lib/firebase");
            const token = await auth.currentUser?.getIdToken();
            const uid = auth.currentUser?.uid;

            if (!token || !uid) {
                setError("You must be logged in to view your events");
                return;
            }

            const { db } = await import("@/lib/firebase");
            const { doc, getDoc, collection, getDocs, query, where } = await import("firebase/firestore");

            // 1. Get user's registered event IDs
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
                setEvents([]);
                return;
            }

            const userData = userDoc.data();
            const registeredEventIds: string[] = userData.registeredEvents || [];

            if (registeredEventIds.length === 0) {
                setEvents([]);
                return;
            }

            // 2. Fetch event details in batches of 10
            const batchSize = 10;
            const allEvents: any[] = [];

            for (let i = 0; i < registeredEventIds.length; i += batchSize) {
                const batch = registeredEventIds.slice(i, i + batchSize);
                const eventsSnap = await getDocs(
                    query(collection(db, "events"), where("__name__", "in", batch))
                );
                eventsSnap.forEach((docSnap) => {
                    const data = docSnap.data();
                    // Normalize date
                    const rawDate = data.date;
                    const eventDate = rawDate?._seconds
                        ? new Date(rawDate._seconds * 1000)
                        : rawDate?.toDate
                            ? rawDate.toDate()
                            : rawDate
                                ? new Date(rawDate)
                                : null;
                    allEvents.push({
                        id: docSnap.id,
                        ...data,
                        eventDate,
                    });
                });
            }

            // Sort by date ascending
            allEvents.sort((a, b) => {
                if (!a.eventDate) return 1;
                if (!b.eventDate) return -1;
                return a.eventDate - b.eventDate;
            });

            setEvents(allEvents);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to load your events");
        } finally {
            setLoading(false);
        }
    };

    const now = new Date();
    const filteredEvents = events.filter((ev) => {
        if (filter === "upcoming") return ev.eventDate && ev.eventDate >= now;
        if (filter === "past") return !ev.eventDate || ev.eventDate < now;
        return true;
    });

    if (loading) return <div className="p-20 flex justify-center"><Loader /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">My Events</h1>
                    <p className="text-[#94a3b8] text-sm mt-1">
                        {events.length > 0
                            ? `${events.length} event${events.length !== 1 ? "s" : ""} registered`
                            : "No events registered yet"}
                    </p>
                </div>
                {events.length > 0 && (
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        {(["all", "upcoming", "past"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                                    ? "bg-[#00e5ff] text-black"
                                    : "text-[#94a3b8] hover:text-white"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
                    <AlertTriangle size={24} />
                    <div>
                        <div className="font-bold">Failed to load events</div>
                        <div className="text-sm opacity-70 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={fetchMyEvents}
                        className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {filteredEvents.length === 0 ? (
                <Card className="!p-10 bg-white/[0.03] border-white/10 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#475569]">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">
                        {filter === "all" ? "No Events Registered" : `No ${filter} events`}
                    </h3>
                    <p className="text-[#94a3b8] text-sm mb-6">
                        {filter === "all"
                            ? "You haven't registered for any events yet. Check out upcoming webinars and masterclasses."
                            : `You have no ${filter} events to show.`}
                    </p>
                    <Link href="/events" passHref>
                        <button className="px-6 py-2 bg-[#00e5ff] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors">
                            Browse Events
                        </button>
                    </Link>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredEvents.map((event) => {
                        const isUpcoming = event.eventDate && event.eventDate >= now;
                        return (
                            <Card
                                key={event.id}
                                className={`!p-0 overflow-hidden bg-white/[0.03] border-white/10 hover:border-[#00e5ff]/30 transition-all group ${!isUpcoming ? "opacity-70" : ""
                                    }`}
                            >
                                {/* Banner */}
                                <div className="w-full h-40 bg-white/5 overflow-hidden relative">
                                    {event.banner ? (
                                        <img
                                            src={event.banner}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-[#00e5ff]/10 to-[#6366f1]/10">
                                            🎙
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isUpcoming
                                            ? "bg-[#00e5ff]/90 text-black"
                                            : "bg-black/60 text-[#94a3b8]"
                                            }`}>
                                            {isUpcoming ? "Upcoming" : "Past"}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/10 text-[#00e5ff] border border-[#00e5ff]/20">
                                            {event.type || "event"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-white mb-3 leading-snug">{event.title}</h3>
                                    <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">{event.description}</p>

                                    <div className="space-y-2 mb-5">
                                        {event.eventDate && (
                                            <div className="flex items-center gap-2 text-xs text-[#cbd5f5]">
                                                <Calendar size={12} className="text-[#00e5ff]" />
                                                {event.eventDate.toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        )}
                                        {event.speaker && (
                                            <div className="flex items-center gap-2 text-xs text-[#cbd5f5]">
                                                <Users size={12} className="text-[#6366f1]" />
                                                with {event.speaker}
                                            </div>
                                        )}
                                        {event.seats && (
                                            <div className="flex items-center gap-2 text-xs text-[#cbd5f5]">
                                                <Clock size={12} className="text-amber-400" />
                                                {event.seats} seats
                                            </div>
                                        )}
                                    </div>

                                    {event.googleMeetLink && isUpcoming && (
                                        <a
                                            href={event.googleMeetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/20 text-[#00e5ff] text-sm font-bold transition-all">
                                                <ExternalLink size={14} />
                                                Join Event
                                            </button>
                                        </a>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
