// lib/serverData.ts
// SAFE server data helpers: always return [], never throw on SSR.

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

// Determine absolute site URL for server-side fetch
function baseUrl(): string {
  // Prefer explicit custom domain
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  // Vercel sets VERCEL_URL like "<proj>-<hash>.vercel.app"
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Dev fallback
  return "http://localhost:3000";
}

const noStore: RequestInit = {
  cache: "no-store",
  // @ts-ignore Next.js runtime hint is ok
  next: { revalidate: 0 },
};

// SAFE fetch: never throws, logs and returns undefined
async function fetchJSONSafe<T>(path: string): Promise<T | undefined> {
  try {
    const url = path.startsWith("http") ? path : `${baseUrl()}${path}`;
    const res = await fetch(url, noStore);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[serverData] GET ${path} -> ${res.status}: ${text}`);
      return undefined;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`[serverData] GET ${path} failed:`, err?.message ?? err);
    return undefined;
  }
}

export async function getAlerts(): Promise<Alert[]> {
  const data = await fetchJSONSafe<any>("/api/alerts");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items as Alert[];
}

export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  // Prefer expanded shape but accept flat arrays too
  const data = await fetchJSONSafe<any>("/api/score?withTokens=1");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return (items ?? []) as ScoreWithToken[];
}

export async function getDailyPL(): Promise<DailyPLItem[]> {
  const data = await fetchJSONSafe<any>("/api/market/stream?mode=daily-pl");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return (items ?? []) as DailyPLItem[];
}
