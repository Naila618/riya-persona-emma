"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Mail, Bot, CheckCircle2, Play } from "lucide-react";
import { LiveDemoWidget } from "./live-demo-widget";
import { useAppStore } from "@/lib/store/use-app-store";

export function Hero() {
  const { setSimulatorOpen } = useAppStore();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Announcement Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            <span>Next-Gen Enterprise Autonomous Email Triage 2.0</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span className="text-zinc-400 font-normal">Gemini & GPT-4o Powered</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn chaotic inbound email into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              instant intelligent action
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
            InboxIQ reads, categorizes, prioritizes, detects security risks, and auto-routes thousands of enterprise emails every minute—generating multi-tone smart replies in milliseconds.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inbox"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-[1.02]"
          >
            <span>Open Triage Hub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setSimulatorOpen(true)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Simulate Inbound Email</span>
          </button>
        </div>

        {/* Value Prop Micro Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>98.4% Classification Accuracy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>&lt;150ms Neural Triage Speed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Zero-Retention SOC-2 Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Gmail, Outlook & IMAP Native</span>
          </div>
        </div>

        {/* Live Interactive Demo Widget */}
        <div className="mt-14">
          <LiveDemoWidget />
        </div>
      </div>
    </section>
  );
}
