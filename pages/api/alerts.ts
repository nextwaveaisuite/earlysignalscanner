import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await db.alerts();
    if (error) {
      console.error("[/api/alerts] supabase error:", error.message);
      return res.status(200).json([]); // safe empty
    }
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
    return res.status(200).json(items);
  } catch (e: any) {
    console.error("[/api/alerts] handler error:", e?.message ?? e);
    return res.status(200).json([]); // safe empty
  }
}
