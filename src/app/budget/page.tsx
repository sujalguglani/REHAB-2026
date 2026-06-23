import { getSheetCosts } from "@/lib/googleSheets";
import BudgetClient from "./client";

export const revalidate = 300;

export default async function BudgetPage() {
  const prebooked = await getSheetCosts();
  return <BudgetClient prebooked={prebooked} currency="AUD" />;
}
