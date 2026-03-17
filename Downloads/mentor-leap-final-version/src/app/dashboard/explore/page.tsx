"use client";
import React, { useState, useEffect } from "react";
import { Reveal } from "@/components/ui/Animation";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import Link from "next/link";
import { Search, Filter, BookOpen, Clock, ChevronRight } from "lucide-react";

export default function ExploreCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                const data = await res.json();
                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 p-6 md:p-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Explore Courses</h1>
                    <p className="text-[#94a3b8] text-sm mt-1">Discover new skills and accelerate your career</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1 sm:w-48">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]" size={18} />
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors appearance-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-[#020617]">{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="flex justify-center p-20"><Loader /></div>
            ) : filteredCourses.length === 0 ? (
                <Card className="!p-10 text-center bg-white/[0.02] border-white/5">
                    <p className="text-[#94a3b8]">No courses found matching your search.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course, i) => (
                        <Reveal key={course.id} delay={0.05 * (i % 10)}>
                            <Link href={`/courses/${course.id}`}>
                                <Card className="group !p-0 overflow-hidden h-full flex flex-col border-white/5 hover:border-[#00e5ff]/30 transition-all duration-500 bg-white/[0.02]">
                                    {/* Thumbnail */}
                                    <div className="aspect-video relative overflow-hidden bg-[#0f172a]">
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?w=800&q=80"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#00e5ff] text-[#020617] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                                {course.difficulty || "Beginner"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70">
                                            {course.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00e5ff] transition-colors line-clamp-2 leading-snug">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-[#94a3b8] line-clamp-2 mb-6 opacity-80">
                                            {course.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-[10px] text-[#94a3b8] font-black uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-[#00e5ff]" />
                                                    {course.duration || "4h 30m"}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <BookOpen size={12} className="text-[#00e5ff]" />
                                                    {course.modules?.length || 8} Modules
                                                </span>
                                            </div>
                                            <div className="text-[#00e5ff] font-bold">
                                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
}
