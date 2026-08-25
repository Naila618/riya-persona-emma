import React from "react";
import { Star, ShieldCheck, CheckCircle } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "InboxIQ reduced our Tier-1 triage latency from 3.5 hours to under 4 minutes. Critical outage alerts and high-value sales deals no longer get buried in the noise.",
    author: "Danielle Thorne",
    role: "VP of Global Customer Experience",
    company: "FinScale Technologies",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    stats: "92% faster first-response time",
  },
  {
    quote: "The phishing threat shield caught three targeted executive wire fraud attacks that bypassed our standard email gateway filters. It paid for itself on day one.",
    author: "Harrison Brooks",
    role: "Chief Information Security Officer",
    company: "Aegis Health Systems",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    stats: "Zero security breaches in 18 months",
  },
  {
    quote: "Our support agents love the 5-tone AI suggested replies. They spend their time solving intricate engineering problems rather than re-typing repetitive status updates.",
    author: "Elena Rostova",
    role: "Director of Technical Support",
    company: "CloudVanguard SaaS",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    stats: "4.95 / 5.00 CSAT Score",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
            ENTERPRISE TRUST
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by mission-critical engineering & support teams
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Leading FinTech, Healthcare, and SaaS scale-ups rely on InboxIQ to safeguard SLAs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-xl transition hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-zinc-300 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.author} className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-700" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.author}</h4>
                    <p className="text-[11px] text-zinc-400">{t.role} • {t.company}</p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>{t.stats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
