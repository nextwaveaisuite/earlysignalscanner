// lib/db.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Pre-filled keys
const SUPABASE_URL = "https://vqowzezzmxzlbaobxlbh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NjI3OCwiZXhwIjoyMDc0OTYyMjc4fQ.S0laJsvGgLAb5EzCIij81_cO59yqLjMlf-hc8g0-vSc";

// 👇 Public client — safe for frontend use
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 👇 Server-side client — allows RLS-bypassing operations in API routes
export const serverSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
