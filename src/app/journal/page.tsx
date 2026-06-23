import { getAllItineraryDays } from "@/lib/googleSheets";
import JournalClient from "./client";

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  const days = await getAllItineraryDays();
  return <JournalClient days={days} />;
}
