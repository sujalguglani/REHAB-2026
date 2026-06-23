import { getAllItineraryDays } from "@/lib/googleSheets";
import JournalClient from "./client";

export const revalidate = 300;

export default async function JournalPage() {
  const days = await getAllItineraryDays();
  return <JournalClient days={days} />;
}
