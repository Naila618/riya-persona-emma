"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  LayoutDashboard,
  BarChart3,
  Sliders,
  Settings,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  Shield,
  Zap,
  Flame,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { INITIAL_USERS } from "@/lib/data/mock-db";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "./notification-center";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const {
    setCommandPaletteOpen,
    setSimulatorOpen,
    unreadNotificationCount,
    liveStreamActive,
    setLiveStreamActive,
  } = useAppStore();

  const [notificationOpen, setNotificationOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  const navItems = [
    { label: "Inbox", href: "/inbox", icon: Inbox, badge: "Live" },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Rules & SLA", href: "/rules", icon: Sliders },
    { label: "Simulator", href: "/simulator", icon: Zap },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-30 blur group-hover:opacity-60 transition" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">InboxIQ</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  ENTERPRISE AI
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">Autonomous Triage & Routing</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/50"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-zinc-400")} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span>Search or command...</span>
            <kbd className="rounded border border-zinc-700 bg-zinc-800/90 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Simulate Email Trigger */}
          <button
            onClick={() => setSimulatorOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Simulate Email</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            {notificationOpen && <NotificationCenter onClose={() => setNotificationOpen(false)} />}
          </div>

          {/* Clerk Auth Integration */}
          <div className="flex items-center">
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 ring-1 ring-zinc-700",
                    userButtonPopoverCard: "bg-zinc-900 border-zinc-800",
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
