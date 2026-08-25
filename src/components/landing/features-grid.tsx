import React from "react";
import {
  BrainCircuit,
  ShieldAlert,
  Flame,
  MessageSquareReply,
  Workflow,
  Sparkles,
  Search,
  Gauge,
  Layers,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Semantic Intent & NER Engine",
    description: "Detects 14+ enterprise categories, intent taxonomies, and extracts named entities (monetary amounts, order IDs, invoice numbers, dates) automatically.",
    badge: "Multi-Vector AI",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Flame,
    title: "Urgency Score & SLA Radar",
    description: "Calculates an exact 0-100 urgency index factoring sentiment, SLA timers, customer churn probability, and revenue at risk.",
    badge: "Real-Time SLAs",
    color: "from-amber-500 to-rose-500",
  },
  {
    icon: ShieldAlert,
    title: "Phishing & Threat Shield",
    description: "Detects spear-phishing wire modifications, suspicious offshore payment details, credential harvesting links, and malware payloads.",
    badge: "Zero-Trust Security",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: MessageSquareReply,
    title: "5-Tone Contextual Smart Replies",
    description: "Instantly draft Professional, Friendly, Formal, Short, or Detailed responses pre-populated with customer metadata and CRM context.",
    badge: "One-Click Dispatch",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Workflow,
    title: "Autonomous Department Routing",
    description: "Smart rules and AI match inbound tickets to Support, Sales, Finance, HR, Security, or Legal queues without human bottleneck.",
    badge: "Zero-Touch Routing",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Gauge,
    title: "Executive SLA & Agent Analytics",
    description: "Deep analytics tracking hourly email velocity, department workload distributions, SLA breach warnings, and agent resolution leaderboards.",
    badge: "Full Observability",
    color: "from-purple-500 to-pink-500",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            ENTERPRISE CAPABILITIES
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for high-volume enterprise operations
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Eliminate triage lag and prioritize critical revenue and security incidents with autonomous AI intelligence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white transition group-hover:scale-110">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 border border-zinc-700/60">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{feature.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition">
                  <span>Explore capability</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
