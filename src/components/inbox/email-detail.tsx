"use client";

import React, { useState } from "react";
import {
  Star,
  Trash2,
  Share2,
  Archive,
  Clock,
  Paperclip,
  Download,
  Flame,
  Shield,
  User,
  Users,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Department, EmailCategory, EmailItem, PriorityLevel, User as UserType } from "@/types";
import { AIIntelPanel } from "./ai-intel-panel";
import { SmartReplyStudio } from "./smart-reply-studio";
import { InternalNotes } from "./internal-notes";
import { ActivityTimeline } from "./activity-timeline";
import { useAppStore } from "@/lib/store/use-app-store";
import { getPriorityColor, getCategoryBadge, formatDateTime, formatTimeAgo, cn } from "@/lib/utils";
import { toast } from "sonner";

interface EmailDetailProps {
  email: EmailItem;
  departments: Department[];
  users: UserType[];
  onEmailUpdated: () => void;
}

export function EmailDetail({ email, departments, users, onEmailUpdated }: EmailDetailProps) {
  const { currentUser } = useAppStore();
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (updates: Partial<EmailItem>, successMessage?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/emails/${email.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          performerName: currentUser.name,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      if (successMessage) toast.success(successMessage);
      onEmailUpdated();
    } catch (err) {
      toast.error("Failed to update email properties");
    } finally {
      setUpdating(false);
    }
  };

  const priorityMeta = getPriorityColor(email.priority);
  const categoryMeta = getCategoryBadge(email.category);

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-1 space-y-6">
      {/* Top Action Toolbar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3.5 backdrop-blur-xl shadow-lg">
        {/* Left: Department & Assignee Pickers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Router Selector */}
          <div className="relative flex items-center">
            <select
              value={email.departmentId}
              onChange={(e) => handleUpdate({ departmentId: e.target.value }, "Department routing updated")}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  Dept: {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Adjuster */}
          <div className="relative flex items-center">
            <select
              value={email.priority}
              onChange={(e) => handleUpdate({ priority: e.target.value as PriorityLevel }, "Priority updated")}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer",
                priorityMeta.badge
              )}
            >
              <option value="Critical">🔥 Critical Priority</option>
              <option value="High">⚡ High Priority</option>
              <option value="Medium">● Medium Priority</option>
              <option value="Low">○ Low Priority</option>
            </select>
          </div>

          {/* Status Switcher */}
          <div className="relative flex items-center">
            <select
              value={email.status}
              onChange={(e) => handleUpdate({ status: e.target.value as any }, `Status changed to ${e.target.value}`)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="PENDING">Status: Pending</option>
              <option value="ASSIGNED">Status: Assigned</option>
              <option value="IN_PROGRESS">Status: In Progress</option>
              <option value="RESOLVED">Status: Resolved ✓</option>
              <option value="SPAM">Status: Spam / Trash</option>
            </select>
          </div>

          {/* Assignee Picker */}
          <div className="relative flex items-center">
            <select
              value={email.assignedUserId || ""}
              onChange={(e) => handleUpdate({ assignedUserId: e.target.value || undefined }, "Assignee updated")}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  Assign: {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Quick actions (Star, Trash) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleUpdate({ isStarred: !email.isStarred })}
            className={cn(
              "rounded-lg p-2 border transition",
              email.isStarred
                ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
            )}
            title="Star email"
          >
            <Star className={cn("h-4 w-4", email.isStarred && "fill-amber-400")} />
          </button>

          <button
            onClick={() => handleUpdate({ status: "TRASH" }, "Moved email to Trash")}
            className="rounded-lg p-2 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-rose-400 transition"
            title="Move to Trash"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Email Header Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        {/* Subject & Category pill */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
            {email.subject}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn("rounded-lg border px-2.5 py-1 text-xs font-semibold", categoryMeta.bg, categoryMeta.text, categoryMeta.border)}>
              {email.category}
            </span>
            <span className={cn("rounded-lg border px-2.5 py-1 text-xs font-bold", priorityMeta.badge)}>
              {email.priority} Priority
            </span>
          </div>
        </div>

        {/* Sender Info & SLA Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={email.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={email.senderName}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{email.senderName}</span>
                <span className="text-zinc-400 text-xs">&lt;{email.sender}&gt;</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                To: <span className="text-zinc-400 font-mono">{email.receiver}</span> • {formatDateTime(email.receivedAt)} ({formatTimeAgo(email.receivedAt)})
              </p>
            </div>
          </div>

          {/* SLA Deadline Tracker */}
          {email.slaDeadline && (
            <div className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shrink-0",
              email.slaBreached
                ? "border-rose-500/40 bg-rose-500/10 text-rose-300 animate-pulse"
                : "border-zinc-800 bg-zinc-950 text-zinc-300"
            )}>
              <Clock className={cn("h-4 w-4", email.slaBreached ? "text-rose-400" : "text-indigo-400")} />
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-mono">SLA Target Deadline</p>
                <p className="font-mono text-xs">{formatDateTime(email.slaDeadline)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Body Content */}
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-5 text-sm leading-relaxed text-zinc-200 whitespace-pre-line font-sans">
          {email.body}
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              <span>Attachments ({email.attachments.length})</span>
            </span>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {email.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-xs hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/15 text-indigo-400 font-bold text-[10px] uppercase">
                      {att.fileName.split(".").pop()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-white truncate">{att.fileName}</p>
                      <p className="text-[10px] text-zinc-400">{att.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Simulating download of ${att.fileName}`)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                    title="Download attachment"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dispatched Replies Thread */}
      {email.replies && email.replies.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Dispatched Replies History ({email.replies.length})</span>
            </span>
          </div>
          <div className="space-y-3">
            {email.replies.map((rep) => (
              <div key={rep.id} className="rounded-xl border border-indigo-500/20 bg-indigo-950/15 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rep.userAvatar} alt={rep.userName} className="h-6 w-6 rounded-full object-cover" />
                    <span className="font-bold text-white">{rep.userName}</span>
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[10px] font-mono text-indigo-300">
                      {rep.tone} Tone
                    </span>
                    {rep.aiGenerated && (
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-purple-300">
                        AI-Assisted
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400">{formatTimeAgo(rep.createdAt)}</span>
                </div>
                <div className="mt-2.5 leading-relaxed text-zinc-200 whitespace-pre-line bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 font-sans">
                  {rep.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Intelligence Deep Breakdown */}
      <AIIntelPanel email={email} />

      {/* AI Smart Reply Studio */}
      <SmartReplyStudio email={email} onReplySent={onEmailUpdated} />

      {/* Internal Team Notes */}
      <InternalNotes email={email} onNoteAdded={onEmailUpdated} />

      {/* Full Lifecycle Audit History */}
      <ActivityTimeline activities={email.activities || []} />
    </div>
  );
}
