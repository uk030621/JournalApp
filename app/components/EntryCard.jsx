"use client";

import { format } from "date-fns";
import { moodMeta } from "@/lib/moods";

export default function EntryCard({ entry, active, onClick }) {
  const mood = moodMeta(entry.mood);
  const preview = entry.content.replace(/\s+/g, " ").trim().slice(0, 90);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-parchment-border dark:border-ink-border transition-colors ${
        active
          ? "bg-brass/10 border-l-2 border-l-brass"
          : "hover:bg-parchment-surface2 dark:hover:bg-ink-surface2 border-l-2 border-l-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-parchment-muted dark:text-ink-muted">
          {format(new Date(entry.entryDate), "MMM d, yyyy")}
        </span>
        <span className="flex items-center gap-1">
          {entry.pinned && (
            <span className="text-brass text-xs" title="Pinned">
              &#9733;
            </span>
          )}
          <span aria-hidden="true">{mood.emoji}</span>
        </span>
      </div>
      <h3 className="font-display text-base mt-1 truncate">{entry.title}</h3>
      <p className="text-sm text-parchment-muted dark:text-ink-muted mt-0.5 line-clamp-1">
        {preview}
      </p>
      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {entry.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-moss/15 text-moss-dark dark:text-moss-light"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
