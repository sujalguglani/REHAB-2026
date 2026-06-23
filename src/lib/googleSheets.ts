/**
 * googleSheets.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetches data from a publicly shared Google Sheet using CSV export URLs.
 * No authentication required — sheet must be "Anyone with the link → Viewer".
 *
 * No environment variables needed. No service account. No API keys.
 *
 * Sheet structure expected:
 *   Overview    – "Field" | "Value" rows (key/value pairs)
 *   Cost        – Label, Category, Amount, Paid, Notes
 *   Ho Chi Minh / Hong Kong / Macau – Day, Date, City, Activity, Status, etc.
 *   Side Quests – Title, Category, City, Description
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import type { TripDay, DayActivity } from './data';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SheetTrip = {
  title:      string;
  tagline:    string;
  departure:  string; // ISO date string e.g. "2026-07-15"
  return:     string; // ISO date string
  travellers: string[];
  currency:   string;
  traveller:  string; // primary traveller name
};

export type SheetCostItem = {
  id:       string;
  label:    string;
  category: string;
  amount:   number;
  paid:     boolean;
  notes:    string;
};

export type { TripDay };

export type SheetQuest = {
  id:          string;
  title:       string;
  category:    string;
  city:        string;
  description: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// CSV fetching + parsing
// ─────────────────────────────────────────────────────────────────────────────

// ⚠ If this still fails: open your sheet in Chrome, copy the full URL,
// and paste ONLY the segment between /d/ and /edit into SPREADSHEET_ID below.
const SPREADSHEET_ID = '1OYe9_IuiqwWdR5vBZnpMc0Ls9uR3tyIvbIkyIx0eIvs';

function csvUrl(sheetName: string): string {
  return (
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
    `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  );
}

/** Split CSV text into logical lines, respecting quoted newlines. */
function splitLines(text: string): string[] {
  const lines: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; }   // escaped quote
      else { inQ = !inQ; cur += ch; }
    } else if (ch === '\r') {
      // skip bare CR
    } else if (ch === '\n' && !inQ) {
      lines.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Parse one CSV row into an array of field strings. */
function parseRow(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i <= line.length) {
    if (i === line.length) { fields.push(''); break; }
    if (line[i] === '"') {
      let field = ''; i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { field += '"'; i += 2; }
        else if (line[i] === '"') { i++; break; }
        else { field += line[i++]; }
      }
      fields.push(field);
      if (line[i] === ',') i++; else break;
    } else {
      const end = line.indexOf(',', i);
      if (end === -1) { fields.push(line.slice(i)); break; }
      fields.push(line.slice(i, end)); i = end + 1;
    }
  }
  return fields;
}

/** Parse CSV text → array of {header: value} objects.
 *  Extra values beyond the header count are stored as _col2, _col3 … so
 *  callers can access them (e.g. "Travellers | Sujal | Lukas | Aaron"). */
function parseCSV(text: string): Record<string, string>[] {
  const lines = splitLines(text).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h] = (vals[j] ?? '').trim(); });
    // Capture extra values (beyond header count) with synthetic keys
    for (let j = headers.length; j < vals.length; j++) {
      const v = vals[j].trim();
      if (v) row[`_col${j}`] = v;
    }
    return row;
  });
}

/** Fetch a named sheet as parsed CSV rows. Never throws — returns [] on any problem. */
async function fetchSheet(sheetName: string): Promise<Record<string, string>[]> {
  const url = csvUrl(sheetName);
  console.log(`[sheets] fetching: ${url}`);

  let res: Response;
  try {
    // cache: 'no-store' because unstable_cache handles our 5-min revalidation.
    res = await fetch(url, { cache: 'no-store' });
  } catch (err) {
    console.warn(`[sheets] Network error for "${sheetName}": ${(err as Error).message} — returning []`);
    return [];
  }

  if (!res.ok) {
    console.warn(`[sheets] HTTP ${res.status} for "${sheetName}" — returning []`);
    return [];
  }

  const text = await res.text();

  // Google redirects unauthenticated requests to a login HTML page
  // instead of returning CSV — detect and warn clearly.
  if (text.trimStart().startsWith('<!') || text.trimStart().startsWith('<html')) {
    console.warn(
      `[sheets] Got HTML instead of CSV for "${sheetName}". ` +
      `Check Share → Anyone with the link → Viewer. — returning []`
    );
    return [];
  }

  // Empty body or header-only (no data rows) — valid, not an error.
  if (!text.trim()) {
    console.warn(`[sheets] "${sheetName}" is empty — returning []`);
    return [];
  }

  const rows = parseCSV(text);

  // parseCSV returns [] when there are 0 data rows (header-only sheet)
  if (rows.length === 0) {
    console.warn(`[sheets] "${sheetName}" has headers but no data rows — returning []`);
    return [];
  }

  console.log(`[sheets] ✓ "${sheetName}" — ${rows.length} rows, headers: [${Object.keys(rows[0]).join(', ')}]`);
  return rows;
}

/**
 * Fetch a sheet and return every row as a plain string array (no header mapping).
 * Used for sheets like Overview that have NO header row — just key/value pairs.
 * Never throws; returns [] on any problem.
 */
async function fetchSheetRaw(sheetName: string): Promise<string[][]> {
  const url = csvUrl(sheetName);
  console.log(`[sheets] fetching raw: ${url}`);

  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (err) {
    console.warn(`[sheets] Network error for "${sheetName}": ${(err as Error).message}`);
    return [];
  }

  if (!res.ok) {
    console.warn(`[sheets] HTTP ${res.status} for "${sheetName}" — returning []`);
    return [];
  }

  const text = await res.text();

  if (text.trimStart().startsWith('<!') || text.trimStart().startsWith('<html')) {
    console.warn(`[sheets] Got HTML for "${sheetName}" — check sharing settings`);
    return [];
  }

  if (!text.trim()) {
    console.warn(`[sheets] "${sheetName}" is empty`);
    return [];
  }

  const rows = splitLines(text)
    .filter(l => l.trim())
    .map(l => parseRow(l).map(v => v.trim()));

  console.log(`[sheets] ✓ "${sheetName}" (raw) — ${rows.length} rows`);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  january:1,february:2,march:3,april:4,may:5,june:6,
  july:7,august:8,september:9,october:10,november:11,december:12,
  jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,
};

/**
 * Parse a single natural-language date string like "November 23rd 2026"
 * or "23 Nov 2026" or "2026-11-23" → ISO "YYYY-MM-DD", or null on failure.
 */
function parseNaturalDate(raw: string): string | null {
  const s = raw.trim().replace(/(\d+)(st|nd|rd|th)/gi, '$1'); // strip ordinals

  // ISO / numeric: 2026-11-23
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2,'0')}-${iso[3].padStart(2,'0')}`;

  // "Month Day Year"  e.g. November 23 2026
  const mdy = s.match(/([a-z]+)\s+(\d{1,2})\s+(\d{4})/i);
  if (mdy) {
    const m = MONTH_MAP[mdy[1].toLowerCase()];
    if (m) return `${mdy[3]}-${String(m).padStart(2,'0')}-${mdy[2].padStart(2,'0')}`;
  }

  // "Day Month Year"  e.g. 23 November 2026
  const dmy = s.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i);
  if (dmy) {
    const m = MONTH_MAP[dmy[2].toLowerCase()];
    if (m) return `${dmy[3]}-${String(m).padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
  }

  // Numeric  DD/MM/YYYY or DD-MM-YYYY
  const num = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (num) return `${num[3]}-${num[2].padStart(2,'0')}-${num[1].padStart(2,'0')}`;

  return null;
}

/**
 * Parse a trip-duration string like "November 23rd 2026 to December 5th 2026"
 * → { start: "2026-11-23", end: "2026-12-05" } or null.
 */
function parseTripDuration(value: string): { start: string; end: string } | null {
  // Split on " to " or " – " or " - "
  const parts = value.split(/\s+to\s+|\s*[–\-]\s+/i);
  if (parts.length === 2) {
    const start = parseNaturalDate(parts[0]);
    const end   = parseNaturalDate(parts[1]);
    if (start && end) return { start, end };
  }
  return null;
}

/** Try multiple column name variants (case-insensitive, underscore forms). */
function col(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    for (const v of [k, k.toLowerCase(), k.toUpperCase(), k.replace(/ /g, '_')]) {
      const val = row[v];
      if (val !== undefined && val.trim() !== '') return val.trim();
    }
  }
  return '';
}

function parseBool(s: string): boolean {
  return ['true', 'yes', '1', '✓', 'paid', 'done', 'booked'].includes(s.toLowerCase().trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw fetchers
// ─────────────────────────────────────────────────────────────────────────────

async function _fetchOverview(): Promise<SheetTrip> {
  // Use raw rows because the Overview sheet has NO header row —
  // it is just key/value pairs: column A = field name, column B = value.
  // Using fetchSheet() here would treat row 0 as headers, corrupting everything.
  const rawRows = await fetchSheetRaw('Overview');

  let title      = '';
  let tagline    = '';
  let departure  = '';
  let returnDate = '';
  let currency   = '';
  const travellers: string[] = [];

  for (const cells of rawRows) {
    const field = (cells[0] ?? '').trim().toLowerCase();
    const value = (cells[1] ?? '').trim();
    if (!field) continue;

    // ── Dates ──────────────────────────────────────────────────────────────
    if (field === 'trip duration' || field === 'dates' || field === 'trip dates') {
      const parsed = parseTripDuration(value);
      if (parsed) { departure = parsed.start; returnDate = parsed.end; }

    } else if (field === 'start date' || field === 'departure date' || field === 'departure' || field === 'start') {
      if (!departure) departure = parseNaturalDate(value) ?? value;

    } else if (field === 'end date' || field === 'return date' || field === 'return' || field === 'end') {
      if (!returnDate) returnDate = parseNaturalDate(value) ?? value;

    // ── Metadata ───────────────────────────────────────────────────────────
    } else if (field === 'trip title' || field === 'title' || field === 'name') {
      title = value;

    } else if (field === 'tagline' || field === 'subtitle' || field === 'vibe' || field === 'description') {
      tagline = value;

    } else if (field === 'currency') {
      currency = value;

    // ── Travellers ─────────────────────────────────────────────────────────
    // Format A: one traveller per row  →  "Traveller 1 | Sujal"
    } else if (/^travell?er\s*\d+$/i.test(field)) {
      if (value) travellers.push(value);

    // Format B: all on one row  →  "Travellers | Sujal | Lukas | Aaron"
    //           or comma-sep   →  "Travellers | Sujal, Lukas, Aaron"
    } else if (/^travell?ers?$|^passengers?$|^people$/i.test(field)) {
      const allCols = cells.slice(1).filter(v => v); // cols B, C, D …
      if (allCols.length > 1) {
        // Multiple value columns (Format B multi-column)
        travellers.push(...allCols);
      } else if (value.includes(',')) {
        // Comma-separated in col B
        travellers.push(...value.split(',').map(s => s.trim()).filter(Boolean));
      } else if (value) {
        travellers.push(value);
      }
    }
  }

  if (!departure)  departure  = '2026-11-23';
  if (!returnDate) returnDate = '2026-12-05';

  console.log(`[sheets] Overview → departure=${departure} return=${returnDate} travellers=[${travellers.join(', ')}]`);

  return {
    title:      title    || 'REHAB 2026',
    tagline:    tagline  || '',
    departure,
    return:     returnDate,
    travellers: travellers.length ? travellers : ['Sujal'],
    traveller:  travellers[0]     || 'Sujal',
    currency:   currency || 'AUD',
  };
}

async function _fetchCosts(): Promise<SheetCostItem[]> {
  const rows = await fetchSheet('Cost');
  return rows
    .map((row, i) => ({
      id:       `cost-${i}`,
      label:    col(row, 'Label', 'Item', 'Description', 'Name', 'Expense'),
      category: col(row, 'Category', 'Type', 'Group'),
      amount:   parseFloat(col(row, 'Amount', 'Cost', 'Price', 'AUD', 'Total') || '0'),
      paid:     parseBool(col(row, 'Paid', 'Status', 'Booked')),
      notes:    col(row, 'Notes', 'Note', 'Details', 'Comments'),
    }))
    .filter(c => c.label && c.amount > 0);
}

async function _fetchCityDays(sheetName: string): Promise<TripDay[]> {
  const rows = await fetchSheet(sheetName);
  const dayMap = new Map<number, TripDay>();

  for (const row of rows) {
    const rawDay = col(row, 'Day', 'Day #', '#', 'Day Number');
    const dayNum = parseInt(rawDay);
    if (!dayNum || isNaN(dayNum)) continue;

    if (!dayMap.has(dayNum)) {
      const rawDate = col(row, 'Date');
      let isoDate = '';
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) isoDate = d.toISOString().slice(0, 10);
      }

      dayMap.set(dayNum, {
        day:     dayNum,
        date:    rawDate,
        isoDate,
        city:    col(row, 'City', 'Destination') || sheetName,
        region:  col(row, 'Region', 'Area', 'Neighbourhood', 'Zone'),
        theme:   col(row, 'Theme', 'Tagline', 'Summary', 'Day Theme'),
        booked:  [],
        ifTime:  [],
        transport: {
          label:  col(row, 'Transport Label', 'Transport', 'Getting There'),
          detail: col(row, 'Transport Detail', 'Transport Notes', 'Travel Detail'),
        },
        sideQuest: {
          category: col(row, 'Quest Category', 'Side Quest Category', 'Quest Type'),
          text:     col(row, 'Quest', 'Side Quest', 'Quest Text', 'Quest Description'),
        },
      });
    }

    const entry = dayMap.get(dayNum)!;

    // Accumulate activities
    const activity = col(row, 'Activity', 'Activities', 'Item', 'Event', 'Task');
    if (activity) {
      const act: DayActivity = {
        time:   col(row, 'Time', 'When', 'Slot'),
        label:  activity,
        status: col(row, 'Status', 'Booking Status', 'Booking', 'Type') || 'Planned',
      };
      entry.booked.push(act);
    }

    // Accumulate optional items
    const optional = col(row, 'If Time', 'Optional', 'If Time & Energy', 'Nice To Have');
    if (optional && !entry.ifTime.includes(optional)) {
      entry.ifTime.push(optional);
    }

    // Fill transport/quest from first row that has them
    if (!entry.transport.label) {
      entry.transport.label  = col(row, 'Transport Label', 'Transport');
      entry.transport.detail = col(row, 'Transport Detail', 'Transport Notes');
    }
    if (!entry.sideQuest.text) {
      entry.sideQuest.category = col(row, 'Quest Category', 'Side Quest Category');
      entry.sideQuest.text     = col(row, 'Quest', 'Side Quest');
    }
  }

  return Array.from(dayMap.values()).sort((a, b) => a.day - b.day);
}

async function _fetchSideQuests(): Promise<SheetQuest[]> {
  const rows = await fetchSheet('Side Quests');
  return rows
    .map((row, i) => ({
      id:          `sq-${i}`,
      title:       col(row, 'Title', 'Name', 'Quest', 'Task'),
      category:    col(row, 'Category', 'Type'),
      city:        col(row, 'City', 'Location', 'Destination', 'Place'),
      description: col(row, 'Description', 'Details', 'Text', 'Task', 'Instructions'),
    }))
    .filter(q => q.title);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cached exports (5-minute revalidation via fetch cache)
// ─────────────────────────────────────────────────────────────────────────────

export const getSheetOverview = unstable_cache(
  _fetchOverview,
  ['gs-overview'],
  { revalidate: 300, tags: ['sheet-data'] }
);

export const getSheetCosts = unstable_cache(
  _fetchCosts,
  ['gs-costs'],
  { revalidate: 300, tags: ['sheet-data'] }
);

export const getSheetSideQuests = unstable_cache(
  _fetchSideQuests,
  ['gs-quests'],
  { revalidate: 300, tags: ['sheet-data'] }
);

export const getSheetHCMC = unstable_cache(
  () => _fetchCityDays('Ho Chi Minh'),
  ['gs-hcmc'],
  { revalidate: 300, tags: ['sheet-data'] }
);

export const getSheetHongKong = unstable_cache(
  () => _fetchCityDays('Hong Kong'),
  ['gs-hongkong'],
  { revalidate: 300, tags: ['sheet-data'] }
);

export const getSheetMacau = unstable_cache(
  () => _fetchCityDays('Macau'),
  ['gs-macau'],
  { revalidate: 300, tags: ['sheet-data'] }
);

/**
 * Combine all three city sheets into one sequential itinerary.
 * Auto-offsets day numbers if they overlap across cities.
 */
export async function getAllItineraryDays(): Promise<TripDay[]> {
  const results = await Promise.allSettled([
    getSheetHCMC(),
    getSheetHongKong(),
    getSheetMacau(),
  ]);

  const combined: TripDay[] = [];
  let offset     = 0;
  let prevMax    = 0;

  for (const result of results) {
    if (result.status !== 'fulfilled' || result.value.length === 0) continue;
    const cityDays = result.value;
    if (combined.length > 0 && cityDays[0].day <= prevMax) offset = prevMax;
    for (const d of cityDays) {
      combined.push({ ...d, day: d.day + offset });
      prevMax = Math.max(prevMax, d.day + offset);
    }
  }

  return combined;
}

/** Try fetcher, return fallback on any error. */
export async function withFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    // Log full error so it appears in Vercel Function Logs
    console.error(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '[googleSheets] FALLING BACK TO MOCK DATA\n' +
      `Reason: ${(err as Error).message}\n` +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    );
    return fallback;
  }
}
