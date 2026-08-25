"use client";

import React from "react";
import Link from "next/link";
import { Flame, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { EmailItem } from "@/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { getPriorityColor, getCategoryBadge, formatTimeAgo, formatDateTime, cn } from "@/lib/utils";

interface UrgentQueueProps {
  urgentEmails: EmailItem[];
}

export function UrgentQueue({ urgentEmails }: UrgentQueueProps) {
  const { setSelectedEmailId } = useAppStore();

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-zinc-900/90 to-zinc-900/90 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Flame className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Urgent & Escalated SLA Queue</span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 font-mono">
                {urgentEmails.length} Active
              </span>
            </h3>
            <p className="text-xs text-zinc-400">High impact tickets requiring immediate resolution</p>
          </div>
        </div>
        <Link
          href="/inbox"
          className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
        >
          <span>View All in Inbox</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {urgentEmails.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
            <p className="font-bold text-zinc-300">All urgent tickets triaged!</p>
            <p className="text-[11px] text-zinc-400">No breached or high-urgency SLAs in queue.</p>
          </div>
        ) : (
          urgentEmails.map((email) => {
            const catMeta = getCategoryBadge(email.category);
            return (
              <div
                key={email.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 hover:border-rose-500/40 transition"
              >
                <div className="flex items-start gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 font-mono font-bold text-xs border border-rose-500/30">
                    {email.urgencyScore}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{email.subject}</span>
                      <span className={cn("rounded px-1.5 py-0.2 text-[10px] font-semibold", catMeta.bg, catMeta.text)}>
                        {email.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-400 truncate">
                      From: <strong className="text-zinc-300">{email.senderName}</strong> • {email.summary || email.snippet}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-zinc-400 font-mono block">SLA Target</span>
                    <span className="text-[11px] font-mono text-rose-300 font-bold">
                      {email.slaDeadline ? formatTimeAgo(email.slaDeadline) : "Immediate"}
                    </span>
                  </div>
                  <Link
                    href="/inbox"
                    onClick={() => setSelectedEmailId(email.id)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
                  >
                    <span>Triage</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
