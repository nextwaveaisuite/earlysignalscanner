// lib/serverData.ts
// Fetches via API routes (server-side), so service-role can supply data.

type Risk = "LOW" | "MEDIUM" | "HIGH" | string | null;

export type Alert = {
  id?: string;
  token?: string;
  symbol?: string;
  message?: string;
  score?: number;
  risk?: Risk;
  confidence?: number;
  created_at?: string;
};

export type ScoreWithToken = {
  token?: string;
  symbol?: string;
  name?: string;
  score?: number;
  risk?: Risk;
  confidence?: number;
  sparkline?: number[];
};

export type DailyPLItem = {
  date: string;
  realized: number;
  unrealized: number;
};

function baseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return explicit || vercel || "http://localhost:3000";
}

// No caching (important for live data)
const noStore: RequestInit = {
  cache: "no-store",
  // @ts-ignore - Next runtime hint (fine on server)
  next: { revalidate: 0 },
};

async function getJSON<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${baseUrl()}${path}`;
  const res = await fetch(url, noStore);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export async function getAlerts(): Promise<Alert[]> {
  const data = await getJSON<any>("/api/alerts");
  return Array.isArray(data) ? data : data?.items ?? [];
}

export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const data = await getJSON<any>("/api/score?withTokens=1");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items;
}

export async function getDailyPL(): Promise<DailyPLItem[]> {
  const data = await getJSON<any>("/api/market/stream?mode=daily-pl");
  return Array.isArray(data) ? data : data?.items ?? [];
}
