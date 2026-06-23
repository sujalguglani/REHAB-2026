import Link from "next/link";
import { DAYS } from "@/lib/data";

const CITY_COLORS: Record<string, string> = {
  "Hanoi": "text-red-400",
  "Ha Long Bay": "text-blue-400",
  "Hoi An": "text-amber-400",
  "Hue": "text-purple-400",
  "Ho Chi Minh City": "text-green-400",
  "Ha Long Bay → Da Nang": "text-blue-400",
  "Hoi An → Da Nang": "text-amber-400",
  "Hue → Ho Chi Minh City": "text-purple-400",
  "Mekong Delta": "text-green-400",
};

export default function ItineraryPage() {
  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            ▦
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Full Itinerary</h1>
            <p className="text-zinc-500 text-sm">14 days · 5 cities</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* City legend */}
      <div className="flex flex-wrap gap-2">
        {[
          { city: "Hanoi", color: "text-red-400", bg: "bg-red-950/40 border-red-900/40" },
          { city: "Ha Long Bay", color: "text-blue-400", bg: "bg-blue-950/40 border-blue-900/40" },
          { city: "Hoi An", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-900/40" },
          { city: "Hue", color: "text-purple-400", bg: "bg-purple-950/40 border-purple-900/40" },
          { city: "HCMC", color: "text-green-400", bg: "bg-green-950/40 border-green-900/40" },
        ].map(({ city, color, bg }) => (
          <span key={city} className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${color} ${bg}`}>
            {city}
          </span>
        ))}
      </div>

      {/* Day list */}
      <div className="space-y-2">
        {DAYS.map((day) => {
          const cityColor = CITY_COLORS[day.city] ?? "text-zinc-400";
          return (
            <Link
              key={day.day}
              href={`/today?day=${day.day}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                    {day.day}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${cityColor}`}>{day.city}</span>
                      <span className="text-zinc-600 text-xs">·</span>
                      <span className="text-zinc-500 text-xs">{day.date}</span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-0.5">{day.theme}</p>
                  </div>
                </div>
                <span className="text-zinc-600 text-sm shrink-0">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
