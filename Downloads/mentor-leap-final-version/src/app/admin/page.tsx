"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { AdminAPI } from "@/lib/admin-api";
import { Shield, Users, BookOpen, Wallet, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminOverview() {
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
      const res = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load stats");
      }
      const data = await res.json();
      setStats(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load dashboard stats");
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
            <div className="font-bold">Failed to load admin stats</div>
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

  const revenueFormatted = stats?.revenue
    ? `₹${stats.revenue.toLocaleString("en-IN")}`
    : "₹0";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[#00e5ff]/10 rounded-2xl flex items-center justify-center text-[#00e5ff]">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-[#94a3b8] text-sm">Real-time platform operations & metrics.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-[#00e5ff]/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-0.5 rounded">Live</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Total Student Base</div>
          <div className="text-3xl font-black mt-1">{(stats?.users || 0).toLocaleString()}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-purple-500/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Active Curriculum</div>
          <div className="text-3xl font-black mt-1">{(stats?.courses || 0).toLocaleString()}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <TrendingUp size={10} className="inline mr-0.5" />
              Live
            </span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Gross Revenue</div>
          <div className="text-3xl font-black mt-1 text-emerald-400">{revenueFormatted}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-orange-500/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
              {stats?.events || 0} Events
            </span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Total Registrations</div>
          <div className="text-3xl font-black mt-1">{(stats?.pendingRegistrations || 0).toLocaleString()}</div>
        </Card>
      </div>

      {/* Secondary Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 !p-0 overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">System Audit Logs</h3>
            <a href="/admin/analytics" className="text-[10px] font-bold uppercase text-[#00e5ff] tracking-widest hover:underline">View Analytics</a>
          </div>
          <div className="p-10 flex flex-col items-center justify-center text-center text-[#475569]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Shield size={32} />
            </div>
            <p className="text-sm font-medium">Platform Activity is Normal.</p>
            <p className="text-[10px] uppercase font-bold tracking-widest mt-2">All backend services operational</p>

            {/* Real-time stats summary */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-sm">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-black text-white">{stats?.resources || 0}</div>
                <div className="text-[9px] text-[#475569] uppercase tracking-widest font-bold mt-0.5">Resources</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-black text-white">{stats?.events || 0}</div>
                <div className="text-[9px] text-[#475569] uppercase tracking-widest font-bold mt-0.5">Events</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-black text-white">{stats?.pendingRegistrations || 0}</div>
                <div className="text-[9px] text-[#475569] uppercase tracking-widest font-bold mt-0.5">Registered</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="!p-8">
          <h3 className="font-bold mb-6">Quick Links</h3>
          <div className="space-y-4">
            {[
              { label: 'Manage Users', href: '/admin/users' },
              { label: 'Revenue Reports', href: '/admin/revenue' },
              { label: 'Platform Analytics', href: '/admin/analytics' },
              { label: 'Manage Events', href: '/admin/events' },
            ].map(link => (
              <a key={link.label} href={link.href} className="block w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-[#cbd5f5] font-bold hover:border-[#00e5ff]/30 hover:bg-white/[0.08] transition-all">
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
