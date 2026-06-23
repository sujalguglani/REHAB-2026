import Link from "next/link";
import { BOOKINGS } from "@/lib/data";

export default function BookingsPage() {
  const totalFlights = BOOKINGS.flights.length;
  const totalStays = BOOKINGS.stays.length;
  const allBooked = [...BOOKINGS.flights, ...BOOKINGS.stays].filter(b => b.status === "Booked").length;

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            ☑
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bookings</h1>
            <p className="text-zinc-500 text-sm">{totalStays} stays · {totalFlights} flights · {allBooked} confirmed</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Stays", value: totalStays, icon: "🏨" },
          { label: "Flights", value: totalFlights, icon: "✈️" },
          { label: "Confirmed", value: allBooked, icon: "✓" },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
            <p className="text-lg">{stat.icon}</p>
            <p className="text-white font-bold text-xl">{stat.value}</p>
            <p className="text-zinc-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Flights */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">✈️ Flights</p>
        <div className="space-y-3">
          {BOOKINGS.flights.map(flight => (
            <div key={flight.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {/* Top bar */}
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">{flight.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{flight.detail}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
                  {flight.status}
                </span>
              </div>
              {/* Details */}
              <div className="px-4 py-3 flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Airline</p>
                  <p className="text-zinc-200 text-xs font-medium mt-0.5">{flight.airline}</p>
                </div>
                <div className="h-6 w-px bg-zinc-800" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Flight</p>
                  <p className="text-zinc-200 text-xs font-mono font-medium mt-0.5">{flight.flightNo}</p>
                </div>
                <div className="h-6 w-px bg-zinc-800" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Date</p>
                  <p className="text-zinc-200 text-xs font-medium mt-0.5">{flight.date}</p>
                </div>
              </div>
              <div className="px-4 pb-3 flex items-center justify-between">
                <p className="text-amber-400 font-mono text-sm font-bold">{flight.time}</p>
                <a
                  href={flight.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors"
                >
                  🎟️ Booking ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stays */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">🏨 Accommodation</p>
        <div className="space-y-3">
          {BOOKINGS.stays.map(stay => (
            <div key={stay.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">{stay.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{stay.city}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
                  {stay.status}
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-amber-400 text-xs font-medium">{stay.dates}</p>
                <p className="text-zinc-400 text-xs mt-1">{stay.note}</p>
              </div>
              <div className="px-4 pb-3 flex gap-3">
                <a
                  href={stay.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors"
                >
                  📍 Maps ↗
                </a>
                <span className="text-zinc-700">·</span>
                <a
                  href={stay.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors"
                >
                  🎟️ Booking ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
