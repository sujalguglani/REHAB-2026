import Link from "next/link";
import { getAllItineraryDays } from "@/lib/googleSheets";

export const revalidate = 300;

const CITY_COLORS: Record<string, string> = {
  "Ho Chi Minh":      "text-red-400",
  "Ho Chi Minh City": "text-red-400",
  "HCMC":             "text-red-400",
  "Hong Kong":        "text-amber-400",
  "Macau":            "text-emerald-400",
  "Hanoi":            "text-red-400",
  "Ha Long Bay":      "text-blue-400",
  "Hoi An":           "text-amber-400",
  "Hue":              "text-purple-400",
};

function cityColor(city: string): string {
  return CITY_COLORS[city] ?? "text-zinc-400";
}

export default async function ItineraryPage() {
  const days   = await getAllItineraryDays();
  const cities = Array.from(new Set(days.map(d => d.city)));

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
            <p className="text-zinc-500 text-sm">{days.length} days · {cities.length} cities</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* City legend */}
      <div className="flex flex-wrap gap-2">
        {cities.map(city => (
          <span
            key={city}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border bg-zinc-900 border-zinc-800 ${cityColor(city)}`}
          >
            {city}
          </span>
        ))}
      </div>

      {/* Day list */}
      <div className="space-y-2">
        {days.map(day => (
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
                    <span className={`text-sm font-semibold ${cityColor(day.city)}`}>{day.city}</span>
                    {day.date && (
                      <><span className="text-zinc-600 text-xs">·</span>
                      <span className="text-zinc-500 text-xs">{day.date}</span></>
                    )}
                  </div>
                  {day.theme && <p className="text-zinc-400 text-xs mt-0.5">{day.theme}</p>}
                  {day.region && <p className="text-zinc-600 text-[10px] mt-0.5">{day.region}</p>}
                </div>
              </div>
              <span className="text-zinc-600 text-sm shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
