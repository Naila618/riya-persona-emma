"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Inbox,
  LayoutDashboard,
  BarChart3,
  Sliders,
  Zap,
  Settings,
  Mail,
  Flame,
  Shield,
  CreditCard,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { EmailItem } from "@/types";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setFilterCategory,
    setFilterPriority,
    setSelectedEmailId,
    setSimulatorOpen,
  } = useAppStore();

  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetch("/api/emails")
        .then((res) => res.json())
        .then((data) => setEmails(data.emails || []))
        .catch(console.error);
    } else {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredEmails = emails
    .filter(
      (e) =>
        e.subject.toLowerCase().includes(query.toLowerCase()) ||
        e.sender.toLowerCase().includes(query.toLowerCase()) ||
        e.senderName.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setCommandPaletteOpen(false);
    router.push("/inbox");
  };

  const handleAction = (callback: () => void) => {
    callback();
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b border-zinc-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-indigo-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, jump to an email, or filter by category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Navigations */}
          <div>
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Quick Navigation
            </p>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => handleAction(() => router.push("/inbox"))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition text-left"
              >
                <Inbox className="h-4 w-4 text-indigo-400" />
                <span>Open Unified Triage Inbox</span>
                <span className="ml-auto text-[10px] text-zinc-400">G then I</span>
              </button>
              <button
                onClick={() => handleAction(() => router.push("/dashboard"))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition text-left"
              >
                <LayoutDashboard className="h-4 w-4 text-purple-400" />
                <span>Open Executive Dashboard</span>
                <span className="ml-auto text-[10px] text-zinc-400">G then D</span>
              </button>
              <button
                onClick={() => handleAction(() => router.push("/analytics"))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition text-left"
              >
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <span>View SLA & Analytics Report</span>
              </button>
              <button
                onClick={() => handleAction(() => setSimulatorOpen(true))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition text-left"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Simulate Inbound Enterprise Email</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Actions */}
          <div>
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Filter Inbox By Priority & Department
            </p>
            <div className="mt-1 grid grid-cols-2 gap-1 px-1">
              <button
                onClick={() =>
                  handleAction(() => {
                    setFilterPriority("Critical");
                    router.push("/inbox");
                  })
                }
                className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition text-left"
              >
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Critical Priority Only</span>
              </button>
              <button
                onClick={() =>
                  handleAction(() => {
                    setFilterCategory("Security");
                    router.push("/inbox");
                  })
                }
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition text-left"
              >
                <Shield className="h-3.5 w-3.5 text-red-400" />
                <span>Security Threats</span>
              </button>
              <button
                onClick={() =>
                  handleAction(() => {
                    setFilterCategory("Billing");
                    router.push("/inbox");
                  })
                }
                className="flex items-center gap-2 rounded-lg bg-teal-500/10 px-3 py-2 text-xs font-medium text-teal-400 hover:bg-teal-500/20 transition text-left"
              >
                <CreditCard className="h-3.5 w-3.5 text-teal-400" />
                <span>Billing & Refunds</span>
              </button>
              <button
                onClick={() =>
                  handleAction(() => {
                    setFilterCategory("Sales");
                    router.push("/inbox");
                  })
                }
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition text-left"
              >
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>Enterprise Sales</span>
              </button>
            </div>
          </div>

          {/* Search Matched Emails */}
          {filteredEmails.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Matched Emails ({filteredEmails.length})
              </p>
              <div className="mt-1 space-y-1">
                {filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email.id)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-zinc-800 transition"
                  >
                    <Mail className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-white truncate">{email.subject}</p>
                        <span className="text-[10px] text-zinc-400 font-mono">{email.category}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{email.senderName} • {email.snippet}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/60 px-4 py-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[10px]">↑</kbd> <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[10px]">↵</kbd></span>
          </div>
          <span>Close: <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[10px]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
}
