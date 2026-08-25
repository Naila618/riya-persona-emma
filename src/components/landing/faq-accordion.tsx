"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does InboxIQ classify emails without human intervention?",
    a: "InboxIQ uses state-of-the-art Large Language Models (Gemini 1.5 Flash / GPT-4o) combined with a deterministic heuristic intent engine. When an email arrives, our pipeline tokenizes the text, evaluates semantic intent, extracts monetary and order entities, runs a Bayesian spam/phishing risk model, and assigns an urgency index (0-100) in under 150ms.",
  },
  {
    q: "Can we connect our existing Gmail or Outlook accounts?",
    a: "Yes. InboxIQ supports native Google Workspace OAuth 2.0, Microsoft 365 Exchange APIs, and standard TLS IMAP/SMTP connections. We also provide inbound webhook endpoints for programmatic ingestion from custom email relays (SendGrid, Postmark, AWS SES).",
  },
  {
    q: "How does the AI generate 5 distinct tone replies?",
    a: "For every triaged email, our smart reply engine contextualizes the sender's tone and urgency. It crafts 5 response variations: Professional (balanced corporate), Friendly (warm & personable), Formal (strictly compliant with ticket ID), Short (2-sentence status), and Detailed (action items roadmap). Agents can edit with 1-click before sending.",
  },
  {
    q: "Is customer data stored or used to train public models?",
    a: "No. InboxIQ enforces strict zero-data retention policies with our LLM inference providers. Your emails, attachments, and internal notes are never used for model training or shared with third parties. All transit and at-rest storage is encrypted with AES-256 and TLS 1.3.",
  },
  {
    q: "Can we configure custom routing rules and SLA timers?",
    a: "Absolutely. With our visual Rule Builder, you can define conditional logic (e.g. IF Category is 'Security' AND Urgency > 80 THEN Route to 'Cyber Security Ops' and Set Priority to 'Critical'). Each department maintains customizable SLA timers and breach escalation workflows.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 border-t border-zinc-800/80 bg-zinc-950/70">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything you need to know about InboxIQ
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "border-indigo-500/40 bg-zinc-900 shadow-lg"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-zinc-400 transition-transform duration-200",
                      isOpen && "rotate-180 text-indigo-400"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-zinc-400 border-t border-zinc-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
