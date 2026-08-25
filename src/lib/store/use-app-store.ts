"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EmailCategory, EmailItem, EmailStatus, PriorityLevel, SentimentType, User } from "@/types";
import { INITIAL_USERS } from "../data/mock-db";

interface AppState {
  // Current logged in persona
  currentUser: User;
  setCurrentUser: (user: User) => void;

  // Selected Email in Inbox
  selectedEmailId: string | null;
  setSelectedEmailId: (id: string | null) => void;

  // Filters for Inbox view
  filterCategory: EmailCategory | "ALL";
  setFilterCategory: (cat: EmailCategory | "ALL") => void;

  filterPriority: PriorityLevel | "ALL";
  setFilterPriority: (priority: PriorityLevel | "ALL") => void;

  filterStatus: EmailStatus | "ALL";
  setFilterStatus: (status: EmailStatus | "ALL") => void;

  filterDepartment: string | "ALL";
  setFilterDepartment: (deptId: string | "ALL") => void;

  filterSentiment: SentimentType | "ALL";
  setFilterSentiment: (sentiment: SentimentType | "ALL") => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & Panels
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  simulatorOpen: boolean;
  setSimulatorOpen: (open: boolean) => void;

  notificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;

  // Real-time live simulator active toggle
  liveStreamActive: boolean;
  setLiveStreamActive: (active: boolean) => void;

  // User configured custom API Key
  customApiKey: string;
  setCustomApiKey: (key: string) => void;

  // Notification count
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
  decrementUnreadNotificationCount: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: INITIAL_USERS[0],
      setCurrentUser: (user) => set({ currentUser: user }),

      selectedEmailId: "em-101",
      setSelectedEmailId: (id) => set({ selectedEmailId: id }),

      filterCategory: "ALL",
      setFilterCategory: (cat) => set({ filterCategory: cat }),

      filterPriority: "ALL",
      setFilterPriority: (priority) => set({ filterPriority: priority }),

      filterStatus: "ALL",
      setFilterStatus: (status) => set({ filterStatus: status }),

      filterDepartment: "ALL",
      setFilterDepartment: (deptId) => set({ filterDepartment: deptId }),

      filterSentiment: "ALL",
      setFilterSentiment: (sentiment) => set({ filterSentiment: sentiment }),

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      simulatorOpen: false,
      setSimulatorOpen: (open) => set({ simulatorOpen: open }),

      notificationCenterOpen: false,
      setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),

      liveStreamActive: false,
      setLiveStreamActive: (active) => set({ liveStreamActive: active }),

      customApiKey: "",
      setCustomApiKey: (key) => set({ customApiKey: key }),

      unreadNotificationCount: 3,
      setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),
      decrementUnreadNotificationCount: () =>
        set((state) => ({ unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1) })),
    }),
    {
      name: "inbox-iq-app-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        customApiKey: state.customApiKey,
        selectedEmailId: state.selectedEmailId,
      }),
    }
  )
);
