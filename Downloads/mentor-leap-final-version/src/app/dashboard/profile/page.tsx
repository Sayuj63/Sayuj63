"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { User, Mail, Calendar, BookOpen, Award, AlertTriangle, Edit2, Camera, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
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

    const initEditForm = () => {
        setFormData({
            name: userData?.name || user?.displayName || "",
            dateOfBirth: userData?.dateOfBirth || "",
            gender: userData?.gender || "Prefer not to say",
            contactNumber: userData?.contactNumber || "",
            address: userData?.address || "",
            aboutMe: userData?.aboutMe || "",
            interests: Array.isArray(userData?.interests) ? userData.interests.join(", ") : "",
            photoURL: userData?.photoURL || user?.photoURL || "",
        });
        setIsEditing(true);
    };

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.dateOfBirth || !formData.contactNumber) {
            setError("Please fill out all mandatory fields (Name, Date of Birth, Contact Number).");
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
                    interests: interestsArray
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save profile");
            }

            setIsEditing(false);
            window.location.reload(); // Quick refresh to catch updated `userData`
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader /></div>;

    if (!user || !userData) {
        return (
            <div className="max-w-4xl mx-auto pb-20 p-10 text-center">
                <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                <p className="text-[#94a3b8] mb-6">We couldn't load your profile. You may need to sign in again.</p>
                <Button onClick={() => router.push('/auth/login')}>Return to Login</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">My Profile</h1>
                    <p className="text-[#94a3b8] text-sm mt-1">Your personal account information</p>
                </div>
                {!isEditing && (
                    <Button onClick={initEditForm} variant="outline" className="gap-2">
                        <Edit2 size={16} /> Edit Profile
                    </Button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
                    <AlertTriangle size={20} />
                    <span className="text-sm font-semibold">{error}</span>
                </div>
            )}

            {isEditing ? (
                /* EDIT MODE */
                <form onSubmit={handleSave}>
                    <Card className="!p-8 bg-white/[0.03] border-white/10 relative overflow-hidden mb-8">
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

                    <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                </form>
            ) : (
                /* VIEW MODE */
                <>
                    {/* Profile Header */}
                    <Card className="!p-8 bg-white/[0.03] border-white/10 mb-6">
                        <div className="flex items-start gap-6 flex-wrap">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {(userData.photoURL || user.photoURL) ? (
                                    <img src={userData.photoURL || user.photoURL || ""} alt={userData.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={36} className="text-[#00e5ff]" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{userData.name || user.displayName}</h2>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded mt-1 inline-block ${userData.role === "admin"
                                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                            : "bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20"
                                            }`}>
                                            {userData.role || "student"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                                        <Mail size={14} className="text-[#475569]" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                                        <Calendar size={14} className="text-[#475569]" />
                                        Member since {
                                            userData.createdAt
                                                ? new Date(userData.createdAt instanceof Date ? userData.createdAt : (userData.createdAt as any)._seconds * 1000 || Date.now()).toLocaleDateString("en-IN", {
                                                    year: "numeric", month: "long", day: "numeric"
                                                })
                                                : "Forever"
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <Card className="!p-6 text-center bg-white/[0.03] border-white/10 hover:border-[#00e5ff]/30 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center mx-auto mb-3">
                                <BookOpen size={18} />
                            </div>
                            <div className="text-3xl font-black text-[#00e5ff] mb-1">{userData.enrolledCourses?.length || 0}</div>
                            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Courses</div>
                        </Card>
                        <Card className="!p-6 text-center bg-white/[0.03] border-white/10 hover:border-purple-500/30 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center mx-auto mb-3">
                                <Calendar size={18} />
                            </div>
                            <div className="text-3xl font-black text-[#6366f1] mb-1">{userData.registeredEvents?.length || 0}</div>
                            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Events</div>
                        </Card>
                        <Card className="!p-6 text-center bg-white/[0.03] border-white/10 hover:border-green-500/30 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-3">
                                <Award size={18} />
                            </div>
                            <div className="text-3xl font-black text-green-400 mb-1">{userData.certificates?.length || 0}</div>
                            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Certificates</div>
                        </Card>
                    </div>

                    {/* Extended Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="!p-6 bg-white/[0.03] border-white/10 space-y-4">
                            <h3 className="font-bold text-white mb-2">Personal Information</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-start py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest w-1/3">About</span>
                                    <span className="text-sm text-[#cbd5f5] w-2/3 text-right">{userData.aboutMe || "Not specified."}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest">Phone</span>
                                    <span className="text-sm text-[#cbd5f5]">{userData.contactNumber || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest">Date of Birth</span>
                                    <span className="text-sm text-[#cbd5f5]">{userData.dateOfBirth || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest">Location</span>
                                    <span className="text-sm text-[#cbd5f5]">{userData.address || "Not provided"}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="!p-6 bg-white/[0.03] border-white/10 space-y-4">
                            <h3 className="font-bold text-white mb-2">System Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest">User ID</span>
                                    <span className="text-xs text-[#94a3b8] font-mono">{user.uid.slice(0, 20)}...</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest">Role</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${userData.role === "admin"
                                        ? "bg-purple-500/10 text-purple-400"
                                        : "bg-white/5 text-[#94a3b8]"
                                        }`}>
                                        {userData.role}
                                    </span>
                                </div>
                                <div className="flex flex-col py-2 border-b border-white/5">
                                    <span className="text-xs text-[#475569] font-black uppercase tracking-widest mb-2">Interests</span>
                                    {userData.interests && userData.interests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {userData.interests.map((interest, i) => (
                                                <span key={i} className="text-[10px] bg-white/5 text-[#94a3b8] px-2 py-1 rounded border border-white/10">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-[#cbd5f5]">No interests specified.</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
