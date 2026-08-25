"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Plus, Loader2, User } from "lucide-react";
import { EmailItem } from "@/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";

interface InternalNotesProps {
  email: EmailItem;
  onNoteAdded: () => void;
}

export function InternalNotes({ email, onNoteAdded }: InternalNotesProps) {
  const { currentUser } = useAppStore();
  const [noteContent, setNoteContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/emails/${email.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: noteContent.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      setNoteContent("");
      toast.success("Internal note added to thread");
      onNoteAdded();
    } catch (err) {
      toast.error("Failed to add internal note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Internal Team Notes</h4>
            <p className="text-[10px] text-zinc-400">Private collaboration thread (hidden from sender)</p>
          </div>
        </div>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
          {email.notes?.length || 0} notes
        </span>
      </div>

      {/* Notes List */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {(!email.notes || email.notes.length === 0) ? (
          <p className="text-xs text-zinc-400 italic py-2 text-center">No internal notes on this ticket yet.</p>
        ) : (
          email.notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={note.userAvatar} alt={note.userName} className="h-5 w-5 rounded-full object-cover" />
                  <span className="font-semibold text-amber-300">{note.userName}</span>
                </div>
                <span className="text-[10px] text-zinc-400">{formatTimeAgo(note.createdAt)}</span>
              </div>
              <p className="mt-1.5 leading-relaxed text-zinc-200">{note.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-zinc-800/80">
        <input
          type="text"
          placeholder="Add an internal note or tag teammate (@alex)..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !noteContent.trim()}
          className="flex items-center gap-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-2 text-xs font-semibold hover:bg-amber-500/30 transition disabled:opacity-40"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          <span>Post</span>
        </button>
      </form>
    </div>
  );
}
