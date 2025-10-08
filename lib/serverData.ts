// lib/serverData.ts
// Server-only data helpers that call our internal API routes.
// Works on Vercel and locally.

type AlertItem = {
  id: string;
  token: string;
  symbol?: string;
  score?: number;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence?: number;
  message?: string;
  ts?: string;
};

type TopSignal = {
  token: string;
  symbol?: string;
  score: number;
  confidence: number;
};

type DailyPL = {
  date: string;
  realized: number;
  unrealized: number;
};

function baseUrl() {
  // Prefer explicit site URL in env, then Vercel’s URL, else localhost
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return explicit || vercel || 'http://localhost:3000';
}

// Ensure we don’t cache time-sensitive data
const noStore: RequestInit = {
  // @ts-expect-error next runtime understands this hint
  next: { revalidate: 0 },
  cache: 'no-store',
};

export async function getAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${baseUrl()}/api/alerts`, noStore);
  if (!res.ok) throw new Error(`getAlerts failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.items ?? [];
}

export async function getTopSignals(): Promise<TopSignal[]> {
  const res = await fetch(`${baseUrl()}/api/score?top=10`, noStore);
  if (!res.ok) throw new Error(`getTopSignals failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.items ?? [];
}

export async function getDailyPL(): Promise<DailyPL[]> {
  const res = await fetch(`${baseUrl()}/api/market/stream?mode=daily-pl`, noStore);
  if (!res.ok) throw new Error(`getDailyPL failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.items ?? [];
}
