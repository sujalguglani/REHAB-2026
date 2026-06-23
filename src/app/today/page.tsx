import { Suspense } from "react";
import { getAllItineraryDays, getSheetOverview } from "@/lib/googleSheets";
import TodayClient from "./client";

export const dynamic = 'force-dynamic';

async function TodayServer() {
  const [days, overview] = await Promise.all([
    getAllItineraryDays(),
    getSheetOverview(),
  ]);
  return (
    <TodayClient
      days={days}
      departureISO={overview.departure}
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
