import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vqowzezzmxzlbaobxlbh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) { console.error("[getAlerts]", error.message); return []; }
  return data || [];
}

export async function getScoresWithTokens() {
  const { data, error } = await supabase
    .from("scores_with_tokens")
    .select("*")
    .order("score", { ascending: false })
    .limit(20);
  if (error) { console.error("[getScoresWithTokens]", error.message); return []; }
  return data || [];
}

export async function getDailyPL() {
  const { data, error } = await supabase
    .from("daily_pl")
    .select("*")
    .order("date", { ascending: true });
  if (error) { console.error("[getDailyPL]", error.message); return []; }
  return data || [];
}
