"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FOOD } from "@/lib/data";

const CITIES = ["All", "Hanoi", "Da Nang", "Hoi An", "Hue", "Ho Chi Minh City"];

const FIT_STYLES: Record<string, string> = {
  "Perfect Match": "bg-emerald-950 text-emerald-400 border-emerald-900",
  "Easy Fit": "bg-blue-950 text-blue-400 border-blue-900",
};

const PRICE_LABELS: Record<string, string> = {
  "$": "Budget",
  "$$": "Mid",
  "$$$": "Splurge",
};

export default function FoodPage() {
  const [eaten, setEaten] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("vn-eaten");
    if (saved) setEaten(JSON.parse(saved));
  }, []);

  const toggle = (id: string) => {
    setEaten(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("vn-eaten", JSON.stringify(next));
      return next;
    });
  };

  const filtered = cityFilter === "All" ? FOOD : FOOD.filter(f => f.city === cityFilter);
  const pct = Math.round((eaten.length / FOOD.length) * 100);

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            ◆
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Vietnam Food Guide</h1>
            <p className="text-zinc-500 text-sm">Quest tracker · {FOOD.length} must-eats</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* Progress */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-zinc-400 text-sm font-medium">🍜 Food Quest</p>
          <p className="text-amber-400 font-bold text-sm">{eaten.length} / {FOOD.length}</p>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-zinc-600 text-xs mt-2">{pct}% consumed</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setCityFilter(city)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              cityFilter === city
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="space-y-3">
        {filtered.map(food => {
          const isEaten = eaten.includes(food.id);
          return (
            <div
              key={food.id}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${
                isEaten ? "border-emerald-900/50 opacity-70" : "border-zinc-800"
              }`}
            >
              {/* Top row */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <button
                  onClick={() => toggle(food.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isEaten
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-zinc-600 hover:border-amber-500"
                  }`}
                >
                  {isEaten && <span className="text-[10px] font-bold">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{food.name}</p>
                      <p className="text-zinc-500 text-xs">{food.englishName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-zinc-500 text-xs font-mono">{food.price}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${FIT_STYLES[food.fit] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                        {food.fit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-4 pb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-[10px] font-medium uppercase tracking-wide">{food.city}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-zinc-500 text-[10px]">{food.category}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-zinc-500 text-[10px]">{PRICE_LABELS[food.price]}</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{food.description}</p>
                <div className="bg-zinc-800/60 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-amber-500 uppercase tracking-wide font-medium mb-0.5">Strategy · Day {food.itineraryDay}</p>
                  <p className="text-zinc-400 text-xs">{food.strategy}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-zinc-600 text-[10px]">{food.spot}</p>
                  <div className="flex gap-3">
                    <a href={food.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
                      🗺️ Maps ↗
                    </a>
                    <Link href={`/today?day=${food.itineraryDay}`} className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
                      📅 Day {food.itineraryDay} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {eaten.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              setEaten([]);
              localStorage.removeItem("vn-eaten");
            }}
            className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
