import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await db.alerts();
  if (error) return res.status(500).json({ ok: false, error: error.message });
  // Normalize fields for UI
  const items = (data ?? []).map(a => ({
    id: a.id,
    token: a.token,
    symbol: a.symbol,
    score: a.score ?? null,
    risk: a.risk ?? null,
    confidence: a.confidence ?? null,
    message: a.message ?? a.reason ?? "Signal detected",
    ts: a.created_at
  }));
  return res.status(200).json(items);
}

