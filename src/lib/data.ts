// ─── Types still used by googleSheets.ts and page components ─────────────────

export type DayActivity = { time: string; label: string; status: string };

export type TripDay = {
  day:       number;
  date:      string;
  isoDate:   string;
  city:      string;
  region:    string;
  theme:     string;
  booked:    DayActivity[];
  ifTime:    string[];
  transport: { label: string; detail: string };
  sideQuest: { category: string; text: string };
};

// ─── Planning checklist (localStorage-persisted, not from sheet) ──────────────

export const PLANNING_CHECKLIST = [
  { id: "flights",       label: "Flights booked",                defaultDone: true  },
  { id: "accommodation", label: "All accommodation booked",       defaultDone: true  },
  { id: "visa",          label: "Vietnam / HK e-visa approved",  defaultDone: false },
  { id: "insurance",     label: "Travel insurance sorted",        defaultDone: false },
  { id: "forex",         label: "VND / HKD cash / card ready",   defaultDone: false },
  { id: "sim",           label: "Local SIM card sorted",          defaultDone: false },
  { id: "packing",       label: "Packing done",                   defaultDone: false },
];

// ─── Bookings (no sheet tab — kept here until a Bookings sheet is added) ──────

export type Flight = {
  id: string; label: string; detail: string; airline: string;
  flightNo: string; date: string; time: string; status: string; bookingUrl: string;
};

export type Stay = {
  id: string; label: string; city: string; dates: string; note: string;
  status: string; mapsUrl: string; bookingUrl: string;
};

export const BOOKINGS: { flights: Flight[]; stays: Stay[] } = {
  flights: [],
  stays:   [],
};

// ─── Food (no sheet tab — kept here until a Food sheet is added) ──────────────

export type FoodItem = {
  id: string; name: string; englishName: string; spot: string;
  address: string; city: string; price: string; category: string;
  description: string; itineraryDay: number; strategy: string;
  mapsUrl: string; fit: string;
};

export const FOOD: FoodItem[] = [];
