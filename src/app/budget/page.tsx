import { getSheetCosts } from "@/lib/googleSheets";
import BudgetClient from "./client";

export const dynamic = 'force-dynamic';

export default async function BudgetPage() {
  const prebooked = await getSheetCosts();
  return <BudgetClient prebooked={prebooked} currency="AUD" />;
}
