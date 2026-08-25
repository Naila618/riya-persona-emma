"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { UrgentQueue } from "@/components/dashboard/urgent-queue";
import { TrafficCharts } from "@/components/dashboard/traffic-charts";
import { SentimentRiskChart } from "@/components/dashboard/sentiment-risk-chart";
import { ActivityTicker } from "@/components/dashboard/activity-ticker";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";
import { AnalyticsData, DashboardMetrics, EmailItem, Activity } from "@/types";
import { Loader2, RefreshCw, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";

export default function DashboardPage() {
  const { setSimulatorOpen } = useAppStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [urgentQueue, setUrgentQueue] = useState<EmailItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<(Activity & { emailSubject?: string })[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, anaRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/analytics"),
      ]);

      if (dashRes.ok && anaRes.ok) {
        const dashData = await dashRes.json();
        const anaData = await anaRes.json();
        setMetrics(dashData.metrics);
        setUrgentQueue(dashData.urgentQueue || []);
        setRecentActivity(dashData.recentActivity || []);
        setAnalytics(anaData.analytics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Triage & SLA Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Live intelligence metrics, urgent SLA escalations, and automated department throughput
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchDashboardData()}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
              <span>Refresh Metrics</span>
            </button>
            <button
              onClick={() => setSimulatorOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition"
            >
              <Zap className="h-3.5 w-3.5 text-cyan-300" />
              <span>Simulate Incident</span>
            </button>
          </div>
        </div>

        {loading || !metrics || !analytics ? (
          <div className="flex flex-col items-center justify-center py-32 text-xs text-zinc-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span>Loading live executive intelligence...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Metric KPI Cards */}
            <MetricCards metrics={metrics} />

            {/* Urgent Queue Callout */}
            <UrgentQueue urgentEmails={urgentQueue} />

            {/* Traffic & Volume Trends Charts */}
            <TrafficCharts analytics={analytics} />

            {/* Category Donut & Peak Hours */}
            <SentimentRiskChart analytics={analytics} />

            {/* Live Activity Stream */}
            <ActivityTicker activities={recentActivity} />
          </div>
        )}
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
