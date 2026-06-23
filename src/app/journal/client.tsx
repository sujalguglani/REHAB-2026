"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { TripDay } from "@/lib/data";

type DayEntry = {
  bestMeal: string; bestMoment: string; funniestQuote: string;
  photoNote: string; spend: string; rating: number;
};

const defaultEntry = (): DayEntry => ({
  bestMeal: "", bestMoment: "", funniestQuote: "", photoNote: "", spend: "", rating: 5,
});

const STAR_LABELS: Record<number, string> = {
  1:"Rough day", 2:"Meh", 3:"Decent", 4:"Good", 5:"Solid",
  6:"Great", 7:"Very good", 8:"Excellent", 9:"Legendary", 10:"10/10",
};

export default function JournalClient({ days }: { days: TripDay[] }) {
  const [entries, setEntries]     = useState<Record<number, DayEntry>>({});
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vn-journal");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const updateEntry = useCallback((day: number, field: keyof DayEntry, value: string | number) => {
    setEntries(prev => {
      const next = { ...prev, [day]: { ...(prev[day] ?? defaultEntry()), [field]: value } };
      localStorage.setItem("vn-journal", JSON.stringify(next));
      return next;
    });
  }, []);

  const filledCount = Object.keys(entries).filter(k => {
    const e = entries[Number(k)];
    return e && (e.bestMeal || e.bestMoment || e.funniestQuote || e.photoNote);
  }).length;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl shrink-0">✦</div>
          <div>
            <h1 className="text-xl font-bold text-white">Trip Journal</h1>
            <p className="text-zinc-500 text-sm">Best moments, real spend, bad jokes</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">← Home</Link>
      </div>

      {/* Progress */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center justify-between">
        <p className="text-zinc-400 text-sm">{filledCount} of {days.length} days written</p>
        <p className="text-teal-400 text-xs font-medium">Auto-saves to device</p>
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {days.map(day => {
          const entry      = entries[day.day] ?? defaultEntry();
          const isOpen     = activeDay === day.day;
          const hasContent = entry.bestMeal || entry.bestMoment || entry.funniestQuote || entry.photoNote;
          return (
            <div key={day.day} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveDay(isOpen ? null : day.day)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">{day.day}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{day.city}</p>
                      {hasContent && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                    </div>
                    <p className="text-zinc-500 text-xs">{day.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasContent && <span className="text-zinc-500 text-xs">{entry.rating}/10</span>}
                  <span className={`text-zinc-500 text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>↓</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
                  <div className="bg-zinc-800/40 rounded-xl px-3 py-2">
                    {day.region && <p className="text-zinc-500 text-xs">{day.region}</p>}
                    {day.theme  && <p className="text-zinc-400 text-xs mt-0.5">{day.theme}</p>}
                  </div>
                  {(["bestMeal","bestMoment","funniestQuote","photoNote"] as const).map(k => {
                    const LABELS: Record<string, {label:string; placeholder:string}> = {
                      bestMeal:      { label:"Best meal",      placeholder:"What did you eat? Was it worth it?" },
                      bestMoment:    { label:"Best moment",    placeholder:"The thing you'll remember in 10 years." },
                      funniestQuote: { label:"Funniest quote", placeholder:"Someone said something ridiculous…" },
                      photoNote:     { label:"Photo note",     placeholder:"Best shot of the day or one to recreate." },
                    };
                    return (
                      <div key={k}>
                        <label className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1.5">{LABELS[k].label}</label>
                        <textarea rows={2} placeholder={LABELS[k].placeholder}
                          value={entry[k] as string}
                          onChange={e => updateEntry(day.day, k, e.target.value)}
                          className="resize-none" />
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1.5">Spend estimate (AUD)</label>
                      <input type="number" placeholder="0" value={entry.spend}
                        onChange={e => updateEntry(day.day, "spend", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1.5">Day rating: {entry.rating}/10</label>
                      <input type="range" min={1} max={10} value={entry.rating}
                        onChange={e => updateEntry(day.day, "rating", parseInt(e.target.value))} />
                      <p className="text-teal-400 text-[10px] mt-1">{STAR_LABELS[entry.rating]}</p>
                    </div>
                  </div>
                  <p className="text-zinc-700 text-[10px] text-center">Auto-saved to this device</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
