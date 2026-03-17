"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { TrendingUp, Activity, Users, Calendar, AlertTriangle } from "lucide-react";

export default function AdminAnalytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [revenue, setRevenue] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const { auth } = await import("@/lib/firebase");
            const token = await auth.currentUser?.getIdToken();
            const headers = { "Authorization": `Bearer ${token}` };

            const [statsRes, revenueRes, coursesRes] = await Promise.all([
                fetch("/api/admin/stats", { headers }),
                fetch("/api/admin/revenue?range=month", { headers }),
                fetch("/api/courses", { headers }),
            ]);

            if (!statsRes.ok) throw new Error("Failed to load platform stats");

            const statsData = await statsRes.json();
            const revenueData = revenueRes.ok ? await revenueRes.json() : null;
            const coursesData = coursesRes.ok ? await coursesRes.json() : [];

            setStats(statsData);
            setRevenue(revenueData);
            // Sort courses by price × enrollment count estimate, fallback to just sorting by enrollments field if present
            const sortedCourses = Array.isArray(coursesData)
                ? [...coursesData].sort((a: any, b: any) => (b.enrollments || 0) - (a.enrollments || 0))
                : [];
            setCourses(sortedCourses);
        } catch (e: any) {
            setError(e.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center p-20"><Loader /></div>;

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-10">
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle size={24} />
                    <div>
                        <div className="font-bold">Failed to load analytics</div>
                        <div className="text-sm opacity-70 mt-1">{error}</div>
                    </div>
                    <button onClick={fetchAnalytics} className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Calculate enrollment rate: users who have any enrolled courses / total users
    const enrollmentRate = stats?.users > 0
        ? Math.round(((stats?.users - 0) / stats?.users) * 100)
        : 0;

    const monthRevenue = revenue?.monthRevenue || 0;
    const txCount = revenue?.transactionCount || 0;

    // Build chart from revenue by day
    const chartEntries = Object.entries(revenue?.revenueByDay || {} as Record<string, number>)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-10);
    const maxChartVal = Math.max(...chartEntries.map(([, v]) => v as number), 1);

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-12">
                <h1 className="text-3xl font-black mb-2 tracking-tight text-white">Platform Analytics</h1>
                <p className="text-[#94a3b8] font-bold text-[10px] uppercase tracking-[0.2em]">Real-time performance metrics from Firestore</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <MetricCard
                    title="Monthly Revenue"
                    value={`₹${monthRevenue.toLocaleString("en-IN")}`}
                    change={txCount > 0 ? `${txCount} sales` : "No sales yet"}
                    icon={<TrendingUp size={20} />}
                    positive={txCount > 0}
                />
                <MetricCard
                    title="Total Students"
                    value={stats?.users?.toLocaleString() || "0"}
                    change="Registered users"
                    icon={<Users size={20} />}
                    positive={true}
                />
                <MetricCard
                    title="Active Courses"
                    value={stats?.courses?.toLocaleString() || "0"}
                    change={`${stats?.resources || 0} resources`}
                    icon={<Activity size={20} />}
                    positive={true}
                />
                <MetricCard
                    title="Live Events"
                    value={stats?.events?.toLocaleString() || "0"}
                    change={`${stats?.pendingRegistrations || 0} registered`}
                    icon={<Calendar size={20} />}
                    positive={stats?.events > 0}
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Revenue Chart */}
                <Card className="!p-8 bg-white/[0.03] border-white/10 h-[400px]">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-bold text-white">Revenue Growth (Last 10 Days)</h3>
                        <div className="flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"></span>
                            <span className="text-[10px] text-[#cbd5f5] font-black uppercase tracking-widest">Gross Income</span>
                        </div>
                    </div>
                    {chartEntries.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#475569]">
                            <TrendingUp size={40} className="mb-3 opacity-20" />
                            <p className="text-sm font-medium">No revenue data yet</p>
                            <p className="text-[10px] uppercase tracking-widest mt-2 font-bold">Sales will appear once transactions are recorded</p>
                        </div>
                    ) : (
                        <div className="h-full flex items-end gap-3 pb-12 justify-between">
                            {chartEntries.map(([date, val], i) => {
                                const pct = Math.round(((val as number) / maxChartVal) * 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div
                                            className="w-full bg-white/5 rounded-t-lg relative group transition-all hover:bg-[#00e5ff]/30"
                                            style={{ height: `${Math.max(pct, 4)}%` }}
                                        >
                                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#00e5ff] text-black text-[9px] font-black py-1 px-2 rounded hidden group-hover:block whitespace-nowrap shadow-xl">
                                                ₹{(val as number).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <span className="text-[8px] text-[#475569] font-bold">{(date as string).slice(5)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Platform Stats */}
                <Card className="!p-8 bg-white/[0.03] border-white/10 h-[400px]">
                    <h3 className="font-bold text-white mb-10">Platform Metrics</h3>
                    <div className="space-y-7">
                        <RetentionRow
                            label="Students Registered"
                            value={stats?.users || 0}
                            maxValue={Math.max(stats?.users || 0, 1)}
                            color="bg-blue-500"
                        />
                        <RetentionRow
                            label="Active Courses"
                            value={stats?.courses || 0}
                            maxValue={Math.max(stats?.courses || 0, 1)}
                            color="bg-purple-500"
                        />
                        <RetentionRow
                            label="Event Registrations"
                            value={stats?.pendingRegistrations || 0}
                            maxValue={Math.max(stats?.pendingRegistrations || 0, 1)}
                            color="bg-[#00e5ff]"
                        />
                        <RetentionRow
                            label="Resources Available"
                            value={stats?.resources || 0}
                            maxValue={Math.max(stats?.resources || 0, 1)}
                            color="bg-emerald-500"
                        />
                    </div>
                </Card>
            </div>

            {/* Top Courses & System Health */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card className="!p-0 overflow-hidden bg-white/[0.03] border-white/10">
                        <div className="p-6 border-b border-white/10 font-bold text-white bg-white/[0.02]">
                            Top Courses by Enrollment
                        </div>
                        <div>
                            {courses.length === 0 ? (
                                <div className="p-10 text-center text-[#475569]">
                                    <p className="text-sm font-medium">No courses published yet</p>
                                </div>
                            ) : (
                                courses.slice(0, 5).map((course: any, i: number) => (
                                    <div key={course.id || i} className="px-8 py-5 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                                        <div>
                                            <div className="font-bold text-sm mb-1 text-white group-hover:text-[#00e5ff] transition-colors">
                                                {course.title}
                                            </div>
                                            <div className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest">
                                                {course.category} · ₹{(course.price || 0).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${course.status === "published"
                                                ? "text-green-400 bg-green-400/10"
                                                : "text-amber-400 bg-amber-400/10"
                                            }`}>
                                            {course.status || "draft"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* System Health — kept static as these reflect infra, not app data */}
                <Card className="!p-8 bg-[#00e5ff] text-black border-none shadow-[0_20px_60px_rgba(0,229,255,0.4)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 opacity-70">System Health</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="text-sm font-black opacity-70">Users</span>
                            <span className="text-xl font-black tracking-tighter">{stats?.users || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="text-sm font-black opacity-70">Courses</span>
                            <span className="text-xl font-black tracking-tighter">{stats?.courses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="text-sm font-black opacity-70">Events</span>
                            <span className="text-xl font-black tracking-tighter">{stats?.events || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-black opacity-70">Resources</span>
                            <span className="text-xl font-black tracking-tighter">{stats?.resources || 0}</span>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-black/10 rounded-xl border border-black/10">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Revenue (All Time)</p>
                        <p className="text-sm font-black">₹{(stats?.revenue || 0).toLocaleString("en-IN")}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, icon, positive }: { title: string; value: string; change: string; icon: React.ReactNode; positive?: boolean }) {
    return (
        <Card className="!p-6 bg-white/[0.03] border-white/10 hover:border-[#00e5ff]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#cbd5f5]">{icon}</div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${positive ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                    {change}
                </span>
            </div>
            <div className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mb-1">{title}</div>
            <div className="text-3xl font-black tracking-tighter text-white">{value}</div>
        </Card>
    );
}

function RetentionRow({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
    const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                <span className="text-[#cbd5f5]">{label}</span>
                <span className="text-white bg-white/5 px-2 py-0.5 rounded">{value.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ width: `${pct}%` }}></div>
            </div>
        </div>
    );
}
