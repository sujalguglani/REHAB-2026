"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TRIP, TRAVELLERS, BUDGET_PREBOOKED, DAILY_ESTIMATES,
  PLANNING_CHECKLIST, type Traveller,
} from "@/lib/data";

// ─── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => setDiff(target.getTime() - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return { days: 0, hrs: 0, min: 0, sec: 0 };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hrs:  Math.floor((total % 86400) / 3600),
    min:  Math.floor((total % 3600) / 60),
    sec:  total % 60,
  };
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

// ─── Milestones ──────────────────────────────────────────────────────────────
const MILESTONES = [
  { label: "30 days", date: new Date("2026-06-15T00:00:00"), short: "Jun 15" },
  { label: "14 days", date: new Date("2026-07-01T00:00:00"), short: "Jul 1"  },
  { label: "7 days",  date: new Date("2026-07-08T00:00:00"), short: "Jul 8"  },
  { label: "✈ Depart",date: new Date("2026-07-15T00:00:00"), short: "Jul 15" },
];

function MilestoneTimeline() {
  const now = Date.now();
  const passedCount = MILESTONES.filter(m => now >= m.date.getTime()).length;
  const pct = (passedCount / MILESTONES.length) * 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Countdown milestones</p>
      {/* Progress rail */}
      <div className="relative mb-2">
        <div className="h-1 bg-zinc-800 rounded-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        {/* Dots */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
          {MILESTONES.map((m, i) => {
            const passed = now >= m.date.getTime();
            const isCurrent = i === passedCount && passedCount < MILESTONES.length;
            return (
              <div
                key={m.label}
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  passed
                    ? "bg-amber-500 border-amber-500"
                    : isCurrent
                    ? "bg-zinc-950 border-amber-500 animate-pulse"
                    : "bg-zinc-800 border-zinc-700"
                }`}
              />
            );
          })}
        </div>
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-3">
        {MILESTONES.map((m, i) => {
          const passed = now >= m.date.getTime();
          const isCurrent = i === passedCount && passedCount < MILESTONES.length;
          return (
            <div key={m.label} className="flex flex-col items-center gap-0.5" style={{ width: "25%" }}>
              <span className={`text-[10px] font-semibold text-center leading-tight ${
                passed ? "text-amber-400" : isCurrent ? "text-white" : "text-zinc-600"
              }`}>
                {m.label}
              </span>
              <span className={`text-[9px] ${passed ? "text-zinc-500" : "text-zinc-700"}`}>{m.short}</span>
              {passed && <span className="text-[9px] text-emerald-500">✓ done</span>}
              {isCurrent && <span className="text-[9px] text-amber-400">← now</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Traveller card ───────────────────────────────────────────────────────────
function TravellerCard({ t }: { t: Traveller }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shrink-0 w-72">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-zinc-800">
        <div className={`w-9 h-9 rounded-xl ${t.color} flex items-center justify-center text-black font-bold text-sm shrink-0`}>
          {t.initials}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{t.name}</p>
          <p className="text-zinc-500 text-xs">Departing {t.departureCity} ({t.departureCode})</p>
        </div>
      </div>
      {/* Outbound */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Outbound</span>
          <span className="text-[10px] text-emerald-400 font-medium">✓ Booked</span>
        </div>
        <p className="text-amber-400 font-mono text-xs font-bold">{t.outbound.flightNo} · {t.outbound.route}</p>
        <p className="text-zinc-400 text-xs mt-0.5">{t.outbound.date} · {t.outbound.time}</p>
        <p className="text-zinc-600 text-[10px] mt-0.5">{t.outbound.airline}</p>
      </div>
      {/* Return */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Return</span>
          <span className="text-[10px] text-emerald-400 font-medium">✓ Booked</span>
        </div>
        <p className="text-amber-400 font-mono text-xs font-bold">{t.return.flightNo} · {t.return.route}</p>
        <p className="text-zinc-400 text-xs mt-0.5">{t.return.date} · {t.return.time}</p>
        <p className="text-zinc-600 text-[10px] mt-0.5">{t.return.airline}</p>
      </div>
    </div>
  );
}

// ─── Weather card ─────────────────────────────────────────────────────────────
type WeatherData = {
  temp: number;
  feelsLike: number;
  humidity: number;
  code: number;
};

const WMO_ICON: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};
const WMO_DESC: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  80: "Showers", 81: "Heavy showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm + hail", 99: "Severe thunderstorm",
};

function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.0278&longitude=105.8342&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m&timezone=Asia%2FBangkok"
    )
      .then(r => r.json())
      .then(d => {
        setWeather({
          temp:      Math.round(d.current.temperature_2m),
          feelsLike: Math.round(d.current.apparent_temperature),
          humidity:  d.current.relative_humidity_2m,
          code:      d.current.weather_code,
        });
        setLoading(false);
      })
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
      {loading ? (
        <div className="h-10 flex items-center">
          <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : error ? (
        <p className="text-zinc-600 text-xs">Unavailable</p>
      ) : weather ? (
        <>
          <div className="flex items-end gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-3xl font-bold text-white">{weather.temp}°</span>
          </div>
          <p className="text-zinc-400 text-xs">{desc}</p>
          <div className="flex gap-3 text-[10px] text-zinc-500 mt-0.5">
            <span>Feels {weather.feelsLike}°</span>
            <span>·</span>
            <span>{weather.humidity}% humid</span>
          </div>
          <p className="text-zinc-700 text-[9px] mt-1">July avg: 28–33°C · Rainy season</p>
        </>
      ) : null}
    </div>
  );
}

// ─── Currency card ────────────────────────────────────────────────────────────
function CurrencyCard() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aud, setAud] = useState("100");

  useEffect(() => {
    fetch("https://api.frankfurter.app/latest?from=AUD&to=VND")
      .then(r => r.json())
      .then(d => { setRate(d.rates.VND); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const vnd = rate && aud ? (parseFloat(aud) * rate) : null;

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `₫${(n / 1_000_000).toFixed(1)}M`
      : `₫${Math.round(n).toLocaleString()}`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">AUD → VND</p>
        <span className="text-[10px] text-zinc-600">Live</span>
      </div>
      {loading ? (
        <div className="h-10 flex items-center">
          <div className="w-20 h-3 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : error ? (
        <p className="text-zinc-600 text-xs">Unavailable</p>
      ) : rate ? (
        <>
          <div>
            <input
              type="number"
              value={aud}
              onChange={e => setAud(e.target.value)}
              className="!bg-zinc-800 !border-zinc-700 !rounded-lg !py-1.5 !px-2 !text-sm !w-full"
              placeholder="AUD"
            />
          </div>
          <div className="bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
            <p className="text-amber-400 font-bold text-lg font-mono">
              {vnd ? fmt(vnd) : "—"}
            </p>
          </div>
          <p className="text-zinc-600 text-[10px] text-center">
            A$1 = ₫{Math.round(rate).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  );
}

// ─── Budget summary card ──────────────────────────────────────────────────────
function BudgetSummaryCard() {
  const prebooked = BUDGET_PREBOOKED.reduce((s, b) => s + b.amount, 0);
  const dailyEst  = DAILY_ESTIMATES.reduce((s, d) => s + d.food + d.transport + d.activities + d.other, 0);
  const total     = prebooked + dailyEst;
  const prebootedPct = Math.round((prebooked / total) * 100);

  const breakdown = [
    { label: "Flights",        amount: BUDGET_PREBOOKED.filter(b => b.category === "Flights").reduce((s, b) => s + b.amount, 0),        color: "bg-blue-500" },
    { label: "Accommodation",  amount: BUDGET_PREBOOKED.filter(b => b.category === "Accommodation").reduce((s, b) => s + b.amount, 0),  color: "bg-purple-500" },
    { label: "Daily est.",     amount: dailyEst,                                                                                          color: "bg-amber-500" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Total trip budget</p>
        <Link href="/budget" className="text-amber-500 text-xs hover:text-amber-400 transition-colors">
          Full breakdown →
        </Link>
      </div>

      {/* Big number */}
      <div>
        <p className="text-3xl font-bold text-white">${total.toLocaleString()}</p>
        <p className="text-zinc-500 text-xs mt-0.5">AUD · pre-booked + estimated daily</p>
      </div>

      {/* Stacked bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
        {breakdown.map(b => (
          <div
            key={b.label}
            className={`${b.color} rounded-full`}
            style={{ width: `${(b.amount / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {breakdown.map(b => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${b.color}`} />
            <span className="text-zinc-400 text-xs">{b.label}</span>
            <span className="text-zinc-500 text-xs">${b.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Paid vs estimated */}
      <div className="flex gap-3">
        <div className="flex-1 bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
          <p className="text-emerald-400 font-semibold text-sm">${prebooked.toLocaleString()}</p>
          <p className="text-zinc-600 text-[10px]">{prebootedPct}% paid</p>
        </div>
        <div className="flex-1 bg-zinc-800/60 rounded-xl px-3 py-2 text-center">
          <p className="text-amber-400 font-semibold text-sm">${dailyEst.toLocaleString()}</p>
          <p className="text-zinc-600 text-[10px]">est. on-trip</p>
        </div>
      </div>
    </div>
  );
}

// ─── Progress tracker ─────────────────────────────────────────────────────────
function ProgressTracker() {
  const defaultDone = PLANNING_CHECKLIST.filter(i => i.defaultDone).map(i => i.id);
  const [checked, setChecked] = useState<string[]>(defaultDone);
  const [loaded, setLoaded] = useState(false);

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

      {/* Bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {PLANNING_CHECKLIST.map(item => {
          const done = checked.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="w-full flex items-center gap-3 group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                done
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-zinc-600 group-hover:border-emerald-500/60"
              }`}>
                {done && <span className="text-[9px] font-bold text-white">✓</span>}
              </div>
              <span className={`text-sm text-left transition-colors ${done ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quick launch ─────────────────────────────────────────────────────────────
const QUICK_LAUNCH = [
  { href: "/today",     label: "Today",    sub: "Command centre", icon: "◎" },
  { href: "/bookings",  label: "Bookings", sub: "Stays & flights", icon: "☑" },
  { href: "/itinerary", label: "Itinerary",sub: "All 14 days",    icon: "▦" },
  { href: "/food",      label: "Food",     sub: "15 must-eats",   icon: "◆" },
  { href: "/budget",    label: "Budget",   sub: "Spend tracker",  icon: "¢" },
  { href: "/quests",    label: "Quests",   sub: "Side missions",  icon: "★" },
  { href: "/journal",   label: "Journal",  sub: "Day by day",     icon: "✦" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const cd   = useCountdown(TRIP.departure);
  const now  = Date.now();
  const inTrip    = now >= TRIP.departure.getTime() && now <= TRIP.return.getTime();
  const afterTrip = now > TRIP.return.getTime();

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-bold text-xl shrink-0">
          V
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Vietnam Trip Cockpit</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Wed 15 Jul – Tue 28 Jul 2026 · 14 days</p>
        </div>
      </div>

      {/* ── Boarding pass / countdown ── */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="bg-gradient-to-r from-amber-600 to-red-700 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber-100/70 uppercase tracking-widest font-medium">Vietnam Cockpit</p>
            <p className="text-white font-bold text-sm">BOARDING PASS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-amber-100/70 uppercase tracking-widest">Route</p>
            <p className="text-white font-mono font-bold text-sm">SIN → HAN → SGN</p>
          </div>
        </div>

        <div className="border-t border-dashed border-zinc-700 mx-4" />

        <div className="px-5 py-5">
          {afterTrip ? (
            <div className="text-center text-zinc-400 text-sm py-2">
              Trip completed 🏁 Welcome home, {TRIP.traveller}.
            </div>
          ) : inTrip ? (
            <div className="text-center">
              <p className="text-amber-400 font-bold text-lg">🇻🇳 You&apos;re in Vietnam!</p>
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
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Passenger</p>
            <p className="text-white text-sm font-medium">{TRIP.traveller} + {TRAVELLERS.length - 1} mates</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">First flight</p>
            <p className="text-white text-sm font-medium font-mono">SQ185 · 08:30</p>
          </div>
        </div>
      </div>

      {/* ── Milestones ── */}
      <MilestoneTimeline />

      {/* ── Traveller cards ── */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
          Travellers · {TRAVELLERS.length} people
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {TRAVELLERS.map(t => <TravellerCard key={t.id} t={t} />)}
        </div>
      </div>

      {/* ── Weather + Currency ── */}
      <div className="grid grid-cols-2 gap-3">
        <WeatherCard />
        <CurrencyCard />
      </div>

      {/* ── Budget summary ── */}
      <BudgetSummaryCard />

      {/* ── Progress tracker ── */}
      <ProgressTracker />

      {/* ── Route strip ── */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {["Hanoi", "Ha Long", "Hoi An", "Hue", "HCMC"].map((city, i, arr) => (
          <div key={city} className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-full">{city}</span>
            {i < arr.length - 1 && <span className="text-zinc-600 text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* ── Quick launch ── */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Quick launch</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LAUNCH.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all active:scale-95"
            >
              <span className="text-amber-500 text-lg leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Vibe strip ── */}
      <div className="rounded-2xl bg-gradient-to-br from-red-950/40 to-amber-950/30 border border-red-900/30 px-5 py-4">
        <p className="text-amber-400 text-xs font-medium uppercase tracking-widest mb-1">Trip vibe</p>
        <p className="text-zinc-200 text-sm leading-relaxed">{TRIP.tagline}</p>
      </div>

    </div>
  );
}
