"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import EntryCard from "../components/EntryCard";
import EntryEditor from "../components/EntryEditor";
import SearchBar from "../components/SearchBar";
import StatsPanel from "../components/StatsPanel";
import ThemeToggle from "../components/ThemeToggle";

export default function JournalClient({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (mood) params.set("mood", mood);
    const res = await fetch(`/api/entries?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries);
    }
    setLoading(false);
  }, [query, mood]);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchEntries, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchEntries, query]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const selected = entries.find((e) => e._id === selectedId) || null;

  const selectEntry = (id) => {
    setSelectedId(id);
    setIsNew(false);
    setSidebarOpen(false);
  };

  const startNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setSidebarOpen(false);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setIsNew(false);
          setSelectedId(data.entry._id);
          await fetchEntries();
          await fetchStats();
        } else {
          setError(data.error || `Couldn't save (status ${res.status}).`);
        }
      } else if (selected) {
        const res = await fetch(`/api/entries/${selected._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          await fetchEntries();
          await fetchStats();
        } else {
          setError(data.error || `Couldn't save (status ${res.status}).`);
        }
      }
    } catch (err) {
      setError("Network error — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete "${entry.title}"? This can't be undone.`)) {
      return;
    }
    setError("");
    const res = await fetch(`/api/entries/${entry._id}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedId(null);
      await fetchEntries();
      await fetchStats();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `Couldn't delete (status ${res.status}).`);
    }
  };

  const handleTogglePin = async (entry) => {
    setError("");
    const res = await fetch(`/api/entries/${entry._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !entry.pinned }),
    });
    if (res.ok) {
      await fetchEntries();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `Couldn't update (status ${res.status}).`);
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Top bar */}
      <header
        className="flex items-center justify-between gap-3 px-4 py-3 border-b border-parchment-border dark:border-ink-border shrink-0"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-md border border-parchment-border dark:border-ink-border"
            aria-label="Toggle entry list"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-xl">Marginalia</span>
        </div>

        <StatsPanel stats={stats} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={startNew}
            className="text-sm px-3 py-2 rounded-md bg-brass hover:bg-brass-light text-ink-bg font-medium transition-colors"
          >
            + New entry
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-parchment-border dark:border-ink-border">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs font-mono text-parchment-muted dark:text-ink-muted hover:text-rust transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 relative">
        {/* Sidebar */}
        <aside
          className={`w-full sm:w-80 shrink-0 border-r border-parchment-border dark:border-ink-border flex flex-col bg-parchment-surface dark:bg-ink-surface absolute md:static inset-y-0 left-0 z-20 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <SearchBar query={query} setQuery={setQuery} mood={mood} setMood={setMood} />
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {loading && (
              <p className="p-4 text-sm text-parchment-muted dark:text-ink-muted">
                Loading entries...
              </p>
            )}
            {!loading && entries.length === 0 && (
              <p className="p-4 text-sm text-parchment-muted dark:text-ink-muted">
                {query || mood
                  ? "No entries match your search."
                  : "No entries yet. Start your first one."}
              </p>
            )}
            {entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                active={entry._id === selectedId}
                onClick={() => selectEntry(entry._id)}
              />
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Editor / reader */}
        <div className="flex-1 flex flex-col min-h-0">
          {error && (
            <div className="m-3 px-3 py-2 rounded-md border border-rust/40 bg-rust/10 text-rust text-sm flex items-center justify-between gap-3">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="text-rust/70 hover:text-rust shrink-0"
              >
                ✕
              </button>
            </div>
          )}
          <EntryEditor
            entry={selected}
            isNew={isNew}
            saving={saving}
            onSave={handleSave}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            onCancelNew={() => setIsNew(false)}
          />
        </div>
      </div>
    </div>
  );
}
