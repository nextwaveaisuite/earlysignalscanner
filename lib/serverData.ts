// lib/serverData.ts
import { supabase } from "./db";

export type Alert = {
  id: string;
  name: string;
  signal: string;
  score: number;
  risk: string;
  confidence: number;
};

export async function getAlerts(): Promise<Alert[]> {
  const { data, error } = await supabase.from("alerts").select("*").limit(10);
  if (error) {
    console.error("Error fetching alerts:", error.message);
    return [];
  }
  return data || [];
}

export type ScoreWithToken = {
  token: string;
  score: number;
  risk: string;
  confidence: number;
};

export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const { data, error } = await supabase.from("signals").select("*").limit(10);
  if (error) {
    console.error("Error fetching scores:", error.message);
    return [];
  }
  return data || [];
}
