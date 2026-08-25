"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AnalyticsData } from "@/types";

interface SentimentRiskChartProps {
  analytics: AnalyticsData;
}

export function SentimentRiskChart({ analytics }: SentimentRiskChartProps) {
  const categoryData = analytics.categoryDistribution || [];
  const peakHours = analytics.peakHours || [];
  const sentimentData = analytics.sentimentBreakdown || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Breakdown Donut */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
        <div className="border-b border-zinc-800/80 pb-2.5">
          <h3 className="text-sm font-bold text-white">Email Category Breakdown</h3>
          <p className="text-xs text-zinc-400">Classified distribution across departments</p>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#6366F1"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  borderColor: "#3F3F46",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                  color: "#F8FAFC",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {categoryData.slice(0, 6).map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5 overflow-hidden">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-zinc-300 truncate">{cat.name}</span>
              <span className="text-zinc-400 font-mono ml-auto">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Inbound Hours Heatmap */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
        <div className="border-b border-zinc-800/80 pb-2.5">
          <h3 className="text-sm font-bold text-white">Peak Inbound Traffic Hours</h3>
          <p className="text-xs text-zinc-400">Hourly volume heatmap (EST)</p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="hour" stroke="#71717A" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  borderColor: "#3F3F46",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                  color: "#F8FAFC",
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-zinc-400 text-center font-medium">
          Peak arrival velocity between <strong className="text-indigo-400">10:00 AM - 2:00 PM</strong>
        </p>
      </div>

      {/* Sentiment Breakdown */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="border-b border-zinc-800/80 pb-2.5">
          <h3 className="text-sm font-bold text-white">Customer Sentiment Index</h3>
          <p className="text-xs text-zinc-400">Emotional tone detected across incoming messages</p>
        </div>

        <div className="space-y-3 pt-2">
          {sentimentData.map((s) => (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-200">{s.name}</span>
                <span className="font-mono text-zinc-400">{s.value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${s.value}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">AI Triage Note: </span>
          Frustrated emails are automatically escalated to Senior CSM queues.
        </div>
      </div>
    </div>
  );
}
