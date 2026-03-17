"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Wallet, TrendingUp, BarChart2, Calendar, AlertTriangle, RefreshCw } from "lucide-react";

type DateRange = "day" | "month" | "year" | "all";

const RANGE_LABELS: Record<DateRange, string> = {
  day: "Today",
  month: "This Month",
  year: "This Year",
  all: "All Time",
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function AdminRevenue() {
  const [range, setRange] = useState<DateRange>("all");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(async (selectedRange: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/revenue?range=${selectedRange}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load revenue data");
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e.message || "Failed to load revenue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue(range);
  }, [range, fetchRevenue]);

  // Build chart data from revenueByDay
  const chartData = React.useMemo(() => {
    if (!data?.revenueByDay) return [];
    const entries = Object.entries(data.revenueByDay as Record<string, number>)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-15); // Last 15 days
    if (entries.length === 0) return [];
    const maxVal = Math.max(...entries.map(([, v]) => v as number), 1);
    return entries.map(([date, val]) => ({
      date,
      value: val as number,
      pct: Math.round(((val as number) / maxVal) * 100),
    }));
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Revenue Reports</h1>
          <p className="text-[#94a3b8] text-sm">Real-time financial metrics from all platform sales.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${range === r
                    ? "bg-[#00e5ff] text-black shadow"
                    : "text-[#94a3b8] hover:text-white"
                  }`}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchRevenue(range)}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-[#94a3b8] hover:text-[#00e5ff] hover:border-[#00e5ff]/30 transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
          <AlertTriangle size={24} />
          <div>
            <div className="font-bold">Failed to load revenue data</div>
            <div className="text-sm opacity-70 mt-1">{error}</div>
          </div>
          <button
            onClick={() => fetchRevenue(range)}
            className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-[#00e5ff]/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">
              Total Revenue ({RANGE_LABELS[range]})
            </div>
          </div>
          {loading ? (
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <div className="text-4xl font-black text-[#00e5ff]">
              {formatCurrency(data?.totalRevenue || 0)}
            </div>
          )}
          <div className="text-xs text-[#475569] mt-2 font-medium">
            {data?.transactionCount || 0} successful transactions
          </div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-purple-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">This Month</div>
          </div>
          {loading ? (
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <div className="text-4xl font-black text-white">
              {formatCurrency(data?.monthRevenue || 0)}
            </div>
          )}
          <div className="text-xs text-[#475569] mt-2 font-medium">Calendar month revenue</div>
        </Card>

        <Card className="!p-6 border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Course Revenue</div>
          </div>
          {loading ? (
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <div className="text-4xl font-black text-emerald-400">
              {formatCurrency(data?.courseRevenueTotal || 0)}
            </div>
          )}
          <div className="text-xs text-[#475569] mt-2 font-medium">
            Price × enrollments across all courses
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 !p-8 bg-white/[0.03] border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-white">Revenue Over Time</h3>
              <p className="text-[10px] text-[#475569] uppercase tracking-widest font-bold mt-1">
                Daily breakdown — last 15 data points
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"></span>
              <span className="text-[10px] text-[#cbd5f5] font-black uppercase tracking-widest">Revenue</span>
            </div>
          </div>

          {loading ? (
            <div className="h-[280px] bg-white/5 rounded-lg animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-[#475569]">
              <BarChart2 size={48} className="mb-4 opacity-30" />
              <p className="text-sm font-medium">No revenue data for this period</p>
              <p className="text-[10px] uppercase tracking-widest mt-2 font-bold">
                Transactions will appear here once sales are recorded
              </p>
            </div>
          ) : (
            <div className="h-[280px] flex items-end gap-2 pb-8 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] text-[#475569] font-bold pr-2">
                <span>{formatCurrency(Math.max(...chartData.map(d => d.value)))}</span>
                <span>{formatCurrency(Math.max(...chartData.map(d => d.value)) / 2)}</span>
                <span>₹0</span>
              </div>
              <div className="flex items-end gap-2 flex-1 pl-16">
                {chartData.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full bg-white/5 rounded-t-lg relative transition-all hover:bg-[#00e5ff]/30 cursor-pointer"
                      style={{ height: `${Math.max(bar.pct, 4)}%`, maxHeight: "240px" }}
                    >
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#00e5ff] text-black text-[9px] font-black py-1 px-2 rounded hidden group-hover:block whitespace-nowrap shadow-xl z-10">
                        {formatCurrency(bar.value)}
                      </div>
                    </div>
                    <span className="text-[8px] text-[#475569] font-bold rotate-45 origin-left whitespace-nowrap">
                      {bar.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card className="!p-0 overflow-hidden bg-white/[0.02] border-white/10">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
          </div>
          <div className="overflow-y-auto max-h-[360px] custom-scrollbar">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (data?.recentTransactions || []).length === 0 ? (
              <div className="p-10 text-center text-[#475569]">
                <p className="text-sm font-medium">No transactions yet</p>
              </div>
            ) : (
              (data?.recentTransactions || []).map((tx: any) => (
                <div key={tx.id} className="px-5 py-4 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                  <div>
                    <div className="text-xs font-bold text-white capitalize">{tx.itemType}</div>
                    <div className="text-[9px] text-[#475569] font-medium mt-0.5">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </div>
                  </div>
                  <div className="text-sm font-black text-[#00e5ff]">
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Top Courses by Revenue */}
      {!loading && (data?.courseSummary || []).length > 0 && (
        <Card className="!p-0 overflow-hidden bg-white/[0.02] border-white/10">
          <div className="p-6 border-b border-white/5 font-bold text-white bg-white/[0.02]">
            Top Courses by Revenue
          </div>
          <div>
            {(data.courseSummary || []).map((course: any, i: number) => (
              <div key={course.id} className="px-8 py-5 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#94a3b8]">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-[#00e5ff] transition-colors">{course.title}</div>
                    <div className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest">
                      {course.enrollments} enrollments × {formatCurrency(course.price)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#00e5ff]">{formatCurrency(course.revenue)}</div>
                  <div className="text-[9px] text-[#475569] uppercase tracking-widest font-bold">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
