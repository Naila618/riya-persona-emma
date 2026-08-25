"use client";

import React from "react";
import {
  Inbox,
  Flame,
  UserCheck,
  UserX,
  Star,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  Layers,
  Zap,
  Tag,
  LifeBuoy,
  BadgeDollarSign,
  CreditCard,
  Users,
  Scale,
} from "lucide-react";
import { Department, EmailCategory, EmailItem, EmailStatus, PriorityLevel } from "@/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

interface InboxSidebarProps {
  emails: EmailItem[];
  departments: Department[];
}

export function InboxSidebar({ emails, departments }: InboxSidebarProps) {
  const {
    currentUser,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
    liveStreamActive,
    setLiveStreamActive,
  } = useAppStore();

  const totalCount = emails.length;
  const urgentCount = emails.filter((e) => e.priority === "Critical" || e.urgencyScore >= 80).length;
  const unassignedCount = emails.filter((e) => !e.assignedUserId && e.status !== "RESOLVED" && e.status !== "SPAM").length;
  const myAssignedCount = emails.filter((e) => e.assignedUserId === currentUser.id && e.status !== "RESOLVED").length;
  const starredCount = emails.filter((e) => e.isStarred).length;
  const resolvedCount = emails.filter((e) => e.status === "RESOLVED").length;
  const spamCount = emails.filter((e) => e.status === "SPAM" || e.spamScore >= 0.7).length;

  const categories: EmailCategory[] = [
    "Support",
    "Sales",
    "Finance",
    "HR",
    "Technical",
    "Complaint",
    "Security",
    "Billing",
    "Legal",
    "Recruitment",
  ];

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case "LifeBuoy":
        return LifeBuoy;
      case "BadgeDollarSign":
        return BadgeDollarSign;
      case "CreditCard":
        return CreditCard;
      case "Users":
        return Users;
      case "ShieldAlert":
        return ShieldAlert;
      case "Scale":
        return Scale;
      default:
        return Layers;
    }
  };

  const isSmartViewActive = (type: string) => {
    if (type === "ALL") return filterStatus === "ALL" && filterPriority === "ALL" && filterDepartment === "ALL" && filterCategory === "ALL";
    if (type === "URGENT") return filterPriority === "Critical";
    if (type === "UNASSIGNED") return filterStatus === "PENDING";
    if (type === "RESOLVED") return filterStatus === "RESOLVED";
    if (type === "SPAM") return filterStatus === "SPAM";
    return false;
  };

  const handleSelectSmartView = (type: string) => {
    setFilterCategory("ALL");
    setFilterDepartment("ALL");
    if (type === "ALL") {
      setFilterStatus("ALL");
      setFilterPriority("ALL");
    } else if (type === "URGENT") {
      setFilterStatus("ALL");
      setFilterPriority("Critical");
    } else if (type === "UNASSIGNED") {
      setFilterStatus("PENDING");
      setFilterPriority("ALL");
    } else if (type === "RESOLVED") {
      setFilterStatus("RESOLVED");
      setFilterPriority("ALL");
    } else if (type === "SPAM") {
      setFilterStatus("SPAM");
      setFilterPriority("ALL");
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 text-xs">
      {/* Live Stream Simulator Switcher */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 p-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", liveStreamActive ? "bg-emerald-400 animate-ping" : "bg-zinc-600")} />
            <span className="font-bold text-white text-xs">Live Stream Ingestion</span>
          </div>
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition",
              liveStreamActive
                ? "bg-emerald-500 text-black shadow-sm"
                : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
            )}
          >
            {liveStreamActive ? "Active (15s)" : "Paused"}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-zinc-400">
          {liveStreamActive
            ? "Auto-simulating incoming enterprise emails every 15s."
            : "Click Active to stream test emails automatically."}
        </p>
      </div>

      {/* Smart Triage Folders */}
      <div>
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Smart Triage Views
        </span>
        <div className="mt-2 space-y-1">
          <button
            onClick={() => handleSelectSmartView("ALL")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
              isSmartViewActive("ALL")
                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4" />
              <span>All Inbound Queue</span>
            </div>
            <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectSmartView("URGENT")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
              isSmartViewActive("URGENT")
                ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Flame className="h-4 w-4 text-rose-400" />
              <span>Urgent & Critical</span>
            </div>
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
              {urgentCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectSmartView("UNASSIGNED")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
              isSmartViewActive("UNASSIGNED")
                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <UserX className="h-4 w-4 text-amber-400" />
              <span>Pending Assignment</span>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
              {unassignedCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectSmartView("RESOLVED")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
              isSmartViewActive("RESOLVED")
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Resolved Tickets</span>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
              {resolvedCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectSmartView("SPAM")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
              isSmartViewActive("SPAM")
                ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span>Spam & Threats</span>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
              {spamCount}
            </span>
          </button>
        </div>
      </div>

      {/* Department Queues */}
      <div>
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Department Queues
          </span>
          {filterDepartment !== "ALL" && (
            <button
              onClick={() => setFilterDepartment("ALL")}
              className="text-[10px] text-indigo-400 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-2 space-y-1">
          {departments.map((dept) => {
            const Icon = getDeptIcon(dept.icon);
            const count = emails.filter((e) => e.departmentId === dept.id && e.status !== "RESOLVED").length;
            const isSelected = filterDepartment === dept.id;

            return (
              <button
                key={dept.id}
                onClick={() => setFilterDepartment(isSelected ? "ALL" : dept.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 font-medium transition",
                  isSelected
                    ? "bg-indigo-600/20 text-white font-bold border border-indigo-500/30"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Icon className="h-4 w-4 shrink-0" style={{ color: dept.color }} />
                  <span className="truncate">{dept.name}</span>
                </div>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tags */}
      <div>
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Categories & Tags
          </span>
          {filterCategory !== "ALL" && (
            <button
              onClick={() => setFilterCategory("ALL")}
              className="text-[10px] text-indigo-400 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 px-1">
          {categories.map((cat) => {
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(isSelected ? "ALL" : cat)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-medium transition border",
                  isSelected
                    ? "border-indigo-500 bg-indigo-600 text-white font-bold"
                    : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
