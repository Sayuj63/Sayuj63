"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Camera, User, Calendar, MapPin, Phone, AlertTriangle } from "lucide-react";

export default function ProfileSetupPage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        gender: "Prefer not to say",
        contactNumber: "",
        address: "",
        aboutMe: "",
        interests: "",
        photoURL: "",
    });

    useEffect(() => {
        if (!loading && user && userData) {
            setFormData({
                name: userData.name || user.displayName || "",
                dateOfBirth: userData.dateOfBirth || "",
                gender: userData.gender || "Prefer not to say",
                contactNumber: userData.contactNumber || "",
                address: userData.address || "",
                aboutMe: userData.aboutMe || "",
                interests: Array.isArray(userData.interests) ? userData.interests.join(", ") : "",
                photoURL: userData.photoURL || user.photoURL || "",
            });
        }
    }, [user, userData, loading]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const { auth } = await import("@/lib/firebase");
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Authentication required for upload");

            const imgData = new FormData();
            imgData.append("file", file);

            const res = await fetch("/api/users/profile/photo", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: imgData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Upload failed");
            }

            const data = await res.json();
            setFormData(prev => ({ ...prev, photoURL: data.url }));
        } catch (err: any) {
            setError(err.message || "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.dateOfBirth || !formData.contactNumber) {
            setError("Please fill out all mandatory fields.");
            return;
        }

        if (formData.aboutMe.length > 500) {
            setError("About me must be 500 characters or less.");
            return;
        }

        try {
            setSaving(true);
            const { auth } = await import("@/lib/firebase");
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Authentication is missing. Please sign in again.");

            const interestsArray = formData.interests.split(",").map(i => i.trim()).filter(Boolean);

            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    interests: interestsArray,
                    profileCompleted: true
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save profile");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto py-12 px-5">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3">Complete Your Profile</h1>
                    <p className="text-[#94a3b8]">Help us personalize your MentorLeap experience.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400">
                        <AlertTriangle size={20} />
                        <span className="font-semibold text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Card className="!p-8 bg-white/[0.03] border-white/10 relative overflow-hidden mb-8">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff05] blur-[100px] rounded-full hidden md:block"></div>

                        <div className="relative z-10 space-y-8">
                            {/* Avatar Section */}
                            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-white/5">
                                <div
                                    className={`w-24 h-24 rounded-full bg-[#04091a] border border-white/10 flex items-center justify-center relative group overflow-hidden ${uploading ? 'opacity-50' : ''}`}
                                >
                                    {formData.photoURL ? (
                                        <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-[#475569]" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                                            <Loader />
                                        </div>
                                    )}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm z-10"
                                    >
                                        <Camera size={24} className="text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/jpeg, image/png, image/gif"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold text-white mb-1">Profile Photo</h3>
                                    <p className="text-xs text-[#64748b] mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="text-xs font-black uppercase tracking-widest text-[#00e5ff] hover:text-white transition-colors"
                                    >
                                        {uploading ? "Uploading..." : "Upload Image"}
                                    </button>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-[#475569]" size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Date of Birth *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-[#475569]" size={16} />
                                        <input
                                            type="date"
                                            required
                                            value={formData.dateOfBirth}
                                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Contact Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-[#475569]" size={16} />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                            className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 appearance-none"
                                    >
                                        <option>Prefer not to say</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-[#475569]" size={16} />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Interests (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.interests}
                                        onChange={e => setFormData({ ...formData, interests: e.target.value })}
                                        placeholder="e.g. Leadership, Public Speaking, Management"
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex justify-between text-xs font-black uppercase tracking-widest text-[#64748b]">
                                        <span>About Me</span>
                                        <span className={formData.aboutMe.length > 500 ? "text-red-400" : ""}>{formData.aboutMe.length}/500</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.aboutMe}
                                        onChange={e => setFormData({ ...formData, aboutMe: e.target.value })}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 resize-none custom-scrollbar"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={saving || uploading}
                            className="w-full md:w-auto min-w-[200px] font-black uppercase tracking-widest shadow-[0_10px_30px_#00e5ff20]"
                        >
                            {saving ? "Saving Profile..." : "Complete Setup"}
                        </Button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
}
