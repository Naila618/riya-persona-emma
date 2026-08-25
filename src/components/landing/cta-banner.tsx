import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-cyan-900/20 pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            <span>Ready for autonomous email intelligence?</span>
          </div>

          <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stop sorting emails manually. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Start triaging with AI today.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Deploy InboxIQ in under 5 minutes. Experience autonomous categorization, urgency scoring, threat detection, and 5-tone replies immediately.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inbox"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition hover:scale-[1.02]"
            >
              <span>Launch Unified Inbox</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/simulator"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Test Simulator Lab</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> No credit card required
            </span>
            <span>•</span>
            <span>Instant sandbox deployment</span>
            <span>•</span>
            <span>14-day full enterprise trial</span>
          </div>
        </div>
      </div>
    </section>
  );
}
