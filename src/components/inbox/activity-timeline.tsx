import React from "react";
import { History, ArrowRight, ShieldCheck, Mail, UserCheck, Send, CheckCircle2 } from "lucide-react";
import { Activity } from "@/types";
import { formatTimeAgo, formatDateTime } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActionBadge = (action: string) => {
    switch (action) {
      case "RECEIVED":
        return { label: "Inbound Ingestion", color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "AI_CLASSIFIED":
      case "AI_TRIAGED":
        return { label: "AI Triage & Intel", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
      case "AUTO_ASSIGNED":
      case "ASSIGNED":
      case "REASSIGNED":
        return { label: "Assignment", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "REPLY_SENT":
        return { label: "Reply Sent", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      case "RESOLVED":
        return { label: "Resolved", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "STATUS_CHANGE":
      case "PRIORITY_CHANGE":
      case "DEPARTMENT_CHANGE":
        return { label: "Attribute Update", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      default:
        return { label: action, color: "text-zinc-400 bg-zinc-800 border-zinc-700" };
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lifecycle Audit Trail</h4>
            <p className="text-[10px] text-zinc-400">Complete immutable history of routing, AI decisions & status changes</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">{activities.length} events logged</span>
      </div>

      <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800/80 pl-2">
        {activities.map((act, index) => {
          const meta = getActionBadge(act.action);
          return (
            <div key={act.id || index} className="relative flex items-start gap-3 text-xs pl-4">
              <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-700 ring-4 ring-zinc-900" />
              <div className="flex-1 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-1.5 py-0.2 text-[10px] font-bold uppercase ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="font-semibold text-zinc-200">{act.performedBy}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono" title={formatDateTime(act.timestamp)}>
                    {formatTimeAgo(act.timestamp)}
                  </span>
                </div>
                {act.details && (
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{act.details}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
