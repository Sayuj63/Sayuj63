"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import Link from "next/link";
import { BookOpen, Play, AlertTriangle, Clock, Plus, X, Search, Check } from "lucide-react";

export default function MyCoursesPage() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Add Courses Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [allCatalogCourses, setAllCatalogCourses] = useState<any[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [enrollStatus, setEnrollStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const openAddModal = async () => {
        setIsAddModalOpen(true);
        setEnrollStatus({ type: null, message: '' });
        setSelectedCourseIds([]);
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAllCatalogCourses(data);
            }
        } catch (e: any) {
            console.error("Failed to fetch catalog:", e);
        }
    };

    const handleEnrollSelected = async () => {
        if (selectedCourseIds.length === 0) return;
        setEnrollLoading(true);
        setEnrollStatus({ type: null, message: '' });
        try {
            const { auth } = await import('@/lib/firebase');
            const token = await auth.currentUser?.getIdToken();

            const res = await fetch('/api/enroll/free', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseIds: selectedCourseIds })
            });

            if (res.ok) {
                setEnrollStatus({ type: 'success', message: `Successfully enrolled in ${selectedCourseIds.length} course(s)!` });
                await fetchMyCourses();
                setTimeout(() => setIsAddModalOpen(false), 2000);
            } else {
                const errorData = await res.json();
                setEnrollStatus({ type: 'error', message: errorData.error || 'Failed to enroll in courses. Constraints like capacity/prerequisites might be in effect.' });
            }
        } catch (e: any) {
            setEnrollStatus({ type: 'error', message: e.message || 'An error occurred while enrolling' });
        } finally {
            setEnrollLoading(false);
        }
    };

    const fetchMyCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const { auth } = await import("@/lib/firebase");
            const token = await auth.currentUser?.getIdToken();
            const uid = auth.currentUser?.uid;

            if (!token || !uid) {
                setError("You must be logged in to view your courses");
                return;
            }

            // 1. Get user's enrolled course IDs from Firestore
            const { db } = await import("@/lib/firebase");
            const { doc, getDoc, collection, getDocs, query, where, documentId } = await import("firebase/firestore");

            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
                setCourses([]);
                return;
            }

            const userData = userDoc.data();
            const enrolledCourseIds: string[] = userData.enrolledCourses || [];
            const courseProgress: Record<string, number> = userData.courseProgress || {};

            if (enrolledCourseIds.length === 0) {
                setCourses([]);
                return;
            }

            // 2. Fetch course details (Firestore "in" queries accept up to 30 items)
            const batchSize = 10;
            const allCourses: any[] = [];

            for (let i = 0; i < enrolledCourseIds.length; i += batchSize) {
                const batch = enrolledCourseIds.slice(i, i + batchSize);
                const coursesSnap = await getDocs(
                    query(collection(db, "courses"), where(documentId(), "in", batch))
                );
                coursesSnap.forEach((docSnap) => {
                    allCourses.push({
                        id: docSnap.id,
                        ...docSnap.data(),
                        progress: courseProgress[docSnap.id] || 0,
                    });
                });
            }

            setCourses(allCourses);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to load your courses");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">My Learning Path</h1>
                    <p className="text-[#94a3b8] text-sm mt-1">
                        {courses.length > 0
                            ? `${courses.length} course${courses.length !== 1 ? "s" : ""} enrolled`
                            : "Start your learning journey"}
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-[#00e5ff] text-black font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Courses</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
                    <AlertTriangle size={24} />
                    <div>
                        <div className="font-bold">Failed to load courses</div>
                        <div className="text-sm opacity-70 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={fetchMyCourses}
                        className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <Card className="!p-10 bg-white/[0.03] border-white/10 col-span-full text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#475569]">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">No Courses Yet</h3>
                        <p className="text-[#94a3b8] mb-6">You haven&apos;t enrolled in any courses yet. Explore our catalog to get started.</p>
                        <button
                            onClick={openAddModal}
                            className="px-6 py-2 bg-[#00e5ff] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                        >
                            Explore Courses
                        </button>
                    </Card>
                ) : (
                    courses.map((course) => (
                        <Card
                            key={course.id}
                            className="!p-0 overflow-hidden bg-white/[0.03] border-white/10 hover:border-[#00e5ff]/30 transition-all group"
                        >
                            {/* Thumbnail */}
                            <div className="w-full h-44 bg-white/5 overflow-hidden relative">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">📈</div>
                                )}
                                {/* Progress overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                    <div
                                        className="h-full bg-[#00e5ff] transition-all duration-700"
                                        style={{ width: `${course.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${course.difficulty === "Expert"
                                        ? "text-red-400 bg-red-400/10"
                                        : course.difficulty === "Advanced"
                                            ? "text-amber-400 bg-amber-400/10"
                                            : course.difficulty === "Intermediate"
                                                ? "text-blue-400 bg-blue-400/10"
                                                : "text-green-400 bg-green-400/10"
                                        }`}>
                                        {course.difficulty || "Beginner"}
                                    </span>
                                    {course.duration && (
                                        <span className="text-[9px] text-[#475569] font-bold flex items-center gap-1">
                                            <Clock size={10} />
                                            {course.duration}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-white mb-1 leading-snug">{course.title}</h3>
                                <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest mb-3">{course.category}</p>
                                <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">{course.description}</p>

                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] text-[#475569] font-bold mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#00e5ff] h-full transition-all duration-700"
                                            style={{ width: `${course.progress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <a href={`/course-player/${course.id}`}>
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/20 text-[#00e5ff] text-sm font-bold transition-all group-hover:border-[#00e5ff]/40">
                                        <Play size={14} />
                                        {(course.progress || 0) > 0 ? "Resume" : "Start Learning"}
                                    </button>
                                </a>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Courses Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#020617] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Courses</h2>
                                <p className="text-sm text-[#94a3b8] mt-1">Select multiple courses to enroll simultaneously</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="p-4 border-b border-white/5 flex gap-4 shrink-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Course List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {enrollStatus.message && (
                                <div className={`p-4 mb-6 rounded-xl border ${enrollStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {enrollStatus.message}
                                </div>
                            )}

                            {allCatalogCourses.length === 0 ? (
                                <div className="flex justify-center py-10"><Loader /></div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {allCatalogCourses
                                        .filter(c => !courses.find(myCourse => myCourse.id === c.id)) // Filter enrolled
                                        .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map(course => {
                                            const isSelected = selectedCourseIds.includes(course.id);
                                            return (
                                                <div
                                                    key={course.id}
                                                    onClick={() => setSelectedCourseIds(prev => isSelected ? prev.filter(id => id !== course.id) : [...prev, course.id])}
                                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all flex gap-4 ${isSelected ? 'bg-[#00e5ff]/10 border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}`}
                                                >
                                                    <div className="w-20 h-20 bg-black/50 rounded-lg overflow-hidden shrink-0">
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-2xl bg-white/5">📚</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-white text-sm truncate">{course.title}</h4>
                                                        <p className="text-[10px] text-[#475569] font-bold uppercase mt-1">{course.category || "General"}</p>
                                                        <p className="text-xs text-[#94a3b8] mt-2 line-clamp-2">{course.description}</p>
                                                    </div>
                                                    <div className="flex items-center justify-center shrink-0">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#00e5ff] bg-[#00e5ff]' : 'border-white/20'}`}>
                                                            {isSelected && <Check size={14} className="text-black" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    {allCatalogCourses.filter(c => !courses.find(myCourse => myCourse.id === c.id)).length === 0 && (
                                        <div className="col-span-full py-10 text-center text-[#94a3b8]">
                                            You are enrolled in all available courses!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.02] shrink-0">
                            <div className="text-sm text-[#94a3b8]">
                                {selectedCourseIds.length} course(s) selected
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-colors border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEnrollSelected}
                                    disabled={selectedCourseIds.length === 0 || enrollLoading || enrollStatus.type === 'success'}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest text-black transition-all ${selectedCourseIds.length === 0 || enrollLoading || enrollStatus.type === 'success'
                                            ? 'bg-[#00e5ff]/50 cursor-not-allowed'
                                            : 'bg-[#00e5ff] hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                                        }`}
                                >
                                    {enrollLoading ? "Enrolling..." : 'Enroll Selected'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
