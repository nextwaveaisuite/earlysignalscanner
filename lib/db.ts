import { createClient } from '@supabase/supabase-js';

// Your Supabase URL
const supabaseUrl = 'https://vqowzezzmxzlbaobxlbh.supabase.co';

// Public client – safe for frontend
export const supabaseAnon = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODYyNzgsImV4cCI6MjA3NDk2MjI3OH0.wD6aIeMNiiKnanl7YvPsXuVCPA2y5HuzoUWnxF40Yq8'
);

// Service role client – backend only (⚠️ never expose in browser)
export const supabaseService = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxb3d6ZXp6bXh6bGJhb2J4bGJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NjI3OCwiZXhwIjoyMDc0OTYyMjc4fQ.S0laJsvGgLAb5EzCIij81_cO59yqLjMlf-hc8g0-vSc'
);

// ✅ Alias "db" for backwards compatibility with API routes
export const db = supabaseService;
