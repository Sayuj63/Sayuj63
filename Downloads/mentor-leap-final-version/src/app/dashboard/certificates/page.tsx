"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Award, Download, AlertTriangle, Calendar } from "lucide-react";

export default function CertificatesPage() {
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            setError(null);
            const { auth } = await import("@/lib/firebase");
            const uid = auth.currentUser?.uid;

            if (!uid) {
                setError("You must be logged in to view certificates");
                return;
            }

            const { db } = await import("@/lib/firebase");
            const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore");

            // Fetch certificates belonging to this user
            const certSnap = await getDocs(
                query(
                    collection(db, "certificates"),
                    where("userId", "==", uid),
                    orderBy("issuedAt", "desc")
                )
            );

            const certs: any[] = [];
            certSnap.forEach((docSnap) => {
                const data = docSnap.data();
                const issuedAt = data.issuedAt?._seconds
                    ? new Date(data.issuedAt._seconds * 1000)
                    : data.issuedAt?.toDate
                        ? data.issuedAt.toDate()
                        : data.issuedAt
                            ? new Date(data.issuedAt)
                            : null;
                certs.push({ id: docSnap.id, ...data, issuedAt });
            });

            setCertificates(certs);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white">My Certificates</h1>
                <p className="text-[#94a3b8] text-sm mt-1">
                    {certificates.length > 0
                        ? `${certificates.length} certificate${certificates.length !== 1 ? "s" : ""} earned`
                        : "Complete courses to earn certificates"}
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
                    <AlertTriangle size={24} />
                    <div>
                        <div className="font-bold">Failed to load certificates</div>
                        <div className="text-sm opacity-70 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={fetchCertificates}
                        className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {certificates.length === 0 ? (
                <Card className="!p-10 bg-white/[0.03] border-white/10 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#475569]">
                        <Award size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">No Certificates Yet</h3>
                    <p className="text-[#94a3b8] text-sm mb-6">
                        Complete enrolled courses to earn your certificates. They&apos;ll appear here once issued.
                    </p>
                    <a href="/dashboard/my-courses">
                        <button className="px-6 py-2 bg-[#00e5ff] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors">
                            View My Courses
                        </button>
                    </a>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card
                            key={cert.id}
                            className="!p-6 bg-white/[0.03] border-white/10 hover:border-[#00e5ff]/30 transition-all group relative overflow-hidden"
                        >
                            {/* Background glow */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00e5ff]/5 rounded-full blur-2xl group-hover:bg-[#00e5ff]/10 transition-all" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center">
                                    <Award size={24} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-green-400/10 text-green-400 border border-green-400/20">
                                    Certified
                                </span>
                            </div>

                            <h3 className="font-bold text-white mb-1 leading-snug">{cert.courseTitle || cert.title || "Course Certificate"}</h3>
                            <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest mb-4">{cert.courseName || ""}</p>

                            {cert.issuedAt && (
                                <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-5">
                                    <Calendar size={12} />
                                    Issued {cert.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                </div>
                            )}

                            {cert.certificateUrl && (
                                <a
                                    href={cert.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/20 text-[#00e5ff] text-sm font-bold transition-all"
                                >
                                    <Download size={14} />
                                    Download Certificate
                                </a>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
