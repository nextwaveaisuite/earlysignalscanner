import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await db.scoresWithTokens();
  if (error) return res.status(500).json({ ok: false, error: error.message });

  const items = (data ?? []).map((r: any) => ({
    token: r.token,
    symbol: r.symbol,
    name: r.name,
    score: Number(r.score ?? 0),
    risk: r.risk ?? null,
    confidence: Number(r.confidence ?? 0),
    sparkline: Array.isArray(r.sparkline) ? r.sparkline : [],
  }));

  if ("withTokens" in req.query || "expanded" in req.query) return res.status(200).json({ items });
  return res.status(200).json(items);
}
