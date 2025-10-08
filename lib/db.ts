// lib/db.ts
// Temporary stubs so API routes can import without breaking builds.
// Replace with real Supabase client when ready.

export type SupabaseServerStub = {
  query?: (...args: any[]) => Promise<any>;
  from?: (...args: any[]) => any;
  rpc?: (...args: any[]) => any;
};

export const serverSupabase: SupabaseServerStub = {
  // add minimal methods if a route calls them later
};

export const supabase = serverSupabase; // alias for any old imports

