import { getSheetSideQuests } from "@/lib/googleSheets";
import QuestsClient from "./client";

export const dynamic = 'force-dynamic';

export default async function QuestsPage() {
  const quests = await getSheetSideQuests();
  return <QuestsClient quests={quests} />;
}
