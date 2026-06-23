import { getSheetSideQuests, withFallback } from "@/lib/googleSheets";
import { QUESTS } from "@/lib/data";
import QuestsClient from "./client";

export const revalidate = 300;

export default async function QuestsPage() {
  const raw = await withFallback(getSheetSideQuests, null);

  const quests = raw ?? QUESTS.map(q => ({
    id:          q.id,
    title:       q.title,
    category:    q.category,
    city:        q.city,
    description: q.description,
  }));

  return <QuestsClient quests={quests} source={raw ? "sheet" : "mock"} />;
}
