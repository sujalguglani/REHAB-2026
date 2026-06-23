import { getSheetCosts, getSheetOverview, withFallback } from "@/lib/googleSheets";
import { BUDGET_PREBOOKED, TRAVELLERS, TRIP } from "@/lib/data";
import HomeClient, { type TripMeta } from "@/components/HomeClient";

export const revalidate = 300;

export default async function HomePage() {
  const [rawCosts, rawOverview] = await Promise.all([
    withFallback(getSheetCosts, null),
    withFallback(getSheetOverview, null),
  ]);

  const prebooked = rawCosts ?? BUDGET_PREBOOKED.map(b => ({
    id:       b.id,
    label:    b.label,
    category: b.category,
    amount:   b.amount,
    paid:     b.paid,
    notes:    "",
  }));

  const trip: TripMeta = rawOverview
    ? {
        title:      rawOverview.title                       || TRIP.title,
        tagline:    rawOverview.tagline                     || TRIP.tagline,
        departure:  rawOverview.departure                   || TRIP.departure.toISOString().slice(0, 10),
        returnDate: rawOverview.return                      || TRIP.return.toISOString().slice(0, 10),
        currency:   rawOverview.currency                    || "AUD",
        traveller:  rawOverview.travellers?.[0]             || TRIP.traveller,
      }
    : {
        title:      TRIP.title,
        tagline:    TRIP.tagline,
        departure:  TRIP.departure.toISOString().slice(0, 10),
        returnDate: TRIP.return.toISOString().slice(0, 10),
        currency:   "AUD",
        traveller:  TRIP.traveller,
      };

  return (
    <HomeClient
      prebooked={prebooked}
      travellers={TRAVELLERS}
      trip={trip}
    />
  );
}
