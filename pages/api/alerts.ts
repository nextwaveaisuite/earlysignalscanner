import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, error } = await supabaseServer
      .from("alerts")
      .select("token_symbol, risk_band, confidence, score, created_at")
      .not("token_symbol", "is", null)
      .not("risk_band", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ alerts: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({
      error: e?.message || "Unknown server error"
    });
  }
}
