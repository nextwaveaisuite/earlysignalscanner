// lib/serverData.ts
import { supabase } from "./db";

export type Alert = {
  id?: string;
  token?: string;
  symbol?: string;
  message?: string;
  score?: number;
  risk?: "LOW" | "MEDIUM" | "HIGH" | string | null;
  confidence?: number;
  created_at?: string;
};

export type ScoreWithToken = {
  token?: string;
  symbol?: string;
  name?: string;
  score?: number;
  risk?: "LOW" | "MEDIUM" | "HIGH" | string | null;
  confidence?: number;
  sparkline?: number[];
};

export type DailyPLItem = {
  date: string;
  realized: number;
  unrealized: number;
};

// Live Alerts (client-safe reads via anon key)
export async function getAlerts(): Promise<Alert[]> {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getAlerts error:", error.message);
    return [];
  }
  return (data ?? []).map((a: any) => ({
    id: a.id,
    token: a.token,
    symbol: a.symbol,
    message: a.message ?? a.reason ?? "Signal detected",
    score: a.score ?? null,
    risk: a.risk ?? null,
    confidence: a.confidence ?? null,
    created_at: a.created_at,
  }));
}

// Top signals (expects a view/table `scores_with_tokens`)
export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const { data, error } = await supabase
    .from("scores_with_tokens")
    .select("*")
    .order("score", { ascending: false })
    .limit(25);

  if (error) {
    console.error("getScoresWithTokens error:", error.message);
    return [];
  }
  return (data ?? []).map((r: any) => ({
    token: r.token,
    symbol: r.symbol,
    name: r.name,
    score: Number(r.score ?? 0),
    risk: r.risk ?? null,
    confidence: Number(r.confidence ?? 0),
    sparkline: Array.isArray(r.sparkline) ? r.sparkline : [],
  }));
}

// Daily P/L (expects a table `daily_pl`)
export async function getDailyPL(): Promise<DailyPLItem[]> {
  const { data, error } = await supabase
    .from("daily_pl")
    .select("*")
    .order("date", { ascending: true })
    .limit(90);

  if (error) {
    console.error("getDailyPL error:", error.message);
    return [];
  }
  return (data ?? []).map((d: any) => ({
    date: String(d.date),
    realized: Number(d.realized ?? 0),
    unrealized: Number(d.unrealized ?? 0),
  }));
}
