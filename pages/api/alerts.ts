import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-side only

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false }
});

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("token_symbol,risk_band,confidence,score,created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ alerts: data ?? [] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unknown error" });
  }
}
