"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    badge: "Fast-Growing Startups",
    priceMonthly: 49,
    priceAnnual: 39,
    description: "Essential automated triage and smart routing for fast-moving teams.",
    features: [
      "Up to 5,000 inbound emails / mo",
      "5 Team Inboxes & Departments",
      "Intent & Urgency Scoring (0-100)",
      "Standard 5-Tone AI Replies",
      "Gmail & Outlook Integration",
      "Standard SLA Tracking",
      "99.9% Uptime SLA",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth Pro",
    badge: "Most Popular",
    priceMonthly: 199,
    priceAnnual: 159,
    description: "Advanced semantic intelligence, custom rules, and security threat detection.",
    features: [
      "Up to 50,000 inbound emails / mo",
      "Unlimited Departments & Queues",
      "Phishing & Fraud Risk Engine",
      "Custom Automation Rule Builder",
      "Named Entity Recognition (NER)",
      "Agent Performance Leaderboard",
      "Dedicated Slack / Teams Webhooks",
      "Priority 24/7 Support",
    ],
    cta: "Get Started Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    badge: "Scale & High Security",
    priceMonthly: 599,
    priceAnnual: 499,
    description: "Custom LLM fine-tuning, dedicated cloud instances, and compliance guarantees.",
    features: [
      "Unlimited inbound emails / mo",
      "Bring Your Own LLM / Gemini Key",
      "Custom SAML 2.0 SSO & SCIM",
      "HIPAA BAA & SOC 2 Type II",
      "Zero-Data Retention Guarantee",
      "Custom SLA Incident Workflows",
      "Dedicated Solutions Architect",
      "99.99% Guaranteed SLA",
    ],
    cta: "Contact Enterprise Sales",
    popular: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            TRANSPARENT PRICING
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictable plans designed to scale with your volume
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Deploy in minutes with zero setup friction. Switch between monthly and annual billing.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/90 p-1.5 backdrop-blur-xl">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                !annual ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition",
                annual ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              )}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => {
            const price = annual ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all duration-300",
                  tier.popular
                    ? "border-indigo-500/60 bg-gradient-to-b from-indigo-950/30 via-zinc-900/90 to-zinc-900 shadow-2xl shadow-indigo-500/10 lg:-translate-y-2"
                    : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3.5 py-1 text-[11px] font-bold text-white shadow-md">
                    ★ {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    {!tier.popular && (
                      <span className="text-[11px] font-medium text-zinc-400">{tier.badge}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">${price}</span>
                    <span className="text-xs text-zinc-400">/ seat / month</span>
                  </div>
                  {annual && (
                    <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
                      Billed annually (${price * 12}/yr)
                    </span>
                  )}

                  <div className="mt-6 space-y-3 border-t border-zinc-800/80 pt-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2.5">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/inbox"
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition shadow-md",
                      tier.popular
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25"
                        : "border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                    )}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
