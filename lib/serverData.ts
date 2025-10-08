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

function baseUrl() {
  // Prefer explicit site URL in env, then Vercel’s preview/production URL, else localhost.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return explicit || vercel || 'http://localhost:3000';
}

// No caching for time-sensitive data
const noStore: RequestInit = {
  // @ts-expect-error - Next runtime understands this hint
  next: { revalidate: 0 },
  cache: 'no-store',
};

async function fetchJSON<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl()}${path}`;
  const res = await fetch(url, { ...noStore, ...(init || {}) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/** Alerts feed for Beginner dashboard */
export async function getAlerts(): Promise<AlertItem[]> {
  const data = await fetchJSON<any>('/api/alerts');
  // Normalize: support either an array response or an object with .items
  const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
  return items as AlertItem[];
}

/** Top signals (lightweight list) */
export async function getTopSignals(): Promise<ScoreWithToken[]> {
  // Try a “top” param first; fall back to plain /api/score
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
 * Your API may expose one of the following:
 *   /api/score?withTokens=1   OR   /api/score?expanded=1   OR   /api/score
 * We’ll try in that order and normalize.
 */
export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const candidates = ['/api/score?withTokens=1', '/api/score?expanded=1', '/api/score'];
  for (const path of candidates) {
    try {
      const data = await fetchJSON<any>(path);
      const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
      // Minimal normalization of common field names
      return items.map((it) => ({
        token: it.token ?? it.address ?? it.id,
        symbol: it.symbol ?? it.ticker ?? it.sym,
        name: it.name ?? it.tokenName,
        score: typeof it.score === 'number' ? it.score : Number(it.score ?? 0),
        risk: (it.risk as RiskLevel) ?? undefined,
        confidence:
          typeof it.confidence === 'number'
            ? it.confidence
            : Number(it.confidence ?? it.conf ?? 0),
        sparkline: Array.isArray(it.sparkline) ? it.sparkline : it.spark ?? undefined,
        ...it,
      })) as ScoreWithToken[];
    } catch {
      // try next candidate
    }
  }
  // If all calls failed, surface a clear error:
  throw new Error('getScoresWithTokens failed: no usable /api/score variant found');
}

/** Daily P/L series for Beginner dashboard */
export async function getDailyPL(): Promise<DailyPL[]> {
  // Try a mode param; fall back to raw
  try {
    const data = await fetchJSON<any>('/api/market/stream?mode=daily-pl');
    const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
    return items as DailyPL[];
  } catch {
    const data = await fetchJSON<any>('/api/market/stream');
    const items: any[] = Array.isArray(data) ? data : data?.items ?? [];
    return items as DailyPL[];
  }
}
