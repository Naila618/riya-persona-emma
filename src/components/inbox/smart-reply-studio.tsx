"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Wand2,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Copy,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { EmailItem, ReplyTone } from "@/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SmartReplyStudioProps {
  email: EmailItem;
  onReplySent: () => void;
}

export function SmartReplyStudio({ email, onReplySent }: SmartReplyStudioProps) {
  const { currentUser, customApiKey } = useAppStore();
  const [selectedTone, setSelectedTone] = useState<ReplyTone>("Professional");
  const [replyText, setReplyText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [autoResolve, setAutoResolve] = useState(true);

  // Sync with AI predicted reply on tone switch or email selection
  useEffect(() => {
    if (email.aiPrediction?.suggestedReplies?.[selectedTone]) {
      setReplyText(email.aiPrediction.suggestedReplies[selectedTone]);
    } else {
      setReplyText(`Hi ${email.senderName?.split(" ")[0] || "there"},\n\nThank you for reaching out regarding "${email.subject}". We are reviewing the details and will follow up shortly.\n\nBest regards,\n${currentUser.name}`);
    }
  }, [email, selectedTone, currentUser.name]);

  const handleGenerateCustom = async () => {
    if (!customPrompt) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: email.subject,
          emailBody: email.body,
          senderName: email.senderName,
          tone: selectedTone,
          customPrompt,
          customApiKey,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate custom reply");
      const data = await res.json();
      setReplyText(data.reply);
      toast.success("AI refined reply with your instructions!");
      setShowCustomPrompt(false);
      setCustomPrompt("");
    } catch (err) {
      toast.error("Failed to generate AI reply");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Reply content cannot be empty.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/emails/${email.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: replyText,
          tone: selectedTone,
          aiGenerated: true,
          autoResolve,
        }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      // Trigger Confetti effect on resolution!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#6366F1", "#8B5CF6", "#06B6D4", "#22C55E"],
      });

      toast.success("Reply Dispatched Successfully!", {
        description: autoResolve
          ? "Ticket marked as RESOLVED and audit logged."
          : "Reply recorded on activity timeline.",
      });

      onReplySent();
    } catch (err) {
      toast.error("Failed to dispatch reply");
    } finally {
      setSending(false);
    }
  };

  const insertVariable = (variableKey: string) => {
    let value = "";
    switch (variableKey) {
      case "CustomerName":
        value = email.senderName || "Valued Customer";
        break;
      case "TicketID":
        value = `#TICK-${email.id.toUpperCase()}`;
        break;
      case "AgentName":
        value = currentUser.name;
        break;
      case "Department":
        value = email.departmentName || "Support";
        break;
      default:
        value = "";
    }
    setReplyText((prev) => `${prev} ${value}`);
  };

  const tones: ReplyTone[] = ["Professional", "Friendly", "Formal", "Short", "Detailed"];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
            <Zap className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Smart Reply Studio</h4>
            <p className="text-[10px] text-zinc-400">Context-aware multi-tone suggestions</p>
          </div>
        </div>

        {/* Tone Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-zinc-950 p-1 border border-zinc-800">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => setSelectedTone(tone)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                selectedTone === tone
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Variable pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-400">Insert:</span>
        <button
          onClick={() => insertVariable("CustomerName")}
          className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-zinc-300 hover:border-indigo-500 hover:text-white transition"
        >
          + Customer Name
        </button>
        <button
          onClick={() => insertVariable("TicketID")}
          className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-zinc-300 hover:border-indigo-500 hover:text-white transition"
        >
          + Ticket ID
        </button>
        <button
          onClick={() => insertVariable("AgentName")}
          className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-zinc-300 hover:border-indigo-500 hover:text-white transition"
        >
          + My Signature
        </button>

        <button
          onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          className="ml-auto flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>AI Rewrite Prompt</span>
        </button>
      </div>

      {/* Custom AI Prompt Input */}
      {showCustomPrompt && (
        <div className="flex gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-2.5 animate-in fade-in zoom-in-95">
          <input
            type="text"
            placeholder="e.g. Apologize sincerely, mention we credit $100, and expedite ticket..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            disabled={generating || !customPrompt}
            onClick={handleGenerateCustom}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            <span>Apply</span>
          </button>
        </div>
      )}

      {/* Rich Textarea */}
      <div className="relative">
        <textarea
          rows={6}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5 text-xs text-zinc-100 font-sans leading-relaxed placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          placeholder="Compose or edit reply..."
        />
      </div>

      {/* Bottom Dispatch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-zinc-800/80">
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={autoResolve}
            onChange={(e) => setAutoResolve(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
          />
          <span>Mark ticket as RESOLVED upon dispatch</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(replyText);
              toast.success("Reply text copied!");
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={sending}
            onClick={handleSendReply}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Send & {autoResolve ? "Resolve" : "Update"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
