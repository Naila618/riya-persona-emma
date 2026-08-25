"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Send,
  Loader2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { runFallbackTriage } from "@/lib/ai/triage-engine";
import { AIPrediction, ReplyTone } from "@/types";
import { getPriorityColor, getSentimentBadge, getUrgencyGradient, cn } from "@/lib/utils";
import { toast } from "sonner";

const SAMPLE_DEMOS = [
  {
    title: "Database Outage Incident",
    subject: "URGENT: Production Postgres Pool Exhaustion on us-east-1",
    body: "Critical alert from Datadog: Connection pool at 99.8%. Over 800 HTTP 500 errors detected on /api/v2/checkout. Latency exceeded 4,500ms. Immediate failover required.",
    sender: "sre-lead@techscale.io",
    senderName: "Marcus Vance (SRE Lead)",
  },
  {
    title: "$380k Enterprise Deal",
    subject: "Enterprise Contract Renewal & 250 Additional Seats Request",
    body: "Hi team, We are ready to finalize our renewal for FY2026. Adding 250 seats across EMEA and APAC hubs bringing total ARR to $380,000. Please send over the updated MSA.",
    sender: "j.hastings@fintechcorp.global",
    senderName: "Jonathan Hastings",
  },
  {
    title: "Phishing Wire Request",
    subject: "Urgent: Wire Transfer Instruction Change for Invoice #INV-2026",
    body: "Accounts Team: Please remit invoice #INV-2026 ($184,500) to our new offshore Bank of Zurich account immediately. Do not send to previous Wells Fargo account.",
    sender: "cfo-office@vendor-spoof.cc",
    senderName: "Robert Sterling (Vendor CFO)",
  },
  {
    title: "Angry Customer Refund",
    subject: "Double Charge on Invoice #INV-8812 - Immediate Refund Demanded",
    body: "We were charged $24,900 twice today. If this is not refunded to our corporate Amex within 24 hours, we will initiate an immediate dispute and freeze our account.",
    sender: "elena.r@stratuscloud.ai",
    senderName: "Elena Rostova",
  },
];

export function LiveDemoWidget() {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ReplyTone>("Professional");

  const activeSample = SAMPLE_DEMOS[selectedSampleIndex];
  const [currentPrediction, setCurrentPrediction] = useState<AIPrediction>(() =>
    runFallbackTriage(SAMPLE_DEMOS[0])
  );

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setAnalyzing(true);
    setTimeout(() => {
      setCurrentPrediction(runFallbackTriage(SAMPLE_DEMOS[index]));
      setAnalyzing(false);
    }, 280);
  };

  const priorityMeta = getPriorityColor(currentPrediction.urgencyScore >= 85 ? "Critical" : currentPrediction.urgencyScore >= 65 ? "High" : "Medium");
  const sentimentMeta = getSentimentBadge(currentPrediction.sentiment);
  const urgencyMeta = getUrgencyGradient(currentPrediction.urgencyScore);

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
      {/* Glow Effect */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-3/4 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Interactive AI Triage Engine Demo</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Live Preview
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Click a scenario below to watch instant multi-vector classification</p>
          </div>
        </div>

        {/* Sample selector pills */}
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_DEMOS.map((sample, idx) => (
            <button
              key={sample.title}
              onClick={() => handleSelectSample(idx)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                selectedSampleIndex === idx
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              )}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Split Viewer */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Raw Inbound Email (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/60 pb-2.5">
              <span>INBOUND RAW EMAIL</span>
              <span className="text-zinc-400 font-mono">IMAP / Gmail API</span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="text-zinc-400">From: </span>
                <span className="text-zinc-200 font-medium">{activeSample.senderName}</span>{" "}
                <span className="text-zinc-400">&lt;{activeSample.sender}&gt;</span>
              </div>
              <div>
                <span className="text-zinc-400">Subject: </span>
                <span className="text-white font-semibold">{activeSample.subject}</span>
              </div>
            </div>

            <div className="mt-3.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 text-xs leading-relaxed text-zinc-300">
              {activeSample.body}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/50">
            <span>Latency: <strong className="text-emerald-400 font-mono">142ms</strong></span>
            <span>Accuracy Confidence: <strong className="text-indigo-400 font-mono">{currentPrediction.confidence}%</strong></span>
          </div>
        </div>

        {/* Right Col: Real-time AI Intel & Routing (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-indigo-500/20 bg-zinc-950/90 p-4 relative overflow-hidden">
          {analyzing && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Running neural classification...</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Top intelligence metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Urgency */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Urgency Score</span>
                <div className="mt-1 flex items-center justify-center gap-1 font-bold text-sm">
                  <Flame className={cn("h-4 w-4", urgencyMeta.color)} />
                  <span className={urgencyMeta.color}>{currentPrediction.urgencyScore}/100</span>
                </div>
              </div>

              {/* Sentiment */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Sentiment</span>
                <div className="mt-1 flex items-center justify-center gap-1 font-bold text-sm text-zinc-200">
                  <span>{sentimentMeta.icon}</span>
                  <span>{sentimentMeta.label}</span>
                </div>
              </div>

              {/* Auto Route Dept */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Auto Route</span>
                <div className="mt-1 font-bold text-sm text-indigo-400 truncate">
                  {currentPrediction.departmentRecommendation}
                </div>
              </div>

              {/* Spam & Security Risk */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Security Risk</span>
                <div className="mt-1 font-bold text-sm">
                  {currentPrediction.riskScore > 40 ? (
                    <span className="text-rose-400 flex items-center justify-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5" /> High Risk
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Clean
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Executive AI Summary
              </span>
              <p className="mt-1 text-xs text-zinc-200 leading-relaxed font-medium">{currentPrediction.summary}</p>
            </div>

            {/* Extracted Entities Chips */}
            {currentPrediction.entities.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Extracted Entities
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {currentPrediction.entities.map((ent, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300 font-mono"
                    >
                      <span className="text-[9px] uppercase text-cyan-400">{ent.label}:</span> {ent.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggested Reply Preview */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-[11px] font-bold text-white flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
                  Suggested Smart Reply
                </span>
                {/* Tone switcher */}
                <div className="flex gap-1">
                  {(["Professional", "Friendly", "Formal", "Short"] as ReplyTone[]).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-semibold transition",
                        selectedTone === tone
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-xs leading-relaxed text-zinc-300 whitespace-pre-line font-mono bg-zinc-950/60 p-2.5 rounded border border-zinc-800">
                {currentPrediction.suggestedReplies[selectedTone]}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
            <span>Routing Rule: <strong className="text-zinc-300">{currentPrediction.routingReasoning}</strong></span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentPrediction.suggestedReplies[selectedTone]);
                toast.success("Suggested reply copied to clipboard!");
              }}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
            >
              <Copy className="h-3 w-3" />
              <span>Copy Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
