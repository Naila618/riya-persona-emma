"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Clock, DollarSign, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export function RoiCalculator() {
  const [emailsPerDay, setEmailsPerDay] = useState(1500);
  const [teamSize, setTeamSize] = useState(12);

  // Math calculations
  // Average manual reading, categorizing, routing and drafting takes ~4.5 minutes per email
  // With InboxIQ autonomous triage & smart reply drafting, manual triage drops to ~0.7 minutes
  const minutesSavedPerEmail = 3.8;
  const monthlyEmails = emailsPerDay * 22; // 22 work days
  const totalHoursSavedMonthly = Math.round((monthlyEmails * minutesSavedPerEmail) / 60);

  // Average blended cost per support/ops hour ($38/hr)
  const hourlyCost = 38;
  const monthlyDollarSavings = totalHoursSavedMonthly * hourlyCost;
  const annualSavings = monthlyDollarSavings * 12;

  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            ENTERPRISE ROI CALCULATOR
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate your organization&apos;s time and operational savings
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            See how much manual triage overhead your team eliminates with autonomous classification.
          </p>
        </div>

        {/* Calculator Widget Box */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-200">
                  <span>Daily Inbound Email Volume</span>
                  <span className="text-indigo-400 font-mono text-sm">{emailsPerDay.toLocaleString()} emails/day</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={emailsPerDay}
                  onChange={(e) => setEmailsPerDay(Number(e.target.value))}
                  className="mt-3 w-full accent-indigo-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>200</span>
                  <span>5,000</span>
                  <span>10,000+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-200">
                  <span>Support / Ops Team Size</span>
                  <span className="text-purple-400 font-mono text-sm">{teamSize} Specialists</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="mt-3 w-full accent-purple-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>2 Agents</span>
                  <span>50 Agents</span>
                  <span>100+ Agents</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-300 font-medium">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Assumptions factored:</span>
                </div>
                <p>• 3.8 minutes saved per inbound email via automated classification & routing.</p>
                <p>• $38/hr blended enterprise specialist loaded compensation.</p>
              </div>
            </div>

            {/* Results Callout */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-purple-950/40 p-6 sm:p-7 shadow-xl flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    Estimated Monthly Operational Savings
                  </span>
                  <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center gap-2">
                    <span className="text-emerald-400">{formatCurrency(monthlyDollarSavings)}</span>
                    <span className="text-xs text-zinc-400 font-sans font-normal">/ month</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80">
                  <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-400" /> Hours Saved / Mo
                    </span>
                    <p className="mt-1 text-xl font-bold text-white font-mono">
                      {totalHoursSavedMonthly.toLocaleString()} hrs
                    </p>
                  </div>

                  <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-emerald-400" /> Annual ROI
                    </span>
                    <p className="mt-1 text-xl font-bold text-emerald-400 font-mono">
                      {formatCurrency(annualSavings)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <Link
                  href="/inbox"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition"
                >
                  <span>Start Automating Inbound Triage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
