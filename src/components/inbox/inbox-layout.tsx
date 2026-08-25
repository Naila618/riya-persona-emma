"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Trash2,
  FolderInput,
  ShieldAlert,
  Loader2,
  Mail,
  Zap,
} from "lucide-react";
import { Department, EmailCategory, EmailItem, PriorityLevel, SentimentType, User as UserType } from "@/types";
import { InboxSidebar } from "./inbox-sidebar";
import { EmailListItem } from "./email-list-item";
import { EmailDetail } from "./email-detail";
import { useAppStore } from "@/lib/store/use-app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InboxLayout() {
  const {
    currentUser,
    selectedEmailId,
    setSelectedEmailId,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
    filterSentiment,
    setFilterSentiment,
    searchQuery,
    setSearchQuery,
    liveStreamActive,
    setSimulatorOpen,
  } = useAppStore();

  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch emails, departments and users
  const fetchData = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [emailsRes, deptsRes] = await Promise.all([
        fetch("/api/emails"),
        fetch("/api/departments"),
      ]);

      if (emailsRes.ok && deptsRes.ok) {
        const emailsData = await emailsRes.json();
        const deptsData = await deptsRes.json();
        setEmails(emailsData.emails || []);
        setDepartments(deptsData.departments || []);
        setUsers(deptsData.users || []);

        // Default select first email if none selected or selected not in list
        if (emailsData.emails?.length > 0) {
          if (!selectedEmailId || !emailsData.emails.some((e: EmailItem) => e.id === selectedEmailId)) {
            setSelectedEmailId(emailsData.emails[0].id);
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load inbox data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live stream interval if active
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(async () => {
      const scenarios = ["outage", "deal", "phishing", "refund", "candidate"];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      try {
        const res = await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioKey: randomScenario }),
        });
        if (res.ok) {
          const data = await res.json();
          toast.info("⚡ Live Inbound Stream", {
            description: `Triaged: "${data.email.subject.substring(0, 35)}..." (${data.email.priority} priority)`,
          });
          fetchData(true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  // Apply multi-filters
  const filteredEmails = emails.filter((email) => {
    if (filterCategory !== "ALL" && email.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (filterPriority !== "ALL" && email.priority.toLowerCase() !== filterPriority.toLowerCase()) {
      return false;
    }
    if (filterStatus !== "ALL" && email.status !== filterStatus) {
      return false;
    }
    if (filterDepartment !== "ALL" && email.departmentId !== filterDepartment) {
      return false;
    }
    if (filterSentiment !== "ALL" && email.sentiment.toLowerCase() !== filterSentiment.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        email.subject.toLowerCase().includes(q) ||
        email.body.toLowerCase().includes(q) ||
        email.sender.toLowerCase().includes(q) ||
        email.senderName.toLowerCase().includes(q) ||
        email.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0];

  const handleBatchAction = async (action: string) => {
    if (!selectedEmail) return;
    try {
      if (action === "resolve") {
        await fetch(`/api/emails/${selectedEmail.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "RESOLVED", performerName: currentUser.name }),
        });
        toast.success("Ticket marked as Resolved");
      } else if (action === "spam") {
        await fetch(`/api/emails/${selectedEmail.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "SPAM", performerName: currentUser.name }),
        });
        toast.success("Email moved to Spam");
      }
      fetchData(true);
    } catch (e) {
      toast.error("Failed to execute batch action");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex w-full gap-5 overflow-hidden">
        {/* Left Column: Sidebar (Folders, Departments, Tags) */}
        <div className="hidden lg:flex shrink-0">
          <InboxSidebar emails={emails} departments={departments} />
        </div>

        {/* Center Column: Search & Email List (Width ~380-440px) */}
        <div className="flex w-full lg:w-[420px] shrink-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Center Search & Filters Header */}
          <div className="border-b border-zinc-800 p-3 space-y-2.5 bg-zinc-950/60">
            <div className="flex items-center justify-between gap-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search subject, sender, intent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchData()}
                disabled={refreshing}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition disabled:opacity-50"
                title="Refresh queue"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-indigo-400")} />
              </button>
            </div>

            {/* Quick Filter dropdowns */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-0.5">
              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Priority: All</option>
                <option value="Critical">🔥 Critical</option>
                <option value="High">⚡ High</option>
                <option value="Medium">● Medium</option>
                <option value="Low">○ Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Status: All</option>
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Sentiment Filter */}
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Sentiment: All</option>
                <option value="Positive">😊 Positive</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Negative">😟 Negative</option>
                <option value="Frustrated">😡 Frustrated</option>
              </select>
            </div>
          </div>

          {/* List Counter & Batch Actions Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/40 px-3 py-2 text-[11px] text-zinc-400">
            <span>
              Showing <strong className="text-white">{filteredEmails.length}</strong> emails
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleBatchAction("resolve")}
                className="rounded px-2 py-0.5 text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition"
                title="Mark Selected Resolved"
              >
                Resolve
              </button>
              <button
                onClick={() => handleBatchAction("spam")}
                className="rounded px-2 py-0.5 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                title="Move Selected to Spam"
              >
                Spam
              </button>
            </div>
          </div>

          {/* Scrollable Email Cards List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-xs text-zinc-400 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span>Loading inbound triage queue...</span>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-xs text-zinc-400 p-4">
                <Mail className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="font-bold text-zinc-300">No emails match filters</p>
                <p className="mt-1 text-zinc-400 text-[11px]">
                  Try clearing search terms or simulate a new email scenario.
                </p>
                <button
                  onClick={() => setSimulatorOpen(true)}
                  className="mt-4 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Simulate New Email
                </button>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isSelected={selectedEmail?.id === email.id}
                  onSelect={() => setSelectedEmailId(email.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Email Detail & AI Intel Panel */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              departments={departments}
              users={users}
              onEmailUpdated={() => fetchData(true)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400">
              Select an email from the queue to inspect AI triage intel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
