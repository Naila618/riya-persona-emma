"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";
import {
  Zap,
  Sparkles,
  AlertTriangle,
  BadgeDollarSign,
  ShieldAlert,
  RotateCcw,
  Scale,
  UserCheck,
  Send,
  Loader2,
  CheckCircle2,
  Flame,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { runAITriage } from "@/lib/ai/triage-engine";
import { AIPrediction } from "@/types";
import { getPriorityColor, getSentimentBadge, getUrgencyGradient, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SimulatorPage() {
  const { customApiKey, liveStreamActive, setLiveStreamActive, setSelectedEmailId } = useAppStore();

  const [rawSubject, setRawSubject] = useState("");
  const [rawBody, setRawBody] = useState("");
  const [rawSender, setRawSender] = useState("enterprise.client@globex.org");
  const [rawSenderName, setRawSenderName] = useState("Alexandre Moreau");
  const [analyzing, setAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<AIPrediction | null>(null);

  const handleRunRawTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawSubject || !rawBody) {
      toast.error("Please fill in subject and body.");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: rawSubject,
          body: rawBody,
          sender: rawSender,
          senderName: rawSenderName,
          customApiKey,
        }),
      });

      if (!res.ok) throw new Error("Classification failed");
      const data = await res.json();
      setPredictionResult(data.prediction);
      toast.success("AI Triage Pipeline executed successfully!");
    } catch (e) {
      toast.error("Failed to run AI classification");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleIngestDirect = async () => {
    if (!rawSubject || !rawBody) return;
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: rawSubject,
          body: rawBody,
          sender: rawSender,
          senderName: rawSenderName,
          customApiKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedEmailId(data.email.id);
        toast.success("Email ingested into Live Queue!");
      }
    } catch (e) {
      toast.error("Ingestion failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI Ingestion & Triage Simulator Lab
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Interactive test bench for evaluating LLM classification accuracy, urgency scoring, entity extraction, and auto-routing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-md",
                liveStreamActive
                  ? "bg-emerald-500 text-black shadow-emerald-500/20"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", liveStreamActive ? "bg-black animate-ping" : "bg-zinc-500")} />
              <span>{liveStreamActive ? "Streaming Active (15s)" : "Start Ingestion Stream"}</span>
            </button>
          </div>
        </div>

        {/* Workbench Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Raw Input Sandbox (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-bold text-white">Raw Inbound Email Sandbox</h3>
              <p className="text-xs text-zinc-400">Paste or write any email to test AI decision boundaries</p>
            </div>

            <form onSubmit={handleRunRawTriage} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Sender Email</label>
                  <input
                    type="email"
                    value={rawSender}
                    onChange={(e) => setRawSender(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-300">Sender Name</label>
                  <input
                    type="text"
                    value={rawSenderName}
                    onChange={(e) => setRawSenderName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Bug: Payment Gateway Throws 500 on Checkout"
                  value={rawSubject}
                  onChange={(e) => setRawSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Email Message Body *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Paste or draft the email content here. The AI will extract monetary amounts, reference IDs, sentiment, urgency scores, and routing recommendations..."
                  value={rawBody}
                  onChange={(e) => setRawBody(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white leading-relaxed focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={analyzing}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
                >
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-cyan-300" />}
                  <span>Evaluate with AI Engine</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: AI Prediction Inspection (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-indigo-500/20 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">AI Neural Classification Inspection</h3>
                </div>
                {predictionResult && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                    Confidence: {predictionResult.confidence}%
                  </span>
                )}
              </div>

              {!predictionResult ? (
                <div className="py-24 text-center text-xs text-zinc-400 space-y-2">
                  <Sparkles className="h-8 w-8 text-indigo-400/50 mx-auto" />
                  <p className="font-bold text-zinc-300">Ready for evaluation</p>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                    Fill out the test form on the left or use a preset to inspect intent breakdown, entity extraction, and suggested replies.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4 animate-in fade-in duration-150">
                  {/* KPI Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400">Urgency</span>
                      <p className="mt-1 font-bold text-sm text-rose-400">{predictionResult.urgencyScore}/100</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400">Sentiment</span>
                      <p className="mt-1 font-bold text-sm text-zinc-200">{predictionResult.sentiment}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400">Department</span>
                      <p className="mt-1 font-bold text-sm text-indigo-400 truncate">{predictionResult.departmentRecommendation}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400">Threat Risk</span>
                      <p className="mt-1 font-bold text-sm text-emerald-400">{predictionResult.riskScore > 40 ? "⚠️ High" : "Clean"}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                      Executive AI Summary
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed">{predictionResult.summary}</p>
                  </div>

                  {/* Extracted Entities */}
                  {predictionResult.entities?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Extracted Entities (NER)
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {predictionResult.entities.map((ent, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-300"
                          >
                            <span className="text-[9px] uppercase font-bold text-cyan-400">{ent.label}:</span>
                            <span className="text-white">{ent.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Professional Reply */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Generated Smart Reply Draft
                    </span>
                    <div className="text-xs text-zinc-300 font-mono whitespace-pre-line leading-relaxed bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                      {predictionResult.suggestedReplies?.Professional}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {predictionResult && (
              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Ready to ingest into live queue?
                </span>
                <button
                  onClick={handleIngestDirect}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Ingest to Live Inbox</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
