"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { DAYS, TRIP } from "@/lib/data";

function getDayIndex(): number {
  const now = Date.now();
  const start = TRIP.departure.getTime();
  if (now < start) return 0;
  const daysPassed = Math.floor((now - start) / 86400000);
  return Math.min(daysPassed, DAYS.length - 1);
}

const STATUS_STYLES: Record<string, string> = {
  "Booked": "bg-emerald-950 text-emerald-400 border-emerald-900",
  "Entry fee": "bg-amber-950 text-amber-400 border-amber-900",
  "Included": "bg-blue-950 text-blue-400 border-blue-900",
  "Free": "bg-zinc-800 text-zinc-400 border-zinc-700",
  "Free entry": "bg-zinc-800 text-zinc-400 border-zinc-700",
  "On ship": "bg-purple-950 text-purple-400 border-purple-900",
  "Walk-in": "bg-zinc-800 text-zinc-400 border-zinc-700",
  "Book ahead": "bg-orange-950 text-orange-400 border-orange-900",
  "Self-guided": "bg-zinc-800 text-zinc-400 border-zinc-700",
  "Arrange day before": "bg-orange-950 text-orange-400 border-orange-900",
  "Haggle at pier": "bg-amber-950 text-amber-400 border-amber-900",
  "Noon": "bg-zinc-800 text-zinc-400 border-zinc-700",
  "Grab": "bg-green-950 text-green-400 border-green-900",
  "Same day": "bg-emerald-950 text-emerald-400 border-emerald-900",
  "Book on Day 6": "bg-orange-950 text-orange-400 border-orange-900",
  "Check dates": "bg-orange-950 text-orange-400 border-orange-900",
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-orange-950 text-orange-400 border-orange-900",
  photo: "bg-blue-950 text-blue-400 border-blue-900",
  history: "bg-purple-950 text-purple-400 border-purple-900",
  shopping: "bg-pink-950 text-pink-400 border-pink-900",
  social: "bg-teal-950 text-teal-400 border-teal-900",
  luxury: "bg-amber-950 text-amber-400 border-amber-900",
  nightlife: "bg-violet-950 text-violet-400 border-violet-900",
  "cheap thrill": "bg-green-950 text-green-400 border-green-900",
  random: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

function TodayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramDay = searchParams.get("day");
  const dayIndex = paramDay ? parseInt(paramDay) - 1 : getDayIndex();
  const clampedIndex = Math.max(0, Math.min(dayIndex, DAYS.length - 1));
  const day = DAYS[clampedIndex];

  const goTo = (i: number) => {
    if (i < 0 || i >= DAYS.length) return;
    router.push(`/today?day=${i + 1}`);
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {day.day}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Day {day.day}</h1>
            <p className="text-zinc-500 text-sm">{day.date}</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* City banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">{day.city}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500 text-xs">{day.region}</span>
        </div>
        <p className="text-zinc-200 text-sm">{day.theme}</p>
      </div>

      {/* Booked & fixed */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Booked &amp; fixed</p>
        <div className="space-y-2">
          {day.booked.map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-zinc-500 text-xs font-mono mt-0.5 shrink-0 w-14">{item.time}</span>
                <span className="text-zinc-200 text-sm">{item.label}</span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[item.status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* If time */}
      {day.ifTime.length > 0 && (
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">If time &amp; energy</p>
          <div className="space-y-2">
            {day.ifTime.map((item, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-zinc-600 text-sm">○</span>
                <span className="text-zinc-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transport */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Transport</p>
        <p className="text-white text-sm font-medium">→ {day.transport.label}</p>
        <p className="text-zinc-400 text-xs mt-1.5">{day.transport.detail}</p>
      </div>

      {/* Side quest */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Side quest</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[day.sideQuest.category] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
            {day.sideQuest.category}
          </span>
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed">{day.sideQuest.text}</p>
        <Link href="/quests" className="text-amber-500 text-xs mt-3 block hover:text-amber-400 transition-colors">
          All quests →
        </Link>
      </div>

      {/* Day nav */}
      <div className="border border-zinc-800 rounded-2xl flex overflow-hidden">
        <button
          onClick={() => goTo(clampedIndex - 1)}
          disabled={clampedIndex === 0}
          className="flex-1 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Day {day.day - 1}
        </button>
        <div className="w-px bg-zinc-800" />
        <div className="flex-1 py-3 text-center text-sm font-medium text-zinc-500">
          Day {day.day} of {DAYS.length}
        </div>
        <div className="w-px bg-zinc-800" />
        <button
          onClick={() => goTo(clampedIndex + 1)}
          disabled={clampedIndex === DAYS.length - 1}
          className="flex-1 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Day {day.day + 1} →
        </button>
      </div>

      <Link href="/itinerary" className="block text-center text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
        📅 View Full Itinerary (all 14 days) →
      </Link>
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 text-zinc-500 text-sm">Loading…</div>}>
      <TodayContent />
    </Suspense>
  );
}
