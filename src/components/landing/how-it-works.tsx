import React from "react";
import { Mail, Cpu, ArrowRight, CheckCircle, ShieldCheck, Sparkles, Send } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Mail,
    title: "Continuous Ingestion & Parsing",
    desc: "Connect seamlessly to Gmail, Microsoft 365 Outlook, or generic IMAP servers. Real-time webhooks ingest incoming messages and attachments instantly.",
    highlight: "Zero inbox delay",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Multi-Vector AI Classification",
    desc: "Our neural model analyzes intent, calculates 0-100 urgency, detects sentiment, extracts named entities (amounts, order IDs), and screens for phishing vectors.",
    highlight: "<150ms processing",
  },
  {
    step: "03",
    icon: Send,
    title: "Automated Routing & Smart Drafting",
    desc: "Emails are assigned to the right team queue with SLA countdowns while 5 tailored smart reply drafts are generated and ready for 1-click dispatch.",
    highlight: "80% faster resolution",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From raw inbox to resolved ticket in 3 automated steps
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Eliminate hours of manual sorting and context switching with an autonomous pipeline.
          </p>
        </div>

        {/* Steps container */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl transition hover:border-indigo-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/25">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-black text-zinc-400 font-mono">{item.step}</span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
