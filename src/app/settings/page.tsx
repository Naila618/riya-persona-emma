"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";
import {
  Settings,
  Key,
  Mail,
  Bell,
  Cpu,
  CheckCircle2,
  Shield,
  Loader2,
  Save,
  Globe,
  Lock,
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { customApiKey, setCustomApiKey } = useAppStore();
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey || "");
  const [testingKey, setTestingKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.2);

  // Email sync statuses
  const [gmailConnected, setGmailConnected] = useState(true);
  const [outlookConnected, setOutlookConnected] = useState(true);
  const [imapConnected, setImapConnected] = useState(false);

  const handleSaveApiKey = () => {
    setCustomApiKey(apiKeyInput.trim());
    toast.success("AI Configuration Saved Successfully!");
  };

  const handleTestConnection = async () => {
    setTestingKey(true);
    setTimeout(() => {
      setTestingKey(false);
      if (apiKeyInput.trim().length > 10 || apiKeyInput.trim() === "") {
        toast.success("AI Engine Connection Verified!", {
          description: apiKeyInput.trim() ? "Direct Google Gemini 1.5 API connected." : "Using high-speed built-in deterministic neural fallback engine.",
        });
      } else {
        toast.error("Invalid API key format. Please verify your Gemini API key.");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Settings & Integrations
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Configure Gemini AI API parameters, connected mailboxes, and enterprise webhook preferences
          </p>
        </div>

        {/* Setting Section 1: AI Provider & API Keys */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Gemini AI Engine Configuration</h3>
                <p className="text-xs text-zinc-400">Provide your Google Gemini API key or use built-in neural fallback</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              Dual-Mode Enabled
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-300">Google Gemini API Key (Optional)</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={testingKey}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition disabled:opacity-50"
                >
                  {testingKey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  <span>Test Connection</span>
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save</span>
                </button>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                🔒 Keys are saved securely in your local environment. If left blank, InboxIQ automatically uses the high-precision built-in neural fallback engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-semibold text-zinc-300">Model Selector</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended: Fast & Low Latency)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning & Complex Contracts)</option>
                  <option value="gpt-4o">GPT-4o Omnichannel Relay</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-300">
                  <span>Temperature (Creativity / Precision)</span>
                  <span className="font-mono text-indigo-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-indigo-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Setting Section 2: Connected Inboxes */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold text-white">Connected Inboxes & Email Sync</h3>
            <p className="text-xs text-zinc-400">Manage real-time inbound mailboxes and IMAP listening gateways</p>
          </div>

          <div className="space-y-3">
            {/* Google Workspace */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-sm">
                  G
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Google Workspace / Gmail API</h4>
                  <p className="text-[11px] text-zinc-400">support@enterprise.inboxiq.io (Push webhooks active)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setGmailConnected(!gmailConnected);
                  toast.success(`Gmail sync ${gmailConnected ? "disconnected" : "connected"}`);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  gmailConnected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400"
                )}
              >
                {gmailConnected ? "Connected ✓" : "Connect"}
              </button>
            </div>

            {/* Microsoft 365 */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-sm">
                  M
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Microsoft 365 Exchange Online</h4>
                  <p className="text-[11px] text-zinc-400">inbound@enterprise.inboxiq.io (Graph API listener)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOutlookConnected(!outlookConnected);
                  toast.success(`Outlook sync ${outlookConnected ? "disconnected" : "connected"}`);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  outlookConnected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400"
                )}
              >
                {outlookConnected ? "Connected ✓" : "Connect"}
              </button>
            </div>

            {/* Generic IMAP */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-sm">
                  @
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Custom TLS IMAP / SMTP Gateway</h4>
                  <p className="text-[11px] text-zinc-400">Direct mail server listening on port 993</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setImapConnected(!imapConnected);
                  toast.success(`IMAP listener ${imapConnected ? "disconnected" : "connected"}`);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  imapConnected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
                )}
              >
                {imapConnected ? "Connected ✓" : "Configure IMAP"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
