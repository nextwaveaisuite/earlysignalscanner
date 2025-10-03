// lib/db.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read public envs (safe for browser + server)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a nullable client so SSR/ISR doesn't crash if envs are missing
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

// ✅ Back-compat alias for existing imports in your project:
//    import { supa } from '@/lib/db'
export const supa = supabase;

// Optional helpers (safe patterns for calling code)
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
  return supabase;
}

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

// Re-export the type for convenience
export type { SupabaseClient } from '@supabase/supabase-js';

// Also provide a default export if any place imports default
export default supabase;
