"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";
import { Department, RoutingRule } from "@/types";
import {
  Sliders,
  Plus,
  Zap,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RulesPage() {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New rule state
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [conditionField, setConditionField] = useState<"category" | "urgencyScore" | "subject">("subject");
  const [conditionOperator, setConditionOperator] = useState<"equals" | "greater_than" | "contains">("contains");
  const [conditionValue, setConditionValue] = useState("");
  const [targetDeptId, setTargetDeptId] = useState("dept-support");
  const [targetPriority, setTargetPriority] = useState<"Critical" | "High" | "Medium" | "Low">("High");

  const fetchRules = async () => {
    try {
      const [rulesRes, deptsRes] = await Promise.all([
        fetch("/api/rules"),
        fetch("/api/departments"),
      ]);
      if (rulesRes.ok && deptsRes.ok) {
        const rulesData = await rulesRes.json();
        const deptsData = await deptsRes.json();
        setRules(rulesData.rules || []);
        setDepartments(deptsData.departments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleRule = async (ruleId: string) => {
    try {
      const res = await fetch("/api/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });
      if (res.ok) {
        const data = await res.json();
        setRules((prev) => prev.map((r) => (r.id === ruleId ? data.rule : r)));
        toast.success(`Rule "${data.rule.name}" is now ${data.rule.isActive ? "ACTIVE" : "PAUSED"}`);
      }
    } catch (e) {
      toast.error("Failed to toggle rule");
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !conditionValue) {
      toast.error("Please fill in rule name and condition value.");
      return;
    }

    const targetDept = departments.find((d) => d.id === targetDeptId) || departments[0];

    const createdRule: RoutingRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      description: newRuleDesc || `If ${conditionField} ${conditionOperator} "${conditionValue}" -> Route to ${targetDept?.name}`,
      conditionField,
      conditionOperator,
      conditionValue,
      targetDepartmentId: targetDeptId,
      targetDepartmentName: targetDept?.name || "Customer Support",
      targetPriority,
      isActive: true,
      matchedCount: 0,
    };

    setRules((prev) => [createdRule, ...prev]);
    toast.success("New Automation Rule Created & Activated!");
    setShowCreateModal(false);
    setNewRuleName("");
    setNewRuleDesc("");
    setConditionValue("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Automation & Routing Rules Engine
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Configure conditional logic, department routing targets, priority escalations, and auto-assignments
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Routing Rule</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-xs text-zinc-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span>Loading automation rules...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-200">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl shadow-xl transition-all duration-200",
                  rule.isActive
                    ? "border-zinc-800 bg-zinc-900/80 hover:border-indigo-500/40"
                    : "border-zinc-800/40 bg-zinc-950/50 opacity-60"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <Sliders className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{rule.name}</h3>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Matched: <strong className="text-indigo-400">{rule.matchedCount} times</strong>
                        </span>
                      </div>
                    </div>

                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition",
                        rule.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      )}
                    >
                      {rule.isActive ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Paused</span>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-400">{rule.description}</p>

                  {/* Condition & Action Chips */}
                  <div className="mt-4 space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 font-mono">
                        IF
                      </span>
                      <span className="text-zinc-300 font-medium font-mono">
                        {rule.conditionField} {rule.conditionOperator} &ldquo;{rule.conditionValue}&rdquo;
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">
                        THEN
                      </span>
                      <span className="text-zinc-300 font-medium">
                        Route to <strong className="text-white">{rule.targetDepartmentName}</strong>
                        {rule.targetPriority && (
                          <> with <strong className="text-amber-400 font-bold">{rule.targetPriority}</strong> Priority</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Execution: <strong className="text-zinc-300">Synchronous on ingest</strong></span>
                  <span className="text-zinc-400 font-mono">Rule ID: {rule.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Rule Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
            <div
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Create Automation Routing Rule</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-300">Rule Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chargeback Alert Fast-Track"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300">Description</label>
                  <input
                    type="text"
                    placeholder="Brief explanation of when this rule fires..."
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Condition settings */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-3">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider block">IF Condition</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-zinc-400">Field</label>
                      <select
                        value={conditionField}
                        onChange={(e) => setConditionField(e.target.value as any)}
                        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-white"
                      >
                        <option value="subject">Subject Line</option>
                        <option value="category">Category</option>
                        <option value="urgencyScore">Urgency Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400">Operator</label>
                      <select
                        value={conditionOperator}
                        onChange={(e) => setConditionOperator(e.target.value as any)}
                        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-white"
                      >
                        <option value="contains">Contains</option>
                        <option value="equals">Equals</option>
                        <option value="greater_than">Greater Than</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400">Condition Value *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. chargeback, refund, outage, 80"
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                {/* Target action */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-3">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">THEN Action</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-zinc-400">Target Department</label>
                      <select
                        value={targetDeptId}
                        onChange={(e) => setTargetDeptId(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-white"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400">Set Priority</label>
                      <select
                        value={targetPriority}
                        onChange={(e) => setTargetPriority(e.target.value as any)}
                        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-white"
                      >
                        <option value="Critical">🔥 Critical</option>
                        <option value="High">⚡ High</option>
                        <option value="Medium">● Medium</option>
                        <option value="Low">○ Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-500 shadow-md"
                  >
                    Create & Activate Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
