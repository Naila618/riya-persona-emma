import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case "critical":
      return {
        badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        dot: "bg-rose-500",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.4)]",
        text: "text-rose-400",
      };
    case "high":
      return {
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        dot: "bg-amber-500",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
        text: "text-amber-400",
      };
    case "medium":
      return {
        badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
        dot: "bg-indigo-500",
        glow: "shadow-[0_0_12px_rgba(99,102,241,0.3)]",
        text: "text-indigo-400",
      };
    case "low":
    default:
      return {
        badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
        dot: "bg-zinc-400",
        glow: "shadow-none",
        text: "text-zinc-400",
      };
  }
}

export function getSentimentBadge(sentiment: string) {
  switch (sentiment?.toLowerCase()) {
    case "positive":
      return {
        label: "Positive",
        color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        icon: "😊",
      };
    case "neutral":
      return {
        label: "Neutral",
        color: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
        icon: "😐",
      };
    case "negative":
      return {
        label: "Negative",
        color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
        icon: "😟",
      };
    case "frustrated":
      return {
        label: "Frustrated",
        color: "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse",
        icon: "😡",
      };
    case "urgent":
      return {
        label: "Urgent",
        color: "bg-red-500/20 text-red-300 border-red-500/40",
        icon: "⚡",
      };
    default:
      return {
        label: sentiment || "Unknown",
        color: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
        icon: "💬",
      };
  }
}

export function getCategoryBadge(category: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Support: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
    Sales: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    Finance: { bg: "bg-emerald-500/10", text: "text-teal-400", border: "border-teal-500/20" },
    HR: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
    Technical: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    Complaint: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    Feedback: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    Marketing: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    Spam: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    Security: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
    Recruitment: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
    General: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" },
    Billing: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    Legal: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  };

  return map[category] || { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" };
}

export function getUrgencyGradient(score: number): {
  color: string;
  badgeBg: string;
  glow: string;
  label: string;
} {
  if (score >= 85) {
    return {
      color: "text-rose-500",
      badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      glow: "from-rose-500 to-red-600",
      label: "Critical Urgency",
    };
  }
  if (score >= 65) {
    return {
      color: "text-amber-500",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      glow: "from-amber-500 to-orange-600",
      label: "High Urgency",
    };
  }
  if (score >= 40) {
    return {
      color: "text-indigo-400",
      badgeBg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      glow: "from-indigo-500 to-purple-600",
      label: "Moderate Urgency",
    };
  }
  return {
    color: "text-zinc-400",
    badgeBg: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    glow: "from-zinc-500 to-zinc-600",
    label: "Low Urgency",
  };
}
