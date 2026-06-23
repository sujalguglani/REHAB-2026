export const TRIP = {
  title: "Vietnam 2026",
  tagline: "14 days. 5 cities. One unforgettable run.",
  departure: new Date("2026-07-15T00:00:00"),
  return: new Date("2026-07-28T23:59:59"),
  traveller: "Sujal",
};

export type Traveller = {
  id: string;
  name: string;
  initials: string;
  color: string;
  departureCity: string;
  departureCode: string;
  outbound: { airline: string; flightNo: string; route: string; date: string; time: string };
  return: { airline: string; flightNo: string; route: string; date: string; time: string };
};

export const TRAVELLERS: Traveller[] = [
  {
    id: "t1",
    name: "Sujal",
    initials: "S",
    color: "bg-amber-500",
    departureCity: "Singapore",
    departureCode: "SIN",
    outbound: { airline: "Singapore Airlines", flightNo: "SQ185", route: "SIN → HAN", date: "Wed 15 Jul", time: "08:30 → 11:05" },
    return:   { airline: "Singapore Airlines", flightNo: "SQ183", route: "SGN → SIN", date: "Tue 28 Jul", time: "20:45 → 23:55" },
  },
  {
    id: "t2",
    name: "Rohan",
    initials: "R",
    color: "bg-blue-500",
    departureCity: "Sydney",
    departureCode: "SYD",
    outbound: { airline: "Vietnam Airlines", flightNo: "VN780", route: "SYD → HAN", date: "Wed 15 Jul", time: "09:10 → 20:45" },
    return:   { airline: "Vietnam Airlines", flightNo: "VN781", route: "SGN → SYD", date: "Wed 29 Jul", time: "00:30 → 11:15" },
  },
  {
    id: "t3",
    name: "Priya",
    initials: "P",
    color: "bg-rose-500",
    departureCity: "Melbourne",
    departureCode: "MEL",
    outbound: { airline: "Jetstar", flightNo: "JQ87", route: "MEL → SGN", date: "Tue 14 Jul", time: "21:30 → 03:55+1" },
    return:   { airline: "Jetstar", flightNo: "JQ88", route: "SGN → MEL", date: "Tue 28 Jul", time: "22:10 → 08:25+1" },
  },
];

export const PLANNING_CHECKLIST = [
  { id: "flights",       label: "Flights booked",               defaultDone: true },
  { id: "accommodation", label: "All accommodation booked",      defaultDone: true },
  { id: "cruise",        label: "Ha Long cruise booked",         defaultDone: true },
  { id: "visa",          label: "Vietnam e-visa approved",       defaultDone: false },
  { id: "insurance",     label: "Travel insurance sorted",       defaultDone: false },
  { id: "mySon",         label: "My Son Sanctuary tour booked",  defaultDone: false },
  { id: "cuChi",         label: "Cu Chi Tunnels tour booked",    defaultDone: false },
  { id: "mekong",        label: "Mekong Delta tour booked",      defaultDone: false },
  { id: "forex",         label: "VND cash / card ready",         defaultDone: false },
  { id: "sim",           label: "Vietnam SIM card sorted",       defaultDone: false },
  { id: "packing",       label: "Packing done",                  defaultDone: false },
];

export type DayActivity = { time: string; label: string; status: string };
export type TripDay = {
  day: number;
  date: string;
  isoDate: string;
  city: string;
  region: string;
  theme: string;
  booked: DayActivity[];
  ifTime: string[];
  transport: { label: string; detail: string };
  sideQuest: { category: string; text: string };
};

export const DAYS: TripDay[] = [
  {
    day: 1, date: "Wed 15 Jul", isoDate: "2026-07-15",
    city: "Hanoi", region: "Old Quarter",
    theme: "Land, acclimatise, eat everything.",
    booked: [
      { time: "Arrival", label: "Check in — La Siesta Classic Ma May", status: "Booked" },
      { time: "Eve", label: "Old Quarter wander + Hoan Kiem Lake", status: "Free" },
    ],
    ifTime: ["Bia hoi corner on Tạ Hiện St", "Bánh cuốn stall near Đồng Xuân Market"],
    transport: { label: "Noi Bai Airport → Old Quarter", detail: "Grab Car ~45 min, ~200,000 VND or Airport Bus 86 (9,000 VND)" },
    sideQuest: { category: "social", text: "Find a bia hoi stall and share a table with locals. Pay under 50,000 VND per beer." },
  },
  {
    day: 2, date: "Thu 16 Jul", isoDate: "2026-07-16",
    city: "Hanoi", region: "Old Quarter → West Lake",
    theme: "Temples, lakes and legendary street food.",
    booked: [
      { time: "AM", label: "Temple of Literature", status: "Entry fee" },
      { time: "PM", label: "West Lake cycling", status: "Self-guided" },
      { time: "Eve", label: "Tran Quoc Pagoda at sunset", status: "Free" },
    ],
    ifTime: ["Hanoi Social Club for lunch", "Truc Bach Lake walk"],
    transport: { label: "Around Hanoi", detail: "Grab Bike or walk — Old Quarter is very compact" },
    sideQuest: { category: "food", text: "Eat pho at dawn — sidewalk stall before 7am, tiny stools, cash only, no English menu." },
  },
  {
    day: 3, date: "Fri 17 Jul", isoDate: "2026-07-17",
    city: "Hanoi", region: "Ba Dinh → Old Quarter",
    theme: "History, egg coffee and one very famous street.",
    booked: [
      { time: "AM", label: "Ho Chi Minh Mausoleum Complex", status: "Free" },
      { time: "PM", label: "Bún Chả Hương Liên — Obama's spot", status: "Walk-in" },
      { time: "Eve", label: "Egg coffee — Cà Phê Giảng rooftop", status: "Walk-in" },
    ],
    ifTime: ["Train Street (check access day-of)", "Đồng Xuân Night Market"],
    transport: { label: "Around Hanoi", detail: "Grab or walk between districts" },
    sideQuest: { category: "photo", text: "Capture a shot on Hanoi's famous Train Street. Check local access status morning-of." },
  },
  {
    day: 4, date: "Sat 18 Jul", isoDate: "2026-07-18",
    city: "Ha Long Bay", region: "Cruise — Day 1",
    theme: "Board the ship. Watch the karsts arrive.",
    booked: [
      { time: "AM", label: "Transfer Hanoi → Ha Long Bay pier (~3.5 hrs)", status: "Included" },
      { time: "Noon", label: "Embark — Paradise Elegance Cruise", status: "Booked" },
      { time: "PM", label: "Kayaking through caves", status: "Included" },
      { time: "Eve", label: "Sunset drinks on top deck", status: "On ship" },
    ],
    ifTime: ["Squid fishing off the stern at night", "Stargazing from the sundeck"],
    transport: { label: "Hanoi → Ha Long City", detail: "Limousine bus included with cruise booking, depart hotel ~8am" },
    sideQuest: { category: "luxury", text: "Watch the Ha Long Bay sunset from the top deck. Cocktail mandatory. No phones for 10 minutes." },
  },
  {
    day: 5, date: "Sun 19 Jul", isoDate: "2026-07-19",
    city: "Ha Long Bay → Da Nang", region: "Cruise Day 2 + Fly",
    theme: "Caves, kayaks and karst reflections.",
    booked: [
      { time: "AM", label: "Sung Sot Cave tour", status: "Included" },
      { time: "Mid", label: "Bamboo boat through lagoon", status: "Included" },
      { time: "PM", label: "Return to pier → Transfer to Hanoi airport", status: "Included" },
      { time: "18:00", label: "VietJet VJ531 HAN → DAD", status: "Booked" },
    ],
    ifTime: ["Ti Top Island beach swim if scheduled", "Extra kayak time before disembark"],
    transport: { label: "Ha Long → Hanoi → Da Nang → Hoi An", detail: "Cruise transfer + flight + Grab to Hoi An (~45 min)" },
    sideQuest: { category: "photo", text: "Get the perfect karst reflection — calm morning water, golden light, zero boats in frame." },
  },
  {
    day: 6, date: "Mon 20 Jul", isoDate: "2026-07-20",
    city: "Hoi An", region: "Ancient Town",
    theme: "Lanterns, the most beautiful old town in Asia.",
    booked: [
      { time: "AM", label: "Check in — Anantara Hoi An Resort", status: "Booked" },
      { time: "PM", label: "Ancient Town walk — Japanese Covered Bridge", status: "Free entry" },
      { time: "Eve", label: "Thu Bon River at dusk", status: "Free" },
    ],
    ifTime: ["Hoi An Roastery coffee", "Night market along the river"],
    transport: { label: "Da Nang Airport → Hoi An", detail: "Grab Car ~45 min, ~300,000 VND" },
    sideQuest: { category: "photo", text: "Capture lantern reflections on the Thu Bon River at dusk. Golden hour only. No filters needed." },
  },
  {
    day: 7, date: "Tue 21 Jul", isoDate: "2026-07-21",
    city: "Hoi An", region: "Tailors + An Bang Beach",
    theme: "Get measured in the morning, hit the beach by noon.",
    booked: [
      { time: "AM", label: "Tailor appointment — Yaly Couture", status: "Book on Day 6" },
      { time: "PM", label: "An Bang Beach", status: "Self-guided" },
      { time: "Eve", label: "Collect tailored clothes", status: "Same day" },
    ],
    ifTime: ["White Marble Beach Bar sundowner", "Hoi An Memories show (check dates)"],
    transport: { label: "Hoi An → An Bang Beach", detail: "Bicycle hire ~30,000 VND/day or Grab" },
    sideQuest: { category: "shopping", text: "Get something custom-made at a Hoi An tailor. Wear it the same day. Bonus if it's ridiculous." },
  },
  {
    day: 8, date: "Wed 22 Jul", isoDate: "2026-07-22",
    city: "Hoi An → Da Nang", region: "My Son + Marble Mountains",
    theme: "Ancient ruins and sacred caves.",
    booked: [
      { time: "AM", label: "My Son Sanctuary tour", status: "Book ahead" },
      { time: "PM", label: "Marble Mountains, Da Nang", status: "Self-guided" },
      { time: "Eve", label: "Back to Hoi An — final dinner", status: "Free" },
    ],
    ifTime: ["Non Nuoc pottery village", "Dragon Bridge at night in Da Nang"],
    transport: { label: "Hoi An → My Son → Da Nang → Hoi An", detail: "Tour includes transport or Grab (~300,000 VND each way)" },
    sideQuest: { category: "history", text: "Find the most peaceful spot in My Son. Sit in silence for 5 minutes. No photos during those 5 minutes." },
  },
  {
    day: 9, date: "Thu 23 Jul", isoDate: "2026-07-23",
    city: "Hue", region: "Imperial City",
    theme: "Vietnam's royal heartland.",
    booked: [
      { time: "AM", label: "Drive Hoi An → Hue via Hải Vân Pass (scenic)", status: "Arrange day before" },
      { time: "PM", label: "Check in — Azerai La Résidence Huế", status: "Booked" },
      { time: "PM", label: "Imperial Citadel & Forbidden Purple City", status: "Entry fee" },
    ],
    ifTime: ["Thien Mu Pagoda by Perfume River", "Tu Duc Royal Tomb"],
    transport: { label: "Hoi An → Hue", detail: "Private car over Hải Vân Pass ~3 hrs (scenic) or train 3h30" },
    sideQuest: { category: "food", text: "Eat Bún Bò Huế from a local stall — spicy, lemongrass-loaded, not the tourist version." },
  },
  {
    day: 10, date: "Fri 24 Jul", isoDate: "2026-07-24",
    city: "Hue → Ho Chi Minh City", region: "Royal Tombs + Fly",
    theme: "Emperors, pagodas and a flight south.",
    booked: [
      { time: "AM", label: "Khai Dinh Tomb", status: "Entry fee" },
      { time: "AM", label: "Minh Mang Tomb", status: "Entry fee" },
      { time: "PM", label: "Perfume River dragon boat ride", status: "Haggle at pier" },
      { time: "19:30", label: "VietJet VJ130 DAD → SGN", status: "Booked" },
    ],
    ifTime: ["Đông Ba Market for Bánh Khoái", "Phuoc Tich Ancient Village"],
    transport: { label: "Hue → Da Nang → HCMC", detail: "Car to Da Nang airport ~1 hr, then VietJet 19:30" },
    sideQuest: { category: "random", text: "Hire a cyclo (three-wheeled taxi) for 30 minutes and let the driver choose the entire route." },
  },
  {
    day: 11, date: "Sat 25 Jul", isoDate: "2026-07-25",
    city: "Ho Chi Minh City", region: "District 1 + Cu Chi",
    theme: "The city that never stops.",
    booked: [
      { time: "AM", label: "Check in — The Reverie Saigon", status: "Booked" },
      { time: "PM", label: "Cu Chi Tunnels half-day tour", status: "Book ahead" },
      { time: "Eve", label: "Bến Thành Market + Night Market", status: "Free" },
    ],
    ifTime: ["War Remnants Museum (intense, essential)", "Saigon Skydeck — Bitexco Tower"],
    transport: { label: "Tan Son Nhat Airport → District 1", detail: "Grab Car ~30 min, ~150,000 VND" },
    sideQuest: { category: "history", text: "Crawl through the original-width B2 section of Cu Chi Tunnels. If you fit, you do it." },
  },
  {
    day: 12, date: "Sun 26 Jul", isoDate: "2026-07-26",
    city: "Ho Chi Minh City", region: "Districts 3 + 1",
    theme: "Museums, motorbikes and rooftop bars.",
    booked: [
      { time: "AM", label: "War Remnants Museum", status: "Entry fee" },
      { time: "PM", label: "Notre-Dame Cathedral + Central Post Office", status: "Free" },
      { time: "Eve", label: "Chill Sky Bar or Social Club rooftop", status: "Walk-in" },
    ],
    ifTime: ["Nguyễn Văn Bình Book Street", "Fine Arts Museum"],
    transport: { label: "Around HCMC", detail: "Grab Bike for short hops, walk in District 1" },
    sideQuest: { category: "nightlife", text: "Toast to the whole trip from a HCMC rooftop as the city lights come on. Make it ceremonial." },
  },
  {
    day: 13, date: "Mon 27 Jul", isoDate: "2026-07-27",
    city: "Mekong Delta", region: "Bến Tre + Cần Thơ",
    theme: "Boats, canals and coconut candy.",
    booked: [
      { time: "All day", label: "Mekong Delta day tour from HCMC", status: "Book ahead" },
      { time: "All day", label: "Sampan boats, floating markets, coconut farms", status: "Included" },
      { time: "Eve", label: "Back to HCMC — final dinner", status: "Free" },
    ],
    ifTime: ["Cái Răng Floating Market (6–7am, arrange with tour)", "Coconut candy workshop"],
    transport: { label: "HCMC → Mekong Delta", detail: "Tour includes transfer (~2 hrs each way)" },
    sideQuest: { category: "food", text: "Order from a floating market vendor from a boat using only hand signals. Points for confidence." },
  },
  {
    day: 14, date: "Tue 28 Jul", isoDate: "2026-07-28",
    city: "Ho Chi Minh City", region: "Departure Day",
    theme: "Last coffee. Last bánh mì. Then home.",
    booked: [
      { time: "AM", label: "Final bánh mì — Bánh Mì Huỳnh Hoa", status: "Walk-in" },
      { time: "Noon", label: "Check out — The Reverie Saigon", status: "Noon" },
      { time: "PM", label: "Transfer to Tân Sơn Nhất Airport", status: "Grab" },
      { time: "20:45", label: "Singapore Airlines SQ183 SGN → SIN", status: "Booked" },
    ],
    ifTime: ["One last cà phê sữa đá (Vietnamese iced coffee)", "Souvenir shops near Bến Thành"],
    transport: { label: "Hotel → Tân Sơn Nhất Airport", detail: "Grab Car, allow 60+ min for traffic" },
    sideQuest: { category: "random", text: "At the airport, write your top 3 moments on paper. Seal it. Don't open for 6 months." },
  },
];

export type Flight = {
  id: string; label: string; detail: string; airline: string;
  flightNo: string; date: string; time: string; status: string; bookingUrl: string;
};
export type Stay = {
  id: string; label: string; city: string; dates: string; note: string;
  status: string; mapsUrl: string; bookingUrl: string;
};

export const BOOKINGS: { flights: Flight[]; stays: Stay[] } = {
  flights: [
    {
      id: "f1", label: "Outbound", detail: "Singapore → Hanoi",
      airline: "Singapore Airlines", flightNo: "SQ185",
      date: "Wed 15 Jul", time: "08:30 → 11:05",
      status: "Booked", bookingUrl: "https://www.singaporeair.com",
    },
    {
      id: "f2", label: "Hanoi → Da Nang", detail: "After Ha Long cruise",
      airline: "VietJet Air", flightNo: "VJ531",
      date: "Sun 19 Jul", time: "18:00 → 19:20",
      status: "Booked", bookingUrl: "https://www.vietjetair.com",
    },
    {
      id: "f3", label: "Da Nang → HCMC", detail: "After Hue day",
      airline: "VietJet Air", flightNo: "VJ130",
      date: "Fri 24 Jul", time: "19:30 → 21:00",
      status: "Booked", bookingUrl: "https://www.vietjetair.com",
    },
    {
      id: "f4", label: "Return", detail: "Ho Chi Minh City → Singapore",
      airline: "Singapore Airlines", flightNo: "SQ183",
      date: "Tue 28 Jul", time: "20:45 → 23:55",
      status: "Booked", bookingUrl: "https://www.singaporeair.com",
    },
  ],
  stays: [
    {
      id: "s1", label: "La Siesta Classic Ma May", city: "Hanoi",
      dates: "Jul 15 – 18 · 3 nights", note: "Old Quarter, heart of Hanoi",
      status: "Booked",
      mapsUrl: "https://maps.google.com/?q=La+Siesta+Classic+Ma+May+Hanoi",
      bookingUrl: "https://www.lasiestahotels.vn",
    },
    {
      id: "s2", label: "Paradise Elegance Cruise", city: "Ha Long Bay",
      dates: "Jul 18 – 20 · 2 nights", note: "All-inclusive, embarks Ha Long pier",
      status: "Booked",
      mapsUrl: "https://maps.google.com/?q=Ha+Long+Bay+Pier",
      bookingUrl: "https://www.paradisecruises.com",
    },
    {
      id: "s3", label: "Anantara Hoi An Resort", city: "Hoi An",
      dates: "Jul 20 – 24 · 4 nights", note: "Thu Bon river, walk to Ancient Town",
      status: "Booked",
      mapsUrl: "https://maps.google.com/?q=Anantara+Hoi+An+Resort",
      bookingUrl: "https://www.anantara.com/en/hoi-an",
    },
    {
      id: "s4", label: "Azerai La Résidence Huế", city: "Hue",
      dates: "Jul 23 – 24 · 1 night", note: "Colonial heritage hotel on Perfume River",
      status: "Booked",
      mapsUrl: "https://maps.google.com/?q=Azerai+La+Residence+Hue",
      bookingUrl: "https://azerai.com/hotel/la-residence-hue",
    },
    {
      id: "s5", label: "The Reverie Saigon", city: "Ho Chi Minh City",
      dates: "Jul 25 – 28 · 3 nights", note: "5-star District 1, Times Square Building",
      status: "Booked",
      mapsUrl: "https://maps.google.com/?q=The+Reverie+Saigon",
      bookingUrl: "https://www.thereveriesaigon.com",
    },
  ],
};

export type FoodItem = {
  id: string; name: string; englishName: string; spot: string;
  address: string; city: string; price: string; category: string;
  description: string; itineraryDay: number; strategy: string;
  mapsUrl: string; fit: string;
};

export const FOOD: FoodItem[] = [
  {
    id: "food1", name: "Phở Bò", englishName: "Beef Noodle Soup",
    spot: "Phở Gia Truyền", address: "49 Bát Đàn, Hoàn Kiếm, Hanoi",
    city: "Hanoi", price: "$", category: "Noodles",
    description: "The most legendary bowl in Hanoi. Opens 6am, sells out by 9am. Join the queue.",
    itineraryDay: 2, strategy: "Day 2 morning — 7 min walk from La Siesta. Arrive before 8am.",
    mapsUrl: "https://maps.google.com/?q=Pho+Gia+Truyen+49+Bat+Dan+Hanoi", fit: "Perfect Match",
  },
  {
    id: "food2", name: "Bún Chả", englishName: "Grilled Pork + Noodles",
    spot: "Bún Chả Hương Liên", address: "24 Lê Văn Hưu, Hai Bà Trưng, Hanoi",
    city: "Hanoi", price: "$", category: "Street Food",
    description: "Where Obama and Bourdain ate. Still serves the same charcoal-grilled pork. Order the Obama combo.",
    itineraryDay: 3, strategy: "Day 3 lunch — 15 min Grab from Old Quarter.",
    mapsUrl: "https://maps.google.com/?q=Bun+Cha+Huong+Lien+Hanoi", fit: "Perfect Match",
  },
  {
    id: "food3", name: "Cà Phê Trứng", englishName: "Egg Coffee",
    spot: "Cà Phê Giảng", address: "39 Nguyễn Hữu Huân, Hoàn Kiếm, Hanoi",
    city: "Hanoi", price: "$", category: "Drinks",
    description: "Egg yolk whipped with condensed milk over strong espresso. A Hanoi original since 1946.",
    itineraryDay: 3, strategy: "Day 3 afternoon — 5 min walk from most Old Quarter spots.",
    mapsUrl: "https://maps.google.com/?q=Ca+Phe+Giang+Hanoi", fit: "Perfect Match",
  },
  {
    id: "food4", name: "Bánh Cuốn", englishName: "Steamed Rice Rolls",
    spot: "Bánh Cuốn Thanh Vân", address: "14 Hàng Gà, Hoàn Kiếm, Hanoi",
    city: "Hanoi", price: "$", category: "Street Food",
    description: "Silky steamed rice sheets filled with minced pork and mushroom. Eaten at breakfast only.",
    itineraryDay: 1, strategy: "Day 1 or 2 morning — 8 min walk from La Siesta.",
    mapsUrl: "https://maps.google.com/?q=Banh+Cuon+Thanh+Van+Hanoi", fit: "Easy Fit",
  },
  {
    id: "food5", name: "Chè", englishName: "Vietnamese Sweet Soup",
    spot: "Any Old Quarter stall", address: "Old Quarter, Hanoi",
    city: "Hanoi", price: "$", category: "Dessert",
    description: "Sweet bean or coconut-based dessert soups, hot or cold over ice. Strange and wonderful.",
    itineraryDay: 2, strategy: "Day 2 afternoon — dozens of Chè stalls in the Old Quarter.",
    mapsUrl: "https://maps.google.com/?q=Che+Hanoi+Old+Quarter", fit: "Easy Fit",
  },
  {
    id: "food6", name: "Mì Quảng", englishName: "Quang Noodles",
    spot: "Mì Quảng 1A", address: "1 Hải Phòng, Hải Châu, Da Nang",
    city: "Da Nang", price: "$", category: "Noodles",
    description: "Turmeric noodles in minimal broth with shrimp, pork, peanuts and crispy rice crackers.",
    itineraryDay: 5, strategy: "Day 5 evening — stop in Da Nang before heading to Hoi An.",
    mapsUrl: "https://maps.google.com/?q=Mi+Quang+1A+Da+Nang", fit: "Easy Fit",
  },
  {
    id: "food7", name: "Bánh Mì", englishName: "The Vietnamese Sandwich",
    spot: "Bánh Mì Phượng", address: "2B Phan Châu Trinh, Minh An, Hoi An",
    city: "Hoi An", price: "$", category: "Street Food",
    description: "Anthony Bourdain called it 'a symphony in a sandwich'. Always a queue. Always worth it.",
    itineraryDay: 6, strategy: "Day 6 or 7 — 5 min walk from Anantara. Go early.",
    mapsUrl: "https://maps.google.com/?q=Banh+Mi+Phuong+Hoi+An", fit: "Perfect Match",
  },
  {
    id: "food8", name: "Cao Lầu", englishName: "Hoi An Noodles",
    spot: "Cao Lầu Thanh", address: "26 Thái Phiên, Minh An, Hoi An",
    city: "Hoi An", price: "$", category: "Noodles",
    description: "Made with water from a specific Hoi An well. Thick chewy noodles you can only truly eat here.",
    itineraryDay: 6, strategy: "Day 6 Ancient Town wander — in the heart of the old town.",
    mapsUrl: "https://maps.google.com/?q=Cao+Lau+Thanh+Hoi+An", fit: "Perfect Match",
  },
  {
    id: "food9", name: "Bánh Bao Vạc", englishName: "White Rose Dumplings",
    spot: "White Rose Restaurant", address: "533 Hai Bà Trưng, Sơn Phong, Hoi An",
    city: "Hoi An", price: "$$", category: "Dumplings",
    description: "Delicate shrimp-filled rice dumplings shaped like rose blossoms. Made by one family only.",
    itineraryDay: 7, strategy: "Day 7 lunch — easy Grab from Anantara.",
    mapsUrl: "https://maps.google.com/?q=White+Rose+Restaurant+Hoi+An", fit: "Easy Fit",
  },
  {
    id: "food10", name: "Bún Bò Huế", englishName: "Hue Spicy Beef Noodles",
    spot: "Bún Bò Bà Tuyết", address: "47 Nguyễn Công Trứ, Phú Hội, Hue",
    city: "Hue", price: "$", category: "Noodles",
    description: "Spicier and more complex than pho. Lemongrass broth, thick round noodles. Hue's pride.",
    itineraryDay: 9, strategy: "Day 9 morning — eat before the Imperial Citadel.",
    mapsUrl: "https://maps.google.com/?q=Bun+Bo+Ba+Tuyet+Hue", fit: "Perfect Match",
  },
  {
    id: "food11", name: "Bánh Khoái", englishName: "Hue Sizzling Pancake",
    spot: "Bánh Khoái Lạc Thiện", address: "6 Đinh Tiên Hoàng, Thuận Hòa, Hue",
    city: "Hue", price: "$", category: "Street Food",
    description: "Crispy turmeric crepe with shrimp, pork and bean sprouts. Wrap in rice paper, dip in sauce.",
    itineraryDay: 10, strategy: "Day 10 morning before tomb visits.",
    mapsUrl: "https://maps.google.com/?q=Banh+Khoai+Lac+Thien+Hue", fit: "Easy Fit",
  },
  {
    id: "food12", name: "Cơm Tấm", englishName: "Broken Rice",
    spot: "Cơm Tấm Bà Ghiền", address: "45/5 Bùi Thị Xuân, District 1, HCMC",
    city: "Ho Chi Minh City", price: "$", category: "Rice",
    description: "Saigon's default meal. Broken rice with grilled pork chop, egg and pickled veg. Perfect any hour.",
    itineraryDay: 11, strategy: "Day 11 morning after arriving — 10 min Grab from The Reverie.",
    mapsUrl: "https://maps.google.com/?q=Com+Tam+Ba+Ghien+HCMC", fit: "Perfect Match",
  },
  {
    id: "food13", name: "Gỏi Cuốn", englishName: "Fresh Spring Rolls",
    spot: "Wrap & Roll or any street stall", address: "District 1, HCMC",
    city: "Ho Chi Minh City", price: "$", category: "Street Food",
    description: "Translucent rice paper rolls with shrimp, pork, herbs and vermicelli. Hoisin-peanut dipping sauce.",
    itineraryDay: 12, strategy: "Day 12 anytime — ubiquitous across HCMC.",
    mapsUrl: "https://maps.google.com/?q=Wrap+Roll+HCMC+District+1", fit: "Easy Fit",
  },
  {
    id: "food14", name: "Hủ Tiếu Nam Vang", englishName: "Southern Noodle Soup",
    spot: "Hủ Tiếu Thanh Xuân", address: "District 5, HCMC",
    city: "Ho Chi Minh City", price: "$", category: "Noodles",
    description: "Cambodian-influenced HCMC noodle soup — clear broth, rice noodles, pork, shrimp, quail eggs.",
    itineraryDay: 12, strategy: "Day 12 morning — Grab to District 5 for local neighbourhood feel.",
    mapsUrl: "https://maps.google.com/?q=Hu+Tieu+Nam+Vang+HCMC", fit: "Easy Fit",
  },
  {
    id: "food15", name: "Bánh Mì Huỳnh Hoa", englishName: "The HCMC Bánh Mì",
    spot: "Bánh Mì Huỳnh Hoa", address: "26 Lê Thị Riêng, District 1, HCMC",
    city: "Ho Chi Minh City", price: "$", category: "Street Food",
    description: "Most-loaded bánh mì in Saigon. Double pâté, double meat, pillow-soft bread. Your final meal.",
    itineraryDay: 14, strategy: "Day 14 morning — your last meal in Vietnam. Make it count.",
    mapsUrl: "https://maps.google.com/?q=Banh+Mi+Huynh+Hoa+HCMC", fit: "Perfect Match",
  },
];

export const BUDGET_PREBOOKED = [
  { id: "b1", label: "Return Flights — Singapore Airlines", category: "Flights", amount: 1800, paid: true },
  { id: "b2", label: "VietJet HAN → DAD (VJ531)", category: "Flights", amount: 80, paid: true },
  { id: "b3", label: "VietJet DAD → SGN (VJ130)", category: "Flights", amount: 80, paid: true },
  { id: "b4", label: "La Siesta Classic (3 nights)", category: "Accommodation", amount: 360, paid: true },
  { id: "b5", label: "Paradise Elegance Cruise (2 nights, all-incl.)", category: "Accommodation", amount: 900, paid: true },
  { id: "b6", label: "Anantara Hoi An (4 nights)", category: "Accommodation", amount: 960, paid: true },
  { id: "b7", label: "Azerai La Résidence Huế (1 night)", category: "Accommodation", amount: 280, paid: true },
  { id: "b8", label: "The Reverie Saigon (3 nights)", category: "Accommodation", amount: 1050, paid: true },
];

export const DAILY_ESTIMATES = [
  { day: 1, label: "Arrive Hanoi", food: 30, transport: 30, activities: 0, other: 20 },
  { day: 2, label: "Hanoi", food: 40, transport: 15, activities: 10, other: 10 },
  { day: 3, label: "Hanoi", food: 40, transport: 20, activities: 10, other: 20 },
  { day: 4, label: "Ha Long Bay (cruise incl.)", food: 0, transport: 0, activities: 0, other: 30 },
  { day: 5, label: "Ha Long + Da Nang", food: 20, transport: 40, activities: 0, other: 10 },
  { day: 6, label: "Hoi An", food: 40, transport: 30, activities: 10, other: 20 },
  { day: 7, label: "Hoi An (tailor day)", food: 40, transport: 20, activities: 0, other: 200 },
  { day: 8, label: "My Son + Marble Mountains", food: 40, transport: 40, activities: 60, other: 10 },
  { day: 9, label: "Hue", food: 40, transport: 60, activities: 30, other: 10 },
  { day: 10, label: "Hue Tombs + fly HCMC", food: 40, transport: 40, activities: 40, other: 10 },
  { day: 11, label: "HCMC + Cu Chi Tunnels", food: 40, transport: 30, activities: 80, other: 20 },
  { day: 12, label: "HCMC", food: 50, transport: 20, activities: 20, other: 50 },
  { day: 13, label: "Mekong Delta", food: 20, transport: 0, activities: 80, other: 10 },
  { day: 14, label: "Departure day", food: 30, transport: 30, activities: 0, other: 50 },
];

export type Quest = {
  id: string; category: string; city: string;
  title: string; description: string;
};

export const QUESTS: Quest[] = [
  { id: "q1", category: "food", city: "Hanoi", title: "Phở at dawn", description: "Sidewalk pho stall before 7am. Tiny stools, cash only, no English menu. Make it work." },
  { id: "q2", category: "food", city: "Hoi An", title: "Bánh mì taste test", description: "Eat bánh mì from 3 different spots in 24 hours. Rank them ruthlessly. No ties." },
  { id: "q3", category: "food", city: "Any", title: "Mystery menu", description: "Order something you cannot read using only hand gestures and enthusiasm." },
  { id: "q4", category: "food", city: "Hanoi", title: "Egg coffee ceremony", description: "Sit on a Hanoi rooftop and drink cà phê trứng very, very slowly. No rushing." },
  { id: "q5", category: "food", city: "HCMC", title: "Last bánh mì", description: "Your last meal on Vietnamese soil must be a bánh mì from Huỳnh Hoa. Non-negotiable." },
  { id: "q6", category: "photo", city: "Hanoi", title: "Train Street", description: "Get the iconic Train Street shot. Check access status day-of." },
  { id: "q7", category: "photo", city: "Hoi An", title: "Lantern reflection", description: "Capture lanterns on the Thu Bon River at dusk. Golden hour only." },
  { id: "q8", category: "photo", city: "Ha Long Bay", title: "Perfect karst mirror", description: "Calm water, limestone karsts, golden light. Zero boats in frame." },
  { id: "q9", category: "photo", city: "HCMC", title: "Motorbike swarm", description: "Capture the HCMC motorbike swarm at rush hour from above. No staged shots." },
  { id: "q10", category: "history", city: "My Son", title: "5 minutes of silence", description: "Find My Son's most peaceful spot. Sit in silence for 5 minutes. No photos during." },
  { id: "q11", category: "history", city: "HCMC", title: "Cu Chi tunnel crawl", description: "Crawl through the original-width B2 tunnel section. If you fit, you do it." },
  { id: "q12", category: "history", city: "HCMC", title: "War Remnants reflection", description: "Write one sentence about the most powerful thing you saw. Keep it." },
  { id: "q13", category: "shopping", city: "Hoi An", title: "Same-day tailor", description: "Get something custom-made at a Hoi An tailor and wear it the same day." },
  { id: "q14", category: "shopping", city: "Any", title: "Night market haggle", description: "Haggle at a night market. Start at 30% asking price. Walk away at least once." },
  { id: "q15", category: "social", city: "Hanoi", title: "Bia hoi session", description: "Share a table at a bia hoi stall. Under 50,000 VND per beer. Don't speak first." },
  { id: "q16", category: "social", city: "Any", title: "Grab driver rec", description: "Ask your Grab driver for their personal favourite restaurant. Actually go." },
  { id: "q17", category: "social", city: "Any", title: "Learn 5 phrases", description: "Master: Xin chào · Cảm ơn · Ngon quá! · Bao nhiêu tiền? · Không cay. Use all 5 in one day." },
  { id: "q18", category: "luxury", city: "Ha Long Bay", title: "Cruise sundeck sunset", description: "Sunset from the top deck. Cocktail mandatory. No phones for 10 full minutes." },
  { id: "q19", category: "luxury", city: "HCMC", title: "Rooftop Saigon toast", description: "Toast to the trip from a HCMC rooftop as the city lights come on. Make it ceremonial." },
  { id: "q20", category: "cheap thrill", city: "HCMC", title: "Street crossing like a local", description: "Cross a busy HCMC intersection — steady pace, no hesitation, eye contact with drivers." },
  { id: "q21", category: "cheap thrill", city: "Any", title: "Grab Bike mission", description: "Take a Grab Bike (motorbike taxi) for at least one journey. Helmet on, grip tight." },
  { id: "q22", category: "random", city: "Hue", title: "Cyclo exploration", description: "Hire a cyclo for 30 minutes and let the driver choose the route entirely." },
  { id: "q23", category: "random", city: "Airport", title: "Memory capsule", description: "At the airport, write top 3 moments on paper. Seal it. Don't open for 6 months." },
  { id: "q24", category: "random", city: "Any", title: "Temple incense", description: "Light incense at a temple. Make a wish. Stand in the smoke — it's good luck." },
];
