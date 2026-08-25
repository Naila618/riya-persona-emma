import React from "react";
import { Star, Flame, ShieldAlert, Paperclip, CheckCircle2 } from "lucide-react";
import { EmailItem } from "@/types";
import { getPriorityColor, getSentimentBadge, getCategoryBadge, getUrgencyGradient, formatTimeAgo, cn } from "@/lib/utils";

interface EmailListItemProps {
  email: EmailItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function EmailListItem({ email, isSelected, onSelect }: EmailListItemProps) {
  const priorityMeta = getPriorityColor(email.priority);
  const sentimentMeta = getSentimentBadge(email.sentiment);
  const categoryMeta = getCategoryBadge(email.category);
  const urgencyMeta = getUrgencyGradient(email.urgencyScore);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-all duration-150",
        isSelected
          ? "border-indigo-500/80 bg-indigo-950/25 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
          : "border-zinc-800/70 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/90"
      )}
    >
      {/* Top row: Sender Avatar + Name + Category + Timestamp */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={email.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={email.senderName}
            className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-zinc-700"
          />
          <span className="font-bold text-xs text-zinc-100 truncate">{email.senderName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("rounded-md border px-2 py-0.2 text-[10px] font-semibold", categoryMeta.bg, categoryMeta.text, categoryMeta.border)}>
            {email.category}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">{formatTimeAgo(email.receivedAt)}</span>
        </div>
      </div>

      {/* Subject Line */}
      <div className="flex items-center justify-between gap-2">
        <h4 className={cn("text-xs font-bold truncate", isSelected ? "text-white" : "text-zinc-200")}>
          {email.subject}
        </h4>
        {email.isStarred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />}
      </div>

      {/* Snippet / Summary */}
      <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
        {email.summary || email.snippet}
      </p>

      {/* Bottom Row: Urgency Flame, Sentiment Icon, Priority Tag, Status */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-[10px]">
        <div className="flex items-center gap-2">
          {/* Urgency Badge */}
          <div className="flex items-center gap-1 font-bold">
            <Flame className={cn("h-3.5 w-3.5", urgencyMeta.color)} />
            <span className={urgencyMeta.color}>{email.urgencyScore}</span>
          </div>

          {/* Sentiment */}
          <span title={`Sentiment: ${sentimentMeta.label}`}>{sentimentMeta.icon}</span>

          {/* Security Risk Flag if any */}
          {email.spamScore > 0.6 && (
            <span className="flex items-center gap-0.5 text-rose-400 font-bold">
              <ShieldAlert className="h-3 w-3" /> Risk
            </span>
          )}

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-zinc-400">
              <Paperclip className="h-3 w-3" /> {email.attachments.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={cn("rounded border px-1.5 py-0.2 text-[10px] font-bold", priorityMeta.badge)}>
            {email.priority}
          </span>
          <span className="rounded bg-zinc-800/90 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
            {email.status}
          </span>
        </div>
      </div>
    </div>
  );
}
