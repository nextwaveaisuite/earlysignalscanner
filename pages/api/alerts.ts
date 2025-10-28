import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabaseServer
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
