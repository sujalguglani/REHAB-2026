"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PLANNING_CHECKLIST } from "@/lib/data";
import type { SheetCostItem } from "@/lib/googleSheets";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TripMeta = {
  title:      string;
  tagline:    string;
  departure:  string; // ISO date string
  returnDate: string;
  currency:   string;
  traveller:  string;
};

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(isoDate: string) {
  const target = new Date(isoDate).getTime();
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => setDiff(target - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return { days: 0, hrs: 0, min: 0, sec: 0 };
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hrs: Math.floor((s % 86400) / 3600), min: Math.floor((s % 3600) / 60), sec: s % 60 };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-mono font-bold text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  );
}

// ─── Milestones ───────────────────────────────────────────────────────────────

function buildMilestones(departureISO: string) {
  const dep = new Date(departureISO + 'T00:00:00');
  const fmt = (d: Date) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  const offset = (days: number) => { const d = new Date(dep); d.setDate(dep.getDate() - days); return d; };
  return [
    { label: "30 days",  date: offset(30), short: fmt(offset(30)) },
    { label: "14 days",  date: offset(14), short: fmt(offset(14)) },
    { label: "7 days",   date: offset(7),  short: fmt(offset(7))  },
    { label: "✈ Depart", date: dep,        short: fmt(dep)        },
  ];
}

function MilestoneTimeline({ departureISO }: { departureISO: string }) {
  const MILESTONES = buildMilestones(departureISO);
  const now = Date.now();
  const passedCount = MILESTONES.filter(m => now >= m.date.getTime()).length;
  const pct = (passedCount / MILESTONES.length) * 100;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Countdown milestones</p>
      <div className="relative mb-2">
        <div className="h-1 bg-zinc-800 rounded-full" />
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
          {MILESTONES.map((m, i) => {
            const passed = now >= m.date.getTime();
            const isCurrent = i === passedCount && passedCount < MILESTONES.length;
            return (
              <div key={m.label} className={`w-3 h-3 rounded-full border-2 transition-all ${passed ? "bg-amber-500 border-amber-500" : isCurrent ? "bg-zinc-950 border-amber-500 animate-pulse" : "bg-zinc-800 border-zinc-700"}`} />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-3">
        {MILESTONES.map((m, i) => {
          const passed = now >= m.date.getTime();
          const isCurrent = i === passedCount && passedCount < MILESTONES.length;
          return (
            <div key={m.label} className="flex flex-col items-center gap-0.5" style={{ width: "25%" }}>
              <span className={`text-[10px] font-semibold text-center leading-tight ${passed ? "text-amber-400" : isCurrent ? "text-white" : "text-zinc-600"}`}>{m.label}</span>
              <span className={`text-[9px] ${passed ? "text-zinc-500" : "text-zinc-700"}`}>{m.short}</span>
              {passed    && <span className="text-[9px] text-emerald-500">✓</span>}
              {isCurrent && <span className="text-[9px] text-amber-400">← now</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Traveller chips (names from Overview sheet) ──────────────────────────────

const AVATAR_COLORS = ["bg-amber-500", "bg-blue-500", "bg-rose-500", "bg-emerald-500", "bg-purple-500", "bg-teal-500"];

function TravellerChip({ name, index }: { name: string; index: number }) {
  const initials = name.split(" ").map(p => p[0] ?? "").join("").slice(0, 2).toUpperCase();
  const color    = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-black font-bold text-sm shrink-0`}>
        {initials}
      </div>
      <p className="text-white font-medium text-sm">{name}</p>
    </div>
  );
}

// ─── Weather card ─────────────────────────────────────────────────────────────

type WeatherData = { temp: number; feelsLike: number; humidity: number; code: number };
const WMO_ICON: Record<number, string> = { 0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",80:"🌦️",81:"🌧️",82:"⛈️",95:"⛈️",96:"⛈️",99:"⛈️" };
const WMO_DESC: Record<number, string> = { 0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Foggy",48:"Icy fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",80:"Showers",81:"Heavy showers",82:"Violent showers",95:"Thunderstorm",96:"Thunderstorm + hail",99:"Severe thunderstorm" };

function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=21.0278&longitude=105.8342&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m&timezone=Asia%2FBangkok")
      .then(r => r.json())
      .then(d => { setWeather({ temp: Math.round(d.current.temperature_2m), feelsLike: Math.round(d.current.apparent_temperature), humidity: d.current.relative_humidity_2m, code: d.current.weather_code }); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);
  const icon = weather ? (WMO_ICON[weather.code] ?? "🌡️") : "🌡️";
  const desc = weather ? (WMO_DESC[weather.code] ?? "—") : "—";
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Hanoi now</p>
        <span className="text-[10px] text-zinc-600">🇻🇳</span>
      </div>
      {loading ? <div className="h-10 flex items-center"><div className="w-16 h-3 bg-zinc-800 rounded animate-pulse" /></div>
      : error   ? <p className="text-zinc-600 text-xs">Unavailable</p>
      : weather ? (
        <>
          <div className="flex items-end gap-2"><span className="text-2xl">{icon}</span><span className="text-3xl font-bold text-white">{weather.temp}°</span></div>
          <p className="text-zinc-400 text-xs">{desc}</p>
          <div className="flex gap-3 text-[10px] text-zinc-500"><span>Feels {weather.feelsLike}°</span><span>·</span><span>{weather.humidity}% humid</span></div>
          <p className="text-zinc-700 text-[9px] mt-1">July avg: 28–33°C · Rainy season</p>
        </>
      ) : null}
    </div>
  );
}

// ─── Currency card ────────────────────────────────────────────────────────────

function CurrencyCard({ currency }: { currency: string }) {
  const [rate, setRate]       = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [amt, setAmt]         = useState("100");
  useEffect(() => {
    fetch(`https://api.frankfurter.app/latest?from=${currency}&to=VND`)
      .then(r => r.json())
      .then(d => { setRate(d.rates.VND); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [currency]);
  const vnd = rate && amt ? parseFloat(amt) * rate : null;
  const fmt = (n: number) => n >= 1_000_000 ? `₫${(n / 1_000_000).toFixed(1)}M` : `₫${Math.round(n).toLocaleString()}`;
  const sym = currency === "AUD" ? "A$" : currency === "USD" ? "$" : currency;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{currency} → VND</p>
        <span className="text-[10px] text-zinc-600">Live</span>
      </div>
      {loading ? <div className="h-10 flex items-center"><div className="w-20 h-3 bg-zinc-800 rounded animate-pulse" /></div>
      : error   ? <p className="text-zinc-600 text-xs">Unavailable</p>
      : rate    ? (
        <>
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)} className="!bg-zinc-800 !border-zinc-700 !rounded-lg !py-1.5 !px-2 !text-sm !w-full" placeholder={currency} />
          <div className="bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
            <p className="text-amber-400 font-bold text-lg font-mono">{vnd ? fmt(vnd) : "—"}</p>
          </div>
          <p className="text-zinc-600 text-[10px] text-center">{sym}1 = ₫{Math.round(rate).toLocaleString()}</p>
        </>
      ) : null}
    </div>
  );
}

// ─── Budget summary card ──────────────────────────────────────────────────────

function BudgetSummaryCard({ prebooked, currency }: { prebooked: SheetCostItem[]; currency: string }) {
  const sym      = currency === "AUD" ? "A$" : currency === "USD" ? "$" : "$";
  const total    = prebooked.reduce((s, b) => s + b.amount, 0);
  const paid     = prebooked.filter(b => b.paid).reduce((s, b) => s + b.amount, 0);
  const catTotals = prebooked.reduce<Record<string, number>>((acc, b) => { acc[b.category] = (acc[b.category] ?? 0) + b.amount; return acc; }, {});
  const BAR_COLORS: Record<string, string> = { "Flights":"bg-blue-500","Accommodation":"bg-purple-500","Activities":"bg-amber-500","Transport":"bg-teal-500","Food":"bg-orange-500" };
  const DEF = ["bg-pink-500","bg-rose-500","bg-indigo-500","bg-cyan-500"];
  const cats = Object.entries(catTotals);
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Total trip budget</p>
        <Link href="/budget" className="text-amber-500 text-xs hover:text-amber-400 transition-colors">Full breakdown →</Link>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{sym}{total.toLocaleString()}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{currency} · pre-booked total from sheet</p>
      </div>
      {cats.length > 0 && (
        <>
          <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
            {cats.map(([cat, amt], i) => <div key={cat} className={`${BAR_COLORS[cat] ?? DEF[i % DEF.length]} rounded-full`} style={{ width: `${(amt / total) * 100}%` }} />)}
          </div>
          <div className="flex flex-wrap gap-3">
            {cats.map(([cat, amt], i) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${BAR_COLORS[cat] ?? DEF[i % DEF.length]}`} />
                <span className="text-zinc-400 text-xs">{cat}</span>
                <span className="text-zinc-500 text-xs">{sym}{amt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex gap-3">
        <div className="flex-1 bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
          <p className="text-emerald-400 font-semibold text-sm">{sym}{paid.toLocaleString()}</p>
          <p className="text-zinc-600 text-[10px]">Paid</p>
        </div>
        <div className="flex-1 bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
          <p className="text-amber-400 font-semibold text-sm">{sym}{(total - paid).toLocaleString()}</p>
          <p className="text-zinc-600 text-[10px]">Outstanding</p>
        </div>
      </div>
    </div>
  );
}

// ─── Progress tracker ─────────────────────────────────────────────────────────

function ProgressTracker() {
  const defaultDone = PLANNING_CHECKLIST.filter(i => i.defaultDone).map(i => i.id);
  const [checked, setChecked] = useState<string[]>(defaultDone);
  const [loaded, setLoaded]   = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("vn-planning");
    if (saved) setChecked(JSON.parse(saved));
    else setChecked(defaultDone);
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = (id: string) => {
    setChecked(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("vn-planning", JSON.stringify(next));
      return next;
    });
  };
  const pct = loaded ? Math.round((checked.length / PLANNING_CHECKLIST.length) * 100) : 0;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Planning progress</p>
        <span className="text-white font-bold text-sm">{pct}%</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2">
        {PLANNING_CHECKLIST.map(item => {
          const done = checked.includes(item.id);
          return (
            <button key={item.id} onClick={() => toggle(item.id)} className="w-full flex items-center gap-3 group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${done ? "bg-emerald-500 border-emerald-500" : "border-zinc-600 group-hover:border-emerald-500/60"}`}>
                {done && <span className="text-[9px] font-bold text-white">✓</span>}
              </div>
              <span className={`text-sm text-left transition-colors ${done ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quick launch ─────────────────────────────────────────────────────────────

const QUICK_LAUNCH = [
  { href: "/today",     label: "Today",     sub: "Command centre",  icon: "◎" },
  { href: "/bookings",  label: "Bookings",  sub: "Stays & flights", icon: "☑" },
  { href: "/itinerary", label: "Itinerary", sub: "All days",        icon: "▦" },
  { href: "/food",      label: "Food",      sub: "Must-eats",       icon: "◆" },
  { href: "/budget",    label: "Budget",    sub: "Spend tracker",   icon: "¢" },
  { href: "/quests",    label: "Quests",    sub: "Side missions",   icon: "★" },
  { href: "/journal",   label: "Journal",   sub: "Day by day",      icon: "✦" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeClient({
  prebooked,
  travellers,
  trip,
}: {
  prebooked:  SheetCostItem[];
  travellers: string[];
  trip:       TripMeta;
}) {
  const cd        = useCountdown(trip.departure);
  const now       = Date.now();
  const depTime   = new Date(trip.departure).getTime();
  const retTime   = new Date(trip.returnDate).getTime();
  const inTrip    = now >= depTime && now <= retTime;
  const afterTrip = now > retTime;

  const depLabel = new Date(trip.departure).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  const retLabel = new Date(trip.returnDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-bold text-xl shrink-0">✈</div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{trip.title}</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{depLabel} – {retLabel}</p>
        </div>
      </div>

      {/* Live data badge */}
      <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-2">
        <span className="text-emerald-400 text-xs">✓ Live Data · Google Sheets</span>
        <a href="/api/sheets-debug" target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-[10px] hover:text-emerald-400 transition-colors">debug →</a>
      </div>

      {/* Boarding pass / countdown */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="bg-gradient-to-r from-amber-600 to-red-700 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber-100/70 uppercase tracking-widest font-medium">REHAB-2026</p>
            <p className="text-white font-bold text-sm">BOARDING PASS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-amber-100/70 uppercase tracking-widest">Destinations</p>
            <p className="text-white font-mono font-bold text-sm">HCMC · HKG · MFM</p>
          </div>
        </div>
        <div className="border-t border-dashed border-zinc-700 mx-4" />
        <div className="px-5 py-5">
          {afterTrip ? (
            <div className="text-center text-zinc-400 text-sm py-2">Trip completed 🏁 Welcome home, {trip.traveller}.</div>
          ) : inTrip ? (
            <div className="text-center">
              <p className="text-amber-400 font-bold text-lg">You&apos;re on the trip!</p>
              <p className="text-zinc-400 text-sm mt-1">Make every day count.</p>
            </div>
          ) : (
            <>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Departure in</p>
              <div className="flex items-center gap-4">
                <CountdownUnit value={cd.days} label="Days" />
                <span className="text-zinc-600 text-2xl font-bold self-start mt-1">:</span>
                <CountdownUnit value={cd.hrs}  label="Hrs"  />
                <span className="text-zinc-600 text-2xl font-bold self-start mt-1">:</span>
                <CountdownUnit value={cd.min}  label="Min"  />
                <span className="text-zinc-600 text-2xl font-bold self-start mt-1">:</span>
                <CountdownUnit value={cd.sec}  label="Sec"  />
              </div>
            </>
          )}
        </div>
        <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Passengers</p>
            <p className="text-white text-sm font-medium">{trip.traveller}{travellers.length > 1 ? ` + ${travellers.length - 1} mates` : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Currency</p>
            <p className="text-white text-sm font-medium font-mono">{trip.currency} → VND</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <MilestoneTimeline departureISO={trip.departure} />

      {/* Travellers — names from Overview sheet */}
      {travellers.length > 0 && (
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Travellers · {travellers.length} people</p>
          <div className="grid grid-cols-2 gap-3">
            {travellers.map((name, i) => <TravellerChip key={name} name={name} index={i} />)}
          </div>
        </div>
      )}

      {/* Weather + Currency */}
      <div className="grid grid-cols-2 gap-3">
        <WeatherCard />
        <CurrencyCard currency={trip.currency} />
      </div>

      {/* Budget summary */}
      <BudgetSummaryCard prebooked={prebooked} currency={trip.currency} />

      {/* Progress tracker */}
      <ProgressTracker />

      {/* Route strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {["HCMC", "Hong Kong", "Macau"].map((city, i, arr) => (
          <div key={city} className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-full">{city}</span>
            {i < arr.length - 1 && <span className="text-zinc-600 text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* Quick launch */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Quick launch</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LAUNCH.map(item => (
            <Link key={item.href} href={item.href} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all active:scale-95">
              <span className="text-amber-500 text-lg leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Vibe strip */}
      {trip.tagline && (
        <div className="rounded-2xl bg-gradient-to-br from-red-950/40 to-amber-950/30 border border-red-900/30 px-5 py-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-widest mb-1">Trip vibe</p>
          <p className="text-zinc-200 text-sm leading-relaxed">{trip.tagline}</p>
        </div>
      )}

    </div>
  );
}
