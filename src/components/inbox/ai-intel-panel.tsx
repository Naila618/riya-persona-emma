"use client";

import React from "react";
import {
  Sparkles,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Hash,
  Cpu,
} from "lucide-react";
import { AIPrediction, EmailItem } from "@/types";
import { getPriorityColor, getSentimentBadge, getUrgencyGradient, cn } from "@/lib/utils";

interface AIIntelPanelProps {
  email: EmailItem;
}

export function AIIntelPanel({ email }: AIIntelPanelProps) {
  const prediction: AIPrediction | undefined = email.aiPrediction;
  if (!prediction) return null;

  const urgencyMeta = getUrgencyGradient(prediction.urgencyScore || email.urgencyScore);
  const sentimentMeta = getSentimentBadge(prediction.sentiment || email.sentiment);
  const priorityMeta = getPriorityColor(email.priority);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-zinc-950/70 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Intelligence Intel</h4>
            <p className="text-[10px] text-zinc-400">Autonomous multi-vector analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-500/20">
          <Cpu className="h-3 w-3" />
          <span>{prediction.confidence}% Confidence</span>
        </div>
      </div>

      {/* Security Threat Banner if High Risk */}
      {prediction.riskScore > 40 && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 animate-pulse-glow">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <span>SECURITY WARNING: Potential Threat Detected</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-200/90">
            {prediction.riskFlags?.length ? prediction.riskFlags.join(". ") : "Suspicious transaction or phishing vector flagged by heuristic security analyzer."}
          </p>
        </div>
      )}

      {/* KPI Matrix: Urgency, Sentiment, Spam, Intent */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Urgency Gauge */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Urgency Level</span>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Flame className={cn("h-4 w-4 shrink-0", urgencyMeta.color)} />
            <span className={cn("font-bold text-sm", urgencyMeta.color)}>
              {prediction.urgencyScore}/100
            </span>
          </div>
          <span className="mt-1 text-[9px] text-zinc-400 font-medium truncate">{urgencyMeta.label}</span>
        </div>

        {/* Sentiment */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Sentiment</span>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-base">{sentimentMeta.icon}</span>
            <span className="font-bold text-xs text-zinc-200 truncate">{sentimentMeta.label}</span>
          </div>
          <span className="mt-1 text-[9px] text-zinc-400">Emotional state</span>
        </div>

        {/* Spam Probability */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Spam Score</span>
          <div className="mt-1.5 flex items-center gap-1 font-bold text-xs font-mono">
            {prediction.spamScore > 0.6 ? (
              <span className="text-rose-400">{(prediction.spamScore * 100).toFixed(0)}% (Spam)</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Clean
              </span>
            )}
          </div>
          <span className="mt-1 text-[9px] text-zinc-400">Bayesian check</span>
        </div>

        {/* Detected Intent */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Classified Intent</span>
          <div className="mt-1.5 font-mono text-[11px] font-bold text-indigo-400 truncate">
            {prediction.intent}
          </div>
          <span className="mt-1 text-[9px] text-zinc-400">Semantic taxonomy</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Executive Summary</span>
        </span>
        <p className="text-xs leading-relaxed text-zinc-200">{prediction.summary}</p>

        {prediction.summaryBullets && prediction.summaryBullets.length > 0 && (
          <ul className="mt-2 space-y-1 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
            {prediction.summaryBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Extracted Entities */}
      {prediction.entities && prediction.entities.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Extracted Key Entities (NER)
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {prediction.entities.map((ent, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-300"
              >
                <span className="text-[10px] uppercase font-bold text-cyan-400">{ent.label}:</span>
                <span className="font-semibold text-white">{ent.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Tags */}
      {prediction.keywords && prediction.keywords.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Extracted Keywords
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {prediction.keywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
              >
                <Tag className="h-2.5 w-2.5 text-zinc-400" />
                <span>{kw}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Auto Routing Reasoning */}
      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
        <span>Routing Reasoning: <strong className="text-zinc-300">{prediction.routingReasoning}</strong></span>
      </div>
    </div>
  );
}
