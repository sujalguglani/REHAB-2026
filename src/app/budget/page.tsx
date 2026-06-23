import { getSheetCosts, withFallback } from "@/lib/googleSheets";
import { BUDGET_PREBOOKED } from "@/lib/data";
import BudgetClient from "./client";

export const revalidate = 300;

export default async function BudgetPage() {
  const raw = await withFallback(getSheetCosts, null);

  const prebooked = raw ?? BUDGET_PREBOOKED.map(b => ({
    id:       b.id,
    label:    b.label,
    category: b.category,
    amount:   b.amount,
    paid:     b.paid,
    notes:    "",
  }));

  return (
    <BudgetClient
      prebooked={prebooked}
      currency="AUD"
      source={raw ? "sheet" : "mock"}
    />
  );
}
