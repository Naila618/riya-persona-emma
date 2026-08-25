"use client";

import React from "react";
import {
  Inbox,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Zap,
} from "lucide-react";
import { DashboardMetrics } from "@/types";
import { cn } from "@/lib/utils";

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: "Total Inbound Volume",
      value: metrics.totalEmails.toLocaleString(),
      change: `+${metrics.weeklyGrowthRate}% this week`,
      positive: true,
      icon: Inbox,
      color: "text-indigo-400",
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Urgent & Critical Queue",
      value: metrics.urgentEmails.toString(),
      change: "Immediate SLA attention",
      positive: false,
      icon: Flame,
      color: "text-rose-400",
      border: "border-rose-500/40",
      bg: "bg-rose-500/10",
      glow: "animate-pulse",
    },
    {
      title: "Resolved Tickets",
      value: metrics.resolvedEmails.toLocaleString(),
      change: "SLA compliance 99.2%",
      positive: true,
      icon: CheckCircle2,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Avg Response Time",
      value: `${metrics.averageResponseTimeMinutes}m`,
      change: "84% faster than human baseline",
      positive: true,
      icon: Clock,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
    },
    {
      title: "AI Accuracy Precision",
      value: `${metrics.aiAccuracyRate}%`,
      change: "Autonomous neural verification",
      positive: true,
      icon: BrainCircuit,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
    },
    {
      title: "Spam & Phishing Blocked",
      value: metrics.spamEmails.toString(),
      change: "100% threat containment",
      positive: true,
      icon: ShieldCheck,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={cn(
              "relative flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5",
              card.border,
              "bg-zinc-900/80 hover:bg-zinc-900"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 truncate">
                {card.title}
              </span>
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg border", card.bg, card.border)}>
                <Icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-extrabold text-white font-mono">{card.value}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                <TrendingUp className={cn("h-3 w-3", card.positive ? "text-emerald-400" : "text-rose-400")} />
                <span className={cn(card.positive ? "text-emerald-400/90" : "text-rose-400/90")}>
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
