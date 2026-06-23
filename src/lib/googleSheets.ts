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

/** Parse CSV text → array of {header: value} objects. */
function parseCSV(text: string): Record<string, string>[] {
  const lines = splitLines(text).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h] = (vals[j] ?? '').trim(); });
    return row;
  });
}

/** Fetch a named sheet as parsed CSV rows. */
async function fetchSheet(sheetName: string): Promise<Record<string, string>[]> {
  const url = csvUrl(sheetName);

  // Log the exact URL so you can verify it in Vercel Function Logs or locally.
  console.log(`[sheets] fetching: ${url}`);

  // cache: 'no-store' because unstable_cache handles our 5-min revalidation.
  // Adding both would conflict and may cause stale/empty cache issues.
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(
      `[sheets] HTTP ${res.status} fetching tab "${sheetName}". ` +
      `URL: ${url}`
    );
  }

  const text = await res.text();

  // Google redirects unauthenticated requests to a login HTML page
  // instead of returning CSV — detect and surface this clearly.
  if (text.trimStart().startsWith('<!') || text.trimStart().startsWith('<html')) {
    throw new Error(
      `[sheets] Got HTML instead of CSV for tab "${sheetName}". ` +
      `The sheet may not be fully public. ` +
      `Go to Share → Anyone with the link → Viewer, then try again.`
    );
  }

  if (!text.trim()) {
    throw new Error(`[sheets] Empty response for tab "${sheetName}". URL: ${url}`);
  }

  const rows = parseCSV(text);
  console.log(`[sheets] ✓ "${sheetName}" — ${rows.length} rows, headers: [${Object.keys(rows[0] ?? {}).join(', ')}]`);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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
  const rows = await fetchSheet('Overview');
  const map: Record<string, string> = {};
  for (const row of rows) {
    const field = col(row, 'Field');
    const value = col(row, 'Value');
    if (field) map[field.toLowerCase().trim()] = value;
  }

  const travellers = (map['travellers'] || map['passengers'] || map['people'] || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  return {
    title:      map['trip title']   || map['title']         || 'REHAB 2026',
    tagline:    map['tagline']      || map['subtitle']       || map['vibe'] || '',
    departure:  map['start date']   || map['departure date'] || map['start']    || '2026-07-15',
    return:     map['end date']     || map['return date']    || map['end']      || '2026-07-28',
    travellers: travellers.length ? travellers : ['Sujal'],
    traveller:  travellers[0] || 'Sujal',
    currency:   map['currency']     || 'AUD',
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
