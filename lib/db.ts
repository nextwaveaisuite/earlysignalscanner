// lib/db.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 🚀 Pre-filled Supabase credentials
 * Replace with new keys later if you rotate them.
 */
const PUBLIC_URL = "https://vqowzezzmxzlbaobxlbh.supabase.co";
const PUBLIC_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8";

const SERVER_URL = "https://vqowzezzmxzlbaobxlbh.supabase.co";
const SERVICE_ROLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NjI3OCwiZXhwIjoyMDc0OTYyMjc4fQ.S0laJsvGgLAb5EzCIij81_cO59yqLjMlf-hc8g0-vSc";

/**
 * Unified supa client — safe for client and server.
 */
function makeClient(): SupabaseClient {
  const isServer = typeof window === "undefined";
  if (isServer && SERVER_URL && SERVICE_ROLE) {
    return createClient(SERVER_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });
  }
  return createClient(PUBLIC_URL, PUBLIC_ANON, {
    auth: { persistSession: false },
  });
}

/**
 * Default export — used across most of your app.
 */
export const supa: SupabaseClient = makeClient();

/**
 * Explicit server-only client — use this in API routes.
 */
export function serverSupabase(): SupabaseClient {
  return createClient(SERVER_URL || PUBLIC_URL, SERVICE_ROLE || PUBLIC_ANON, {
    auth: { persistSession: false },
  });
}

export type { SupabaseClient } from "@supabase/supabase-js";
export default supa;
    
