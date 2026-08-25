import React from "react";
import Link from "next/link";
import { Sparkles, Shield, CheckCircle, Cpu, Zap, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          {/* Col 1: Brand & Status */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">InboxIQ</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enterprise Autonomous Email Triage, Semantic Intent Classification, SLA Intelligence & Multi-Tone Routing.
            </p>
            {/* Live Operational Health Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>All AI Engines Operational • 99.99% SLA</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Platform</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/inbox" className="hover:text-white transition">
                  Unified Triage Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition">
                  SLA & Team Analytics
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-white transition">
                  Automation Rule Builder
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-white transition">
                  Ingestion Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Intelligence Engine */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">AI Intelligence</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-indigo-400" />
                <span>Intent & Entity Recognition</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-indigo-400" />
                <span>Dynamic Urgency Scoring (0-100)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-indigo-400" />
                <span>Phishing & Fraud Risk Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-indigo-400" />
                <span>5-Tone Contextual Smart Replies</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-indigo-400" />
                <span>Gemini API & Multi-Model Support</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Security & Compliance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Security & Trust</h4>
            <p className="text-xs text-zinc-400">
              Engineered with zero-retention data privacy guarantees and end-to-end audit compliance.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-mono text-zinc-300">
                SOC 2 Type II
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-mono text-zinc-300">
                GDPR Ready
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-mono text-zinc-300">
                HIPAA BAA
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-mono text-zinc-300">
                256-Bit TLS
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-xs text-zinc-400 gap-4">
          <p>© 2026 InboxIQ Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:text-zinc-400 transition">
              Settings & API Keys
            </Link>
            <Link href="/rules" className="hover:text-zinc-400 transition">
              Routing Engine
            </Link>
            <Link href="/inbox" className="hover:text-zinc-400 transition">
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
