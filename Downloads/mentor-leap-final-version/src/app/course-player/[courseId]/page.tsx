"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/Loader";
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Lock,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const { user, loading, userData } = useAuth();
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Course not found");
      return res.json();
    }
  });

  // Set initial lesson
  useEffect(() => {
    if (course?.modules?.[0]?.lessons?.[0] && !activeLessonId) {
      setActiveLessonId(course.modules[0].lessons[0].id);
    }
  }, [course]);

  if (loading || isLoading) return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;
  if (!course) return <div className="h-screen flex items-center justify-center bg-[#020617]"><div className="text-white text-xl">Course not found</div></div>;

  // Access Control: Redirection if not enrolled or admin
  if (userData && userData.role !== 'admin' && !userData.enrolledCourses?.includes(courseId as string)) {
    router.push(`/courses/${courseId}`);
    return <div className="h-screen flex items-center justify-center bg-[#020617]"><Loader /></div>;
  }

  const currentLesson = course.modules?.flatMap((m: any) => m.lessons).find((l: any) => l.id === activeLessonId);

  return (
    <div className="h-screen flex bg-[#020617] text-white overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-3 bg-[#00e5ff] rounded-full text-black lg:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative z-40 w-[320px] h-full border-r border-white/5 flex flex-col bg-[#04091a] transition-transform duration-300
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link href="/dashboard/courses" className="flex items-center gap-2 text-[10px] text-[#00e5ff] uppercase font-bold tracking-widest mb-3 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft size={12} /> My Dashboard
            </Link>
            <h2 className="text-lg font-bold leading-tight">{course.title}</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#475569] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          {course.modules?.map((module: any, mIdx: number) => (
            <div key={module.id} className="space-y-3">
              <h3 className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]/40"></span>
                Module {mIdx + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons?.map((lesson: any) => {
                  const isActive = activeLessonId === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-3 ${isActive
                        ? 'bg-[#00e5ff]/10 border border-[#00e5ff]/20 shadow-[0_0_20px_rgba(0,229,255,0.05)]'
                        : 'hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#00e5ff]/20 text-[#00e5ff]' : 'bg-white/5 text-[#475569]'
                        }`}>
                        {isActive ? <Play size={10} fill="currentColor" /> : <div className="w-1 h-1 bg-current rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold mb-0.5 ${isActive ? 'text-[#00e5ff]' : 'text-[#cbd5f5] group-hover:text-white'}`}>
                          {lesson.title}
                        </h4>
                        <span className="text-[10px] text-[#475569] font-medium">{lesson.duration}m</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[#475569] uppercase">Course Progress</span>
            <span className="text-xs font-bold text-[#00e5ff]">25%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00e5ff] to-[#6366f1] w-[25%]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#020617] p-4 lg:p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* VIDEO BOX */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#00e5ff20] to-[#6366f120] rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative aspect-video bg-black rounded-[2rem] border border-white/5 shadow-3xl overflow-hidden flex items-center justify-center">
              {currentLesson?.videoUrl ? (
                <video
                  key={currentLesson.id}
                  src={currentLesson.videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Play size={32} className="text-[#00e5ff]" fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Video Not Available</h2>
                  <p className="text-[#475569] text-sm">This lesson is currently being processed by the system.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 border-b border-white/5 pb-10">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">{currentLesson?.title || "Welcome"}</h1>
              <p className="text-[#475569] font-medium flex items-center gap-2">
                <span className="text-[#00e5ff]">Mridu Bhandari</span>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <span>Module Content</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-[#cbd5f5] hover:bg-white/10 transition-all">
                <FileText size={18} /> Notes
              </button>
              <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#00e5ff] text-black text-sm font-black shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-95 transition-all">
                Mark as Completed <CheckCircle2 size={18} />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-12 text-[#94a3b8] leading-relaxed">
            <div className="space-y-6">
              <p>
                In this masterclass session, we dive deep into the specific communication frameworks that define world-class leaders.
                Success isn't just about what you say, but how you position your ideas within the social architecture of your team.
              </p>
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Lesson Assignment</h4>
                  <p className="text-sm">Download the attached PDF below. Complete the 'Authority Exercise' on page 4 before moving to the next module.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 flex justify-between items-center text-[#475569]">
            <button className="flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">
              <ChevronLeft size={16} /> Previous Lesson
            </button>
            <button className="flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">
              Next Lesson <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
