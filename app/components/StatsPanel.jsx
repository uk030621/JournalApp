"use client";

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "streak", value: `${stats.streak}d` },
    { label: "entries", value: stats.totalEntries },
    { label: "words", value: stats.totalWords.toLocaleString() },
  ];

  return (
    <div className="hidden sm:flex items-center gap-4 font-mono text-xs text-parchment-muted dark:text-ink-muted">
      {items.map((it) => (
        <div key={it.label} className="flex items-baseline gap-1">
          <span className="text-brass font-medium">{it.value}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
