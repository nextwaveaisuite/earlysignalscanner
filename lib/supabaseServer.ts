import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env";

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE URL (set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL)");
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE SERVICE ROLE KEY (set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY)");
}

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});
