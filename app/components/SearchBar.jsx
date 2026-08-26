"use client";

import { MOODS } from "@/lib/moods";

export default function SearchBar({ query, setQuery, mood, setMood }) {
  return (
    <div className="p-3 border-b border-parchment-border dark:border-ink-border space-y-2">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-parchment-muted dark:text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries, tags..."
          aria-label="Search entries"
          className="w-full bg-parchment-surface2 dark:bg-ink-surface2 border border-parchment-border dark:border-ink-border rounded-md py-2 pl-8 pr-3 text-sm placeholder:text-parchment-muted dark:placeholder:text-ink-muted focus:border-brass outline-none"
        />
      </div>
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setMood("")}
          className={`shrink-0 text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
            mood === ""
              ? "border-brass text-brass"
              : "border-parchment-border dark:border-ink-border text-parchment-muted dark:text-ink-muted"
          }`}
        >
          all
        </button>
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMood(mood === m.value ? "" : m.value)}
            className={`shrink-0 text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
              mood === m.value
                ? "border-brass text-brass"
                : "border-parchment-border dark:border-ink-border text-parchment-muted dark:text-ink-muted"
            }`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
