// lib/serverData.ts
// Server-only helpers to fetch data from our own API routes.
// These functions are resilient to shape changes and disable caching.

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AlertItem = {
  id?: string;
  token?: string;
  symbol?: string;
  score?: number;
  risk?: RiskLevel;
  confidence?: number;
  message?: string;
  ts?: string;
  [key: string]: unknown;
};

export type ScoreWithToken = {
  token?: string;          // address or id
  symbol?: string;         // e.g., "PEPE"
  name?: string;           // e.g., "Pepe"
  score?: number;          // 0–100
  risk?: RiskLevel;        // LOW / MEDIUM / HIGH
  confidence?: number;     // 0–100
  sparkline?: number[];    // small history for mini chart
  [key: string]: unknown;
};

export type DailyPL = {
  date?: string;           // ISO date
  realized?: number;       // realized P/L
  unrealized?: number;     // unrealized P/L
  [key: string]: unknown;
};

// Extend RequestInit to include Next.js' runtime hint.
type NextRequestInit = RequestInit & {
  next?: { revalidate?: number }
};

function baseUrl() {
  // Prefer explicit site URL in env, then Vercel’s preview/production URL, else localhost.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return explicit || vercel || 'http://localhost:3000';
}

// No caching for time-sensitive data (typed properly; no ts-ignore needed)
const noStore: NextRequestInit = {
  next: { revalidate: 0 },
  cache: 'no-store',
};

async function fetchJSON<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl()}${path}`;
  const res = await fetch(url, { ...(noStore as RequestInit), ...(init || {}) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/** Alerts feed for Beginner dashboard */
export async function getAlerts(): Promise<AlertItem[]> {
  const data = await fetchJSON<any>('/api/alerts');
  const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
  return items as AlertItem[];
}

/** Top signals (lightweight list) */
export async function getTopSignals(): Promise<ScoreWithToken[]> {
  try {
    const data = await fetchJSON<any>('/api/score?top=10');
    const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
    return items as ScoreWithToken[];
  } catch {
    const data = await fetchJSON<any>('/api/score');
    const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
    return items as ScoreWithToken[];
  }
}

/**
 * Full scores joined with token metadata expected by <TopSignals />
 * Tries multiple API variants and normalizes fields.
 */
export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const candidates = ['/api/score?withTokens=1', '/api/score?expanded=1', '/api/score'];
  for (const path of candidates) {
    try {
      const data = await fetchJSON<any>(path);
      const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
      return items.map((it) => ({
        toke
