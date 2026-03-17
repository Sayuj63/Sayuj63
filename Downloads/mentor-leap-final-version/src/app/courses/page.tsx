"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal, FadeIn } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import Link from "next/link";
import { Search, Filter, BookOpen, Clock, BarChart, ChevronRight } from "lucide-react";

export default function CoursesListingPage() {
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
        <PageWrapper>
            {/* HER0 SECTION */}
            <section className="relative pt-[120px] pb-[80px] px-5 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[#00e5ff05] blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <Reveal>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00e5ff] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                            Academic Excellence
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <SectionHeading className="mb-6">
                            Unlock Your <GradientText>Professional Potential</GradientText>
                        </SectionHeading>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <Paragraph className="max-w-[700px] mx-auto text-lg text-[#94a3b8]">
                            Explore our comprehensive library of elite communication, leadership, and personal branding programs designed for the modern executive.
                        </Paragraph>
                    </Reveal>

                    {/* Search & Filter Bar */}
                    <Reveal delay={0.3}>
                        <div className="mt-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-xl">
                            <div className="flex-1 relative flex items-center">
                                <Search className="absolute left-6 text-[#475569]" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by module or technique..."
                                    className="w-full bg-transparent py-4 pl-14 pr-6 text-white focus:outline-none placeholder:text-[#475569] font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center px-4 md:border-l border-white/10">
                                <Filter className="text-[#475569] mr-3" size={18} />
                                <select
                                    className="bg-transparent text-[#cbd5f5] text-sm font-bold focus:outline-none cursor-pointer py-4"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-[#020617]">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* COURSE GRID */}
            <section className="px-5 pb-[140px] max-w-[1200px] mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-40">
                        <Loader />
                        <p className="mt-6 text-[#475569] text-xs font-black uppercase tracking-widest animate-pulse">Syncing Library...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-40 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-[#94a3b8] italic">No courses found matching your criteria.</p>
                        <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>Reset Filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, i) => (
                            <Reveal key={course.id} delay={0.05 * (i % 6)}>
                                <Link href={`/courses/${course.id}`}>
                                    <Card className="group !p-0 overflow-hidden h-full flex flex-col border-white/5 hover:border-[#00e5ff]/30 transition-all duration-500 bg-white/[0.02]">
                                        {/* Thumbnail Space */}
                                        <div className="aspect-video relative overflow-hidden bg-[#0f172a]">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?w=800&q=80"}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#00e5ff] text-[#020617] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                                    {course.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70">
                                                {course.category}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00e5ff] transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <Paragraph className="text-sm line-clamp-2 mb-6 opacity-60">
                                                {course.description}
                                            </Paragraph>

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
            </section>
        </PageWrapper>
    );
}
