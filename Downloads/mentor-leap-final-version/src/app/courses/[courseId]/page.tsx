"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal, FadeIn } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import {
  PlayCircle,
  FileText,
  Award,
  ChevronRight,
  Star,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  BarChart
} from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;
  if (!course) return <div className="h-screen flex items-center justify-center bg-[#020617] text-white">Course not found</div>;

  return (
    <PageWrapper>
      {/* HERO SECTION */}
      <section className="relative px-5 pt-[160px] pb-[100px] overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-[#00e5ff0d] to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#00e5ff]/10 text-[#00e5ff] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#00e5ff]/20">
                {course.category}
              </span>
              <div className="flex gap-0.5 text-[#facc15]">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
              {course.title.split(":")[0]} <br />
              <GradientText>{course.title.split(":")[1] || "Masterclass"}</GradientText>
            </h1>
            <Paragraph className="text-lg text-[#94a3b8] mb-10 max-w-[550px]">
              {course.description}
            </Paragraph>

            <div className="flex flex-wrap gap-8 items-center text-[#cbd5f5]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock size={16} className="text-[#00e5ff]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[#475569] tracking-widest">Duration</p>
                  <p className="text-sm font-bold">{course.duration || "12.5 Hours"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <BarChart size={16} className="text-[#00e5ff]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[#475569] tracking-widest">Level</p>
                  <p className="text-sm font-bold">{course.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Globe size={16} className="text-[#00e5ff]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[#475569] tracking-widest">Language</p>
                  <p className="text-sm font-bold">English / Hindi</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] group">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?w=1000&q=80"}
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                alt="Course Preview"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-[#00e5ff] text-[#020617] flex items-center justify-center shadow-[0_0_30px_#00e5ff] hover:scale-110 transition-transform">
                  <PlayCircle size={32} />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 items-center justify-between hidden md:flex">
                <p className="text-xs font-bold text-white">Watch Course Trailer</p>
                <span className="text-[10px] font-black text-[#00e5ff] uppercase">2:45 min</span>
              </div>
            </div>
            {/* Decorative Glow */}
            <div className="absolute -z-10 -bottom-20 -right-20 w-[400px] h-[400px] bg-[#6366f115] blur-3xl rounded-full"></div>
          </Reveal>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="px-5 pb-[160px] max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-16">
          {/* LEARNING POINTS */}
          <Reveal>
            <Card className="!bg-white/[0.02] border-white/10">
              <h3 className="text-2xl font-black mb-8">What you&apos;ll <GradientText>Master</GradientText></h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  "Advanced strategic communication frameworks",
                  "Executive presence and body language mastery",
                  "Crisis management and boardroom psychology",
                  "Personal brand architecture and scaling",
                  "High-stakes negotiation and persuasion",
                  "Vocal branding and tonality control"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 size={18} className="text-[#00e5ff]" />
                    </div>
                    <p className="text-[#cbd5f5] text-sm font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* CURRICULUM */}
          <Reveal>
            <h3 className="text-2xl font-black mb-8 tracking-tight">Structured <GradientText>Curriculum</GradientText></h3>
            <div className="space-y-4">
              {course.modules?.length > 0 ? (
                course.modules.map((mod: any, i: number) => (
                  <Card key={i} className="group hover:bg-white/[0.05] border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[#64748b]">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-[#00e5ff] transition-colors">{mod.title}</h4>
                          <p className="text-[10px] text-[#475569] font-black uppercase tracking-widest mt-0.5">{mod.lessons?.length || 5} Lessons • {mod.duration || '45m'}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[#475569] group-hover:text-[#00e5ff] transition-all" />
                    </div>
                  </Card>
                ))
              ) : (
                ['Foundational Strategic Frameworks', 'The Psychology of Influence', 'Dynamic Narrative Architecture', 'High-Impact Delivery Synchronicity', 'Real-world Integration Case Studies'].map((title, i) => (
                  <Card key={i} className="!p-6 !rounded-2xl group hover:bg-white/[0.05] border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[#64748b]">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-[#00e5ff] transition-colors">{title}</h4>
                          <p className="text-[10px] text-[#475569] font-black uppercase tracking-widest mt-0.5">6 Lessons • 52m</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[#475569] group-hover:text-[#00e5ff] transition-all" />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Reveal>

          {/* INSTRUCTOR */}
          <Reveal>
            <h3 className="text-2xl font-black mb-8 tracking-tight">Your <GradientText>Mentor</GradientText></h3>
            <Card className="!p-8 bg-white/[0.02] border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff05] blur-3xl -mr-32 -mt-32 rounded-full"></div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-[#00e5ff]/20 shadow-[0_10px_30px_rgba(0,229,255,0.1)]">
                  <img
                    src="/mridu-bhandari-profile.jpg"
                    onError={(e: any) => e.target.src = "https://ui-avatars.com/api/?name=" + (course.instructor || "Mridu+Bhandari") + "&background=00e5ff&color=020617&size=200"}
                    className="w-full h-full object-cover"
                    alt={course.instructor}
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h4 className="text-2xl font-black text-white">{course.instructor || "Mridu Bhandari"}</h4>
                    <ShieldCheck size={18} className="text-[#00e5ff]" />
                  </div>
                  <p className="text-[#00e5ff] text-[10px] font-black uppercase tracking-widest mb-4">Founder, MentorLeap</p>
                  <Paragraph className="text-sm opacity-70 mb-6">
                    With over 20+ years of experience in high-stakes communication, {(course.instructor || "Mridu").split(' ')[0]} has mentored 500+ professionals across Google, Amazon, and Fortune 500 companies.
                  </Paragraph>
                  <div className="flex gap-6 justify-center md:justify-start">
                    <div className="text-center">
                      <p className="text-lg font-black text-white">4.9/5</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-white">25k+</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-white">12</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>

        {/* SIDEBAR STICKY CARD */}
        <div className="relative">
          <Reveal delay={0.4} className="sticky top-32">
            <Card className="!p-8 bg-[#020617] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Accent Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e5ff] to-[#6366f1]"></div>

              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#475569] mb-4">Full Access License</h4>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-white">₹{course.price?.toLocaleString()}</span>
                <span className="text-[#475569] line-through text-sm">₹{Math.floor(course.price * 1.5).toLocaleString()}</span>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <PlayCircle size={16} />, text: "Lifetime Access to UHD Content" },
                  { icon: <FileText size={16} />, text: "12+ Strategic Resource Documents" },
                  { icon: <Award size={16} />, text: "Verified Achievement Certificate" },
                  { icon: <BarChart size={16} />, text: "Progress Dashboard & Analytics" },
                  { icon: <ShieldCheck size={16} />, text: "Private Alumni Community Access" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center text-sm text-[#cbd5f5] font-medium">
                    <span className="text-[#00e5ff]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {(!course.price || course.price === 0) ? (
                <Button
                  fullWidth size="lg"
                  className="h-14 font-black uppercase tracking-[0.2em] shadow-[0_10px_25px_#00e5ff30]"
                  onClick={async () => {
                    try {
                      const { auth } = await import('@/lib/firebase');
                      const token = await auth.currentUser?.getIdToken();
                      if (!token) {
                        alert("Please log in to enroll.");
                        return window.location.href = `/auth/login?redirect=/courses/${course.id}`;
                      }

                      const res = await fetch('/api/enroll/free', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ courseId: course.id })
                      });
                      if (res.ok) {
                        window.location.href = `/course-player/${course.id}`;
                      } else {
                        const error = await res.json();
                        alert(error.error || "Failed to enroll");
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Enroll for Free
                </Button>
              ) : (
                <Button fullWidth size="lg" disabled className="h-14 font-black uppercase tracking-[0.2em] bg-white/10 text-white/50 border-none">
                  Enroll (Paid - Coming Soon)
                </Button>
              )}

              <p className="text-[9px] text-center text-[#475569] font-black uppercase tracking-widest mt-6">
                🔒 Secure 256-bit SSL Enrollment
              </p>
            </Card>

            <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h5 className="font-black text-xs uppercase tracking-widest text-[#cbd5f5] mb-4">Corporate Support</h5>
              <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">Training 5 or more people? Get custom pricing for your organization.</p>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff] hover:underline">Contact Enterprise</button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
