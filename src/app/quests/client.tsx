"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { SheetQuest } from "@/lib/googleSheets";

const CAT_STYLES: Record<string, string> = {
  food:           "bg-orange-950 text-orange-400 border-orange-900",
  photo:          "bg-blue-950 text-blue-400 border-blue-900",
  history:        "bg-purple-950 text-purple-400 border-purple-900",
  shopping:       "bg-pink-950 text-pink-400 border-pink-900",
  social:         "bg-teal-950 text-teal-400 border-teal-900",
  luxury:         "bg-amber-950 text-amber-400 border-amber-900",
  nightlife:      "bg-violet-950 text-violet-400 border-violet-900",
  "cheap thrill": "bg-green-950 text-green-400 border-green-900",
  random:         "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function QuestsClient({
  quests,
}: {
  quests: SheetQuest[];
}) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [filter, setFilter]       = useState("All");
  const [view, setView]           = useState<"board" | "trophies">("board");

  useEffect(() => {
    const saved = localStorage.getItem("vn-quests");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggle = (id: string) => {
    setCompleted(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("vn-quests", JSON.stringify(next));
      return next;
    });
  };

  const categories = ["All", ...Array.from(new Set(quests.map(q => q.category))).filter(Boolean)];

  const filtered = quests.filter(q => {
    if (filter !== "All" && q.category !== filter) return false;
    if (view === "trophies") return completed.includes(q.id);
    return true;
  });

  const pct = quests.length ? Math.round((completed.length / quests.length) * 100) : 0;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            ★
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Side Quests</h1>
            <p className="text-zinc-500 text-sm">Turn the trip into a game</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* Progress */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-zinc-400 text-sm font-medium">Quest Board</p>
          <p className="text-violet-400 font-bold text-sm">{completed.length} / {quests.length}</p>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-zinc-600 text-xs mt-2">{pct}% complete</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(["board", "trophies"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors ${
              view === v ? "bg-zinc-800 text-white border-zinc-700" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {v === "board" ? "Quest Board" : `🏆 Trophy Room (${completed.length})`}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === cat
                ? "bg-violet-500 text-white border-violet-500"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quest list */}
      {view === "trophies" && completed.length === 0 ? (
        <div className="text-center text-zinc-600 text-sm py-10">No trophies yet. Get out there!</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-zinc-600 text-sm py-10">No quests in this category.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(quest => {
            const done     = completed.includes(quest.id);
            const catStyle = CAT_STYLES[quest.category] ?? "bg-zinc-800 text-zinc-400 border-zinc-700";
            return (
              <div
                key={quest.id}
                className={`bg-zinc-900 border rounded-2xl px-4 py-4 transition-all ${done ? "border-violet-900/50" : "border-zinc-800"}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(quest.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      done ? "bg-violet-500 border-violet-500 text-white" : "border-zinc-600 hover:border-violet-500"
                    }`}
                  >
                    {done && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className={`text-sm font-semibold ${done ? "text-zinc-500 line-through" : "text-white"}`}>
                        {quest.title}
                      </p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize shrink-0 ${catStyle}`}>
                        {quest.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{quest.description}</p>
                    {quest.city && quest.city !== "Any" && (
                      <p className="text-zinc-600 text-[10px] mt-1.5">📍 {quest.city}</p>
                    )}
                    {done && <p className="text-violet-400 text-[10px] mt-1.5 font-medium">🏆 Completed!</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
