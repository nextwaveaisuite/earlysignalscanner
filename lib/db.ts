// lib/db.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Lazy-initialize a Supabase client only when env vars exist.
 * If not configured, we keep it as null so callers can guard/skip.
 */
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

/**
 * Alias export to maintain backward compatibility with existing imports:
 *   import { supa } from '@/lib/db'
 */
export const supa = supabase;

/**
 * Helper for places that want a hard failure if Supabase isn't configured.
 * (Useful in API routes where you prefer a 500 over a silent fallback.)
 */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return supabase;
}

/**
 * Safe query wrapper — returns a fallback if client is missing or the query throws.
 * Use this in SSR/ISR paths to avoid build-time crashes when env isn’t present.
 */
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
  
