import React from "react";
import { Activity as ActivityIcon, ArrowRight, ShieldCheck, Mail, Zap, UserCheck, Flame } from "lucide-react";
import { Activity } from "@/types";
import { formatTimeAgo, formatDateTime } from "@/lib/utils";

interface ActivityTickerProps {
  activities: (Activity & { emailSubject?: string })[];
}

export function ActivityTicker({ activities }: ActivityTickerProps) {
  const getBadge = (action: string) => {
    switch (action) {
      case "RECEIVED":
        return { label: "Inbound", color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "AI_CLASSIFIED":
      case "AI_TRIAGED":
        return { label: "AI Triaged", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
      case "ASSIGNED":
      case "AUTO_ASSIGNED":
        return { label: "Assigned", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "REPLY_SENT":
        return { label: "Reply Sent", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      case "RESOLVED":
        return { label: "Resolved", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      default:
        return { label: action, color: "text-zinc-400 bg-zinc-800 border-zinc-700" };
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ActivityIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Operations Activity Stream</h3>
            <p className="text-xs text-zinc-400">Real-time audit log of triage events across all departments</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Sync</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {activities.slice(0, 6).map((act, idx) => {
          const badge = getBadge(act.action);
          return (
            <div
              key={act.id || idx}
              className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs"
            >
              <div className="flex items-start gap-2.5 overflow-hidden">
                <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase shrink-0 border ${badge.color}`}>
                  {badge.label}
                </span>
                <div className="overflow-hidden">
                  <p className="font-semibold text-zinc-200 truncate">
                    {act.performedBy} {act.emailSubject ? `• "${act.emailSubject}"` : ""}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">{act.details}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
