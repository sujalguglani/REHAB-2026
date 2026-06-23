import { Suspense } from "react";
import { getAllItineraryDays, withFallback } from "@/lib/googleSheets";
import { DAYS, TRIP } from "@/lib/data";
import TodayClient from "./client";

export const revalidate = 300;

async function TodayServer() {
  const sheetDays = await withFallback(getAllItineraryDays, null);
  const days        = sheetDays ?? DAYS;
  const departure   = sheetDays
    ? (await withFallback(
        async () => { const { getSheetOverview } = await import("@/lib/googleSheets"); return (await getSheetOverview()).departure; },
        TRIP.departure.toISOString().slice(0, 10)
      ))
    : TRIP.departure.toISOString().slice(0, 10);

  return (
    <TodayClient
      days={days}
      departureISO={departure}
      source={sheetDays ? "sheet" : "mock"}
    />
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 text-zinc-500 text-sm">Loading…</div>}>
      <TodayServer />
    </Suspense>
  );
}
