/**
 * GET /api/sheets-debug
 *
 * Diagnostic endpoint — hit this URL in your browser to check whether
 * each Google Sheet tab is reachable from Vercel's servers.
 *
 * Usage: https://your-vercel-url.vercel.app/api/sheets-debug
 */

import { NextResponse } from 'next/server';

const SPREADSHEET_ID = '1OYe9_IuiqwWdR5vBZnpMc0Ls9uR3tyIvbIkyIx0eIvs';
const SHEETS = ['Overview', 'Cost', 'Ho Chi Minh', 'Hong Kong', 'Macau', 'Side Quests'];

function csvUrl(sheetName: string) {
  return (
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
    `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  );
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const results = await Promise.all(
    SHEETS.map(async (sheet) => {
      const url = csvUrl(sheet);
      const start = Date.now();
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const ms  = Date.now() - start;
        const text = await res.text();
        const isHTML = text.trimStart().startsWith('<!') || text.trimStart().startsWith('<html');
        const lines  = text.trim().split('\n');
        const header = lines[0] ?? '';
        const rowCount = Math.max(0, lines.length - 1);

        return {
          sheet,
          url,
          ok:       res.ok && !isHTML,
          status:   res.status,
          ms,
          isHTML,
          rowCount: isHTML ? 'N/A (got HTML)' : rowCount,
          headers:  isHTML ? 'N/A' : header.slice(0, 200),
          preview:  isHTML ? text.slice(0, 200) : (lines[1] ?? '').slice(0, 200),
          error:    isHTML
            ? 'HTML returned — sheet may not be fully public. Go to Share → Anyone with the link → Viewer.'
            : null,
        };
      } catch (err) {
        return {
          sheet,
          url,
          ok:       false,
          status:   0,
          ms:       Date.now() - start,
          isHTML:   false,
          rowCount: 0,
          headers:  '',
          preview:  '',
          error:    (err as Error).message,
        };
      }
    })
  );

  const allOk = results.every(r => r.ok);

  return NextResponse.json(
    {
      spreadsheetId: SPREADSHEET_ID,
      timestamp:     new Date().toISOString(),
      allOk,
      summary: allOk
        ? '✅ All tabs reachable — data should load from Google Sheets.'
        : '❌ One or more tabs failed. Check each tab\'s "error" field below.',
      tabs: results,
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
