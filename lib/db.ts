// lib/db.ts
import { createClient } from "@supabase/supabase-js";

/**
 * SECURITY NOTE:
 * You currently hard-coded the service role key in the repo.
 * That's fine to unblock, but you should move it to an env var ASAP.
 */

const SUPABASE_URL = "https://vqowzezzmxzlbaobxlbh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NjI3OCwiZXhwIjoyMDc0OTYyMjc4fQ.S0laJsvGgLAb5EzCIij81_cO59yqLjMlf-hc8g0-vSc";

// Public (anon) client – safe for client/server reads that respect RLS
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// Server (service role) client – for secure server-side operations (API routes)
export const serverSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// ---- Convenience query helpers used by API routes ----
export const db = {
  alerts: () =>
    serverSupabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

  // Expect a view or table with token + score + risk + confidence (+ optional sparkline)
  scoresWithTokens: () =>
    serverSupabase
      .from("scores_with_tokens")
      .select("*")
      .order("score", { ascending: false })
      .limit(25),

  dailyPL: () =>
    serverSupabase
      .from("daily_pl")
      .select("*")
      .order("date", { ascending: true })
      .limit(90),
};
