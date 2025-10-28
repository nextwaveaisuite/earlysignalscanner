import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try to use the RPC if it exists (more intelligent sorting/filters)
    const { data: rpc, error: rpcErr } = await supabaseServer
      .rpc("get_top_trade_signals", { max_rows: 20 });

    if (!rpcErr && Array.isArray(rpc) && rpc.length > 0) {
      return res.status(200).json({ alerts: rpc });
    }

    // Fallback to raw alerts (filter out any nulls just in case)
    const { data, error } = await supabaseServer
      .from("alerts")
      .select("token_symbol,risk_band,confidence,score,created_at")
      .not("token_symbol", "is", null)
      .not("risk_band", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ alerts: data ?? [] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unknown error" });
  }
}
