"use client";

import { useEffect, useState } from "react";
import MoodPicker from "./MoodPicker";

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function EntryEditor({
  entry,
  isNew,
  onSave,
  onDelete,
  onTogglePin,
  onCancelNew,
  saving,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("okay");
  const [tagsInput, setTagsInput] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setContent(entry.content || "");
      setMood(entry.mood || "okay");
      setTagsInput((entry.tags || []).join(", "));
      setEntryDate(new Date(entry.entryDate).toISOString().slice(0, 10));
    } else {
      setTitle("");
      setContent("");
      setMood("okay");
      setTagsInput("");
      setEntryDate(new Date().toISOString().slice(0, 10));
    }
    setDirty(false);
  }, [entry?._id, isNew]);

  const handleSave = () => {
    if (!content.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ title: title.trim() || "Untitled entry", content, mood, tags, entryDate });
    setDirty(false);
  };

  const markDirty = (setter) => (e) => {
    setter(e.target.value);
    setDirty(true);
  };

  if (!entry && !isNew) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-brass">
            A blank page
          </p>
          <h2 className="font-display text-2xl">
            Select an entry, or start a new one
          </h2>
          <p className="text-sm text-parchment-muted dark:text-ink-muted max-w-xs">
            Your entries are private and searchable — nothing here leaves
            your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="border-b border-parchment-border dark:border-ink-border p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <input
            value={title}
            onChange={markDirty(setTitle)}
            placeholder="Entry title (optional)"
            className="font-display text-2xl sm:text-3xl bg-transparent outline-none flex-1 min-w-0 placeholder:text-parchment-muted/60 dark:placeholder:text-ink-muted/60"
          />
          <div className="flex items-center gap-2 shrink-0">
            {entry && (
              <button
                onClick={() => onTogglePin(entry)}
                title={entry.pinned ? "Unpin" : "Pin entry"}
                className={`h-9 w-9 flex items-center justify-center rounded-md border transition-colors ${
                  entry.pinned
                    ? "border-brass text-brass"
                    : "border-parchment-border dark:border-ink-border text-parchment-muted dark:text-ink-muted hover:border-brass"
                }`}
              >
                &#9733;
              </button>
            )}
            {entry && (
              <button
                onClick={() => onDelete(entry)}
                title="Delete entry"
                className="h-9 w-9 flex items-center justify-center rounded-md border border-parchment-border dark:border-ink-border text-rust hover:border-rust transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <MoodPicker value={mood} onChange={(v) => { setMood(v); setDirty(true); }} />
          <input
            type="date"
            value={entryDate}
            onChange={markDirty(setEntryDate)}
            className="font-mono text-xs bg-parchment-surface2 dark:bg-ink-surface2 border border-parchment-border dark:border-ink-border rounded-md px-2 py-1.5 outline-none focus:border-brass"
          />
          <input
            value={tagsInput}
            onChange={markDirty(setTagsInput)}
            placeholder="tags, comma separated"
            className="flex-1 min-w-[140px] font-mono text-xs bg-parchment-surface2 dark:bg-ink-surface2 border border-parchment-border dark:border-ink-border rounded-md px-2 py-1.5 outline-none focus:border-brass placeholder:text-parchment-muted dark:placeholder:text-ink-muted"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin border-l-2 border-brass/30">
        <textarea
          value={content}
          onChange={markDirty(setContent)}
          placeholder="Write what's on your mind..."
          className="w-full h-full min-h-[50dvh] resize-none whitespace-pre-wrap break-words bg-transparent outline-none px-6 sm:px-10 py-4 text-[15px] leading-relaxed text-parchment-text dark:text-ink-text placeholder:text-parchment-muted/60 dark:placeholder:text-ink-muted/60"
        />
      </div>

      <div
        className="border-t border-parchment-border dark:border-ink-border p-3 flex items-center justify-between gap-3 shrink-0"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <span className="font-mono text-[11px] text-parchment-muted dark:text-ink-muted">
          {wordCount(content)} words
          {!content.trim() && (
            <span className="ml-2 text-rust">— write something to save</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {isNew && (
            <button
              onClick={onCancelNew}
              className="text-sm px-4 py-2 rounded-md border border-parchment-border dark:border-ink-border text-parchment-muted dark:text-ink-muted hover:border-rust hover:text-rust transition-colors"
            >
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving || (!dirty && !isNew)}
            title={!content.trim() ? "Write something in the entry first" : undefined}
            className="text-sm px-4 py-2 rounded-md bg-brass hover:bg-brass-light disabled:opacity-40 disabled:cursor-not-allowed text-ink-bg font-medium transition-colors"
          >
            {saving ? "Saving..." : isNew ? "Save entry" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
