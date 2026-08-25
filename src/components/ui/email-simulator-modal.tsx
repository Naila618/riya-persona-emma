"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  X,
  Sparkles,
  ShieldAlert,
  BadgeDollarSign,
  AlertTriangle,
  RotateCcw,
  Scale,
  UserCheck,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_SCENARIOS = [
  {
    key: "outage",
    title: "Kubernetes Production Outage",
    category: "Support / Technical",
    urgency: "98/100 (Critical)",
    icon: AlertTriangle,
    color: "from-rose-600 to-red-600",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    desc: "Ingress 502 Bad Gateway drop impacting 14,000 active customer checkout sessions.",
  },
  {
    key: "deal",
    title: "1,000 Seat Enterprise Deal ($650k)",
    category: "Enterprise Sales",
    urgency: "82/100 (High)",
    icon: BadgeDollarSign,
    color: "from-emerald-600 to-teal-600",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    desc: "Global CX EVP requesting executive demo, custom SSO, and Net-30 MSA terms.",
  },
  {
    key: "phishing",
    title: "Spear-Phishing Wire Fraud Threat",
    category: "Cyber Security",
    urgency: "95/100 (Critical Risk)",
    icon: ShieldAlert,
    color: "from-red-600 to-rose-700",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    desc: "Urgent confidential acquisition wire request spoofing CEO with external escrow details.",
  },
  {
    key: "refund",
    title: "Unauthorized Chargeback Dispute",
    category: "Finance & Billing",
    urgency: "88/100 (High)",
    icon: RotateCcw,
    color: "from-amber-600 to-orange-600",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    desc: "Customer disputing accidental $19,800 renewal charge with threat of bank chargeback.",
  },
  {
    key: "gdpr",
    title: "GDPR Article 17 Erasure Mandate",
    category: "Legal & Compliance",
    urgency: "72/100 (Medium)",
    icon: Scale,
    color: "from-indigo-600 to-blue-600",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    desc: "Statutory 30-day data erasure request from European compliance auditor.",
  },
  {
    key: "candidate",
    title: "Principal AI Architect Application",
    category: "People & HR",
    urgency: "45/100 (Medium)",
    icon: UserCheck,
    color: "from-purple-600 to-pink-600",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    desc: "Stanford Ph.D. RAG specialist applying for Principal AI Architect role.",
  },
];

export function EmailSimulatorModal() {
  const router = useRouter();
  const { simulatorOpen, setSimulatorOpen, setSelectedEmailId, customApiKey } = useAppStore();

  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [loading, setLoading] = useState(false);

  // Custom email state
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [customSender, setCustomSender] = useState("");
  const [customSenderName, setCustomSenderName] = useState("");

  if (!simulatorOpen) return null;

  const handleSimulatePreset = async (scenarioKey: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioKey, customApiKey }),
      });

      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();

      toast.success("Inbound Email Ingested & AI Triaged!", {
        description: `Subject: "${data.email.subject.substring(0, 40)}..."\nRouted to ${data.email.departmentName} (${data.email.priority} Priority)`,
      });

      setSelectedEmailId(data.email.id);
      setSimulatorOpen(false);
      router.push("/inbox");
    } catch (err) {
      toast.error("Failed to simulate email");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject || !customBody || !customSender) {
      toast.error("Please fill in subject, body, and sender email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: customSubject,
          body: customBody,
          sender: customSender,
          senderName: customSenderName || customSender.split("@")[0],
          customApiKey,
        }),
      });

      if (!res.ok) throw new Error("Creation failed");
      const data = await res.json();

      toast.success("Custom Email Ingested & AI Triaged!", {
        description: `Predicted: ${data.email.category} | Urgency: ${data.email.urgencyScore}/100`,
      });

      setSelectedEmailId(data.email.id);
      setSimulatorOpen(false);
      router.push("/inbox");
    } catch (err) {
      toast.error("Failed to process custom email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Live Inbound Email Simulator</h2>
              <p className="text-xs text-zinc-400">
                Trigger enterprise email scenarios and inspect real-time AI classification & auto-routing
              </p>
            </div>
          </div>
          <button
            onClick={() => setSimulatorOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab("presets")}
            className={cn(
              "border-b-2 px-4 py-2.5 text-xs font-semibold transition",
              activeTab === "presets"
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            )}
          >
            Enterprise Scenarios (6 Ready Presets)
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={cn(
              "border-b-2 px-4 py-2.5 text-xs font-semibold transition",
              activeTab === "custom"
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            )}
          >
            Custom Raw Email Sandbox
          </button>
        </div>

        {/* Tab Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {activeTab === "presets" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PRESET_SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <div
                    key={scenario.key}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200",
                      scenario.border,
                      scenario.bg,
                      "hover:border-indigo-500/50 hover:bg-zinc-800/80"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-indigo-400" />
                          <span className="text-xs font-bold text-white">{scenario.title}</span>
                        </div>
                        <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                          {scenario.urgency}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{scenario.desc}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <span className="text-[10px] text-zinc-400 font-mono">{scenario.category}</span>
                      <button
                        disabled={loading}
                        onClick={() => handleSimulatePreset(scenario.key)}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        <span>Ingest & Triage</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-300">Sender Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@enterprise-customer.com"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-300">Sender Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={customSenderName}
                    onChange={(e) => setCustomSenderName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Bug: Payment Gateway Failing on iOS 18"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300">Email Body *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste or write the email body here. The AI engine will extract entities, calculate urgency, detect spam/threats, and recommend department routing..."
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSimulatorOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 text-cyan-300" />
                  )}
                  <span>Run Autonomous AI Triage</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
