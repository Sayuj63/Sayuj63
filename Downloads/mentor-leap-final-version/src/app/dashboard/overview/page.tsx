"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Animation";
import { Loader } from "@/components/ui/Loader";
import { AlertTriangle, BookOpen, Calendar, Award } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/dashboard/stats", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load stats");
      }
      setStats(await res.json());
    } catch (e: any) {
      setError(e.message || "Unable to load your dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center p-20"><Loader /></div>;

  if (error) {
    return (
      <div className="p-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle size={24} />
          <div>
            <div className="font-bold">Couldn&apos;t load your dashboard</div>
            <div className="text-sm opacity-70 mt-1">{error}</div>
          </div>
          <button
            onClick={fetchStats}
            className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <Reveal>
        <h1 className="text-3xl font-bold mb-2">Welcome Back, {stats?.name || "Student"}!</h1>
        <p className="text-[#94a3b8] mb-10">Here&apos;s an overview of your progress and upcoming activities.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="!p-6 text-center group hover:border-[#00e5ff]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#00e5ff]/20 transition-all">
              <BookOpen size={22} />
            </div>
            <div className="text-4xl font-bold text-[#00e5ff] mb-2">{stats?.activeCourses || 0}</div>
            <div className="text-[#cbd5f5] text-sm">Active Courses</div>
          </Card>
          <Card className="!p-6 text-center group hover:border-[#6366f1]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#6366f1]/20 transition-all">
              <Calendar size={22} />
            </div>
            <div className="text-4xl font-bold text-[#6366f1] mb-2">{stats?.upcomingEvents || 0}</div>
            <div className="text-[#cbd5f5] text-sm">Upcoming Events</div>
          </Card>
          <Card className="!p-6 text-center group hover:border-green-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-all">
              <Award size={22} />
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">{stats?.certificates || 0}</div>
            <div className="text-[#cbd5f5] text-sm">Certificates Earned</div>
          </Card>
        </div>

        {stats?.continueLearning ? (
          <>
            <h2 className="text-xl font-bold mb-6">Continue Learning</h2>
            <Card className="flex gap-6 items-center flex-wrap">
              <div className="w-32 h-20 bg-white/10 rounded-lg flex items-center justify-center text-2xl overflow-hidden border border-white/5">
                {stats.continueLearning.thumbnail ? (
                  <img
                    src={stats.continueLearning.thumbnail}
                    alt={stats.continueLearning.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">📈</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{stats.continueLearning.title}</h3>
                <div className="mt-2 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00e5ff] h-full transition-all duration-700"
                    style={{ width: `${stats.continueLearning.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-[#94a3b8] mt-2">{stats.continueLearning.progress || 0}% Complete</p>
              </div>
              <a href={`/course-player/${stats.continueLearning.id}`}>
                <button className="px-5 py-2 rounded-full bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/20 transition-colors text-sm font-medium text-[#00e5ff]">
                  Resume
                </button>
              </a>
            </Card>
          </>
        ) : (stats?.activeCourses || 0) === 0 ? (
          <Card className="!p-10 text-center bg-white/[0.02] border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#475569]">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Start Learning Today</h3>
            <p className="text-[#94a3b8] text-sm mb-6">You haven&apos;t enrolled in any courses yet. Explore our curriculum to begin your journey.</p>
            <Link href="/resources/courses/public-speaking">
              <button className="px-8 py-3 bg-[#00e5ff] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors">
                Explore Courses
              </button>
            </Link>
          </Card>
        ) : null}
      </Reveal>
    </div>
  );
}
