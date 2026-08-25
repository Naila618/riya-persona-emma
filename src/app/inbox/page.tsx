"use client";

import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { InboxLayout } from "@/components/inbox/inbox-layout";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";

export default function InboxPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <InboxLayout />
      </main>
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
