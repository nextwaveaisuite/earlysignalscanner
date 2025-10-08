import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await db.alerts();
  if (error) return res.status(500).json({ ok: false, error: error.message });

  const items = (data ?? []).map((a: any) => ({
    id: a.id,
    token: a.token,
    symbol: a.symbol,
    message: a.message ?? a.reason ?? "Signal detected",
    score: a.score ?? null,
    risk: a.risk ?? null,
    confidence: a.confidence ?? null,
    created_at: a.created_at,
  }));

  res.status(200).json(items);
}
