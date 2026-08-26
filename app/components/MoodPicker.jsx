"use client";

import { MOODS } from "@/lib/moods";

export default function MoodPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Mood">
      {MOODS.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={m.label}
            onClick={() => onChange(m.value)}
            className={`h-9 w-9 rounded-full flex items-center justify-center text-base transition-all border ${
              active
                ? "border-brass bg-brass/15 scale-110"
                : "border-transparent hover:border-parchment-border dark:hover:border-ink-border opacity-70 hover:opacity-100"
            }`}
          >
            <span aria-hidden="true">{m.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
