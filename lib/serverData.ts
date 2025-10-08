import { createClient } from "@supabase/supabase-js";

// === Supabase client setup ===
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vqowzezzmxzlbAobxlbh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// === Fetch live alerts ===
export async function getAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAlerts] Error:", error.message);
    return [];
  }
  return data || [];
}

// === Fetch scores with token metadata ===
export async function getScores() {
  const { data, error } = await supabase
    .from("scores_with_tokens")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    console.error("[getScores] Error:", error.message);
    return [];
  }
  return data || [];
}

// === Fetch daily P/L ===
export async function getDailyPL() {
  const { data, error } = await supabase
    .from("daily_pl")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("[getDailyPL] Error:", error.message);
    return [];
  }
  return data || [];
}
