"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";
import { AnalyticsData, DashboardMetrics } from "@/types";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Download,
  Flame,
  Star,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"Today" | "7D" | "30D" | "90D">("7D");

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setMetrics(data.metrics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SLA Performance & Team Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Department resolution velocity, SLA adherence, and agent productivity leaderboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeframe selector */}
            <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
              {(["Today", "7D", "30D", "90D"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    timeframe === t
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast.success("Exporting Analytics Report as CSV...")}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {loading || !analytics ? (
          <div className="flex flex-col items-center justify-center py-32 text-xs text-zinc-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span>Crunching SLA metrics...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-indigo-500/30 bg-zinc-900/80 p-5 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Global SLA Compliance
                </span>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span className="text-emerald-400">99.2%</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">Target: &gt;98.5% across all 6 queues</p>
              </div>

              <div className="rounded-2xl border border-purple-500/30 bg-zinc-900/80 p-5 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Avg First Resolution Time
                </span>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span className="text-indigo-400">14.8m</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">84% faster than human manual triage</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/80 p-5 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Total Handled Tickets
                </span>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span className="text-cyan-400">1,280</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">100% triaged with zero backlog</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/80 p-5 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Average Customer CSAT
                </span>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span className="text-amber-400 flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400" /> 4.92 / 5.0
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">Based on 640 client reviews</p>
              </div>
            </div>

            {/* Department Performance Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-base font-bold text-white">Department SLA & Velocity Matrix</h3>
                <p className="text-xs text-zinc-400">Real-time performance metrics broken down by operational department</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 text-[11px] font-bold uppercase text-zinc-400">
                    <tr>
                      <th className="py-3 px-4">Department Queue</th>
                      <th className="py-3 px-4">Received</th>
                      <th className="py-3 px-4">Resolved</th>
                      <th className="py-3 px-4">Avg Speed</th>
                      <th className="py-3 px-4">SLA Compliance</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {analytics.departmentPerformance.map((dept) => (
                      <tr key={dept.name} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          <span>{dept.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300">{dept.received}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{dept.resolved}</td>
                        <td className="py-3.5 px-4 font-mono text-cyan-400">{dept.avgMinutes} min</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                          <div className="flex items-center gap-2">
                            <span>{dept.slaPercent}%</span>
                            <div className="h-1.5 w-16 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${dept.slaPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Healthy SLA
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Agent Leaderboard */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Top Performing Specialists Leaderboard</h3>
                    <p className="text-xs text-zinc-400">Resolution velocity, handled volume, and CSAT ratings</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Ranked by CSAT & Volume</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.agentLeaderboard.map((agent, i) => (
                  <div
                    key={agent.id}
                    className="relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-amber-500/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                          <p className="text-[11px] text-zinc-400">{agent.department}</p>
                        </div>
                      </div>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400 font-mono">
                        #{i + 1}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 text-center text-[11px]">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Resolved</span>
                        <span className="font-bold text-white font-mono">{agent.resolvedCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Avg Time</span>
                        <span className="font-bold text-cyan-400 font-mono">{agent.avgMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">CSAT</span>
                        <span className="font-bold text-amber-400 font-mono">{agent.csat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
