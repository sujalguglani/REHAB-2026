import { getSheetCosts, getSheetOverview } from "@/lib/googleSheets";
import HomeClient, { type TripMeta } from "@/components/HomeClient";

export const revalidate = 300;

export default async function HomePage() {
  // Both calls throw on failure — no mock fallback.
  const [overview, costs] = await Promise.all([
    getSheetOverview(),
    getSheetCosts(),
  ]);

  const trip: TripMeta = {
    title:      overview.title,
    tagline:    overview.tagline,
    departure:  overview.departure,
    returnDate: overview.return,
    currency:   overview.currency,
    traveller:  overview.traveller,
  };

  return (
    <HomeClient
      prebooked={costs}
      travellers={overview.travellers}
      trip={trip}
    />
  );
}
