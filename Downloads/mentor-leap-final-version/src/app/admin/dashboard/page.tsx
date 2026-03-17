"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { AdminAPI } from "@/lib/admin-api";
import { Shield, Users, BookOpen, Wallet, Calendar } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center p-20"><Loader /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[#00e5ff]/10 rounded-2xl flex items-center justify-center text-[#00e5ff]">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-[#94a3b8] text-sm">System integrity and platform operations.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card className="!p-6 border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center"><Users size={20} /></div>
            <span className="text-[10px] font-bold text-green-400">+12%</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Total Student Base</div>
          <div className="text-3xl font-black mt-1">{stats?.users || 0}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center"><BookOpen size={20} /></div>
            <span className="text-[10px] font-bold text-[#475569]">0% Change</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Active Curriculum</div>
          <div className="text-3xl font-black mt-1">{stats?.courses || 0}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Wallet size={20} /></div>
            <span className="text-[10px] font-bold text-green-400">↑ High</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Gross Revenue</div>
          <div className="text-3xl font-black mt-1">₹{stats?.revenue?.toLocaleString() || 0}</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center"><Calendar size={20} /></div>
            <span className="text-[10px] font-bold text-orange-400">{stats?.events} Current</span>
          </div>
          <div className="text-sm text-[#94a3b8] font-medium tracking-tight">Pending Registrations</div>
          <div className="text-3xl font-black mt-1">45</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 !p-0 overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">System Audit Logs</h3>
            <button className="text-[10px] font-bold uppercase text-[#00e5ff] tracking-widest hover:underline">View All Logs</button>
          </div>
          <div className="p-10 flex flex-col items-center justify-center text-center text-[#475569]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4"><Shield size={32} /></div>
            <p className="text-sm font-medium">Platform Activity is Normal.</p>
            <p className="text-[10px] uppercase font-bold tracking-widest mt-2">All backend services operational</p>
          </div>
        </Card>

        <Card className="!p-8">
          <h3 className="font-bold mb-6">Quick Links</h3>
          <div className="space-y-4">
            {['Broadcast Message', 'Export User DB', 'Clear System Cache', 'Generate Yearly Report'].map(link => (
              <button key={link} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-[#cbd5f5] font-bold hover:border-[#00e5ff]/30 transition-all">
                {link}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
