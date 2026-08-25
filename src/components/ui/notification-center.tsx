"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, X, AlertTriangle, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { NotificationItem } from "@/types";
import { formatTimeAgo, cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/use-app-store";

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedEmailId, setUnreadNotificationCount } = useAppStore();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotificationCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadNotificationCount(Math.max(0, notifications.filter((n) => !n.isRead && n.id !== id).length));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PRIORITY_CHANGED":
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case "AI_CLASSIFIED":
        return <ShieldCheck className="h-4 w-4 text-indigo-400" />;
      default:
        return <Mail className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Live Notifications</h3>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
            {notifications.filter((n) => !n.isRead).length} new
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            title="Mark all read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">Loading updates...</div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">No new notifications</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.isRead) markSingleRead(item.id);
                if (item.emailId) setSelectedEmailId(item.emailId);
              }}
              className={cn(
                "group relative flex cursor-pointer gap-3 rounded-xl p-3 text-xs transition border",
                item.isRead
                  ? "border-transparent bg-zinc-950/40 text-zinc-400 hover:bg-zinc-800/40"
                  : "border-indigo-500/20 bg-indigo-950/20 text-zinc-200 hover:bg-indigo-950/30"
              )}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80">
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white truncate">{item.title}</p>
                  <span className="text-[10px] text-zinc-400">{formatTimeAgo(item.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400 line-clamp-2">{item.description}</p>
                {item.emailId && (
                  <Link
                    href="/inbox"
                    onClick={onClose}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>View in Inbox</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              {!item.isRead && (
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
