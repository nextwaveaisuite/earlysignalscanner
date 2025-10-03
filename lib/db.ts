// lib/db.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export a nullable client so pages/components can gracefully skip data calls when not configured.
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

// Helper: safe query wrapper (no-throw if not configured)
export async function safeQuery<T>(
  fn: (c: SupabaseClient) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!supabase) return fallback;
  try {
    return await fn(supabase);
  } catch {
    return fallback;
  }
}
