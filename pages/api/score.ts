import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try the intended view; if missing, fall back to a plain "signals" table
    let data: any[] | null = null;
    let error: any = null;

    const resp = await db.scoresWithTokens();
    data = resp.data;
    error = resp.error;

    if (error) {
      console.warn("[/api/score] scores_with_tokens missing? Falling back to 'signals' table.");
      // fallback query using service client directly
      const { serverSupabase } = await import("@/lib/db");
      const fb = await serverSupabase
        .from("signals")
        .select("*")
        .order("score", { ascending: false })
        .limit(25);
      data = fb.data ?? [];
      if (fb.error) console.error("[/api/score] fallback signals error:", fb.error.message);
    }

    const items = (data ?? []).map((r: any) => ({
      token: r.token,
      symbol: r.symbol ?? r.sym ?? null,
      name: r.name ?? null,
      score: Number(r.score ?? 0),
      risk: r.risk ?? null,
      confidence: Number(r.confidence ?? 0),
      sparkline: Array.isArray(r.sparkline) ? r.sparkline : [],
    }));

    if ("withTokens" in req.query || "expanded" in req.query) return res.status(200).json({ items });
    return res.status(200).json(items);
  } catch (e: any) {
    console.error("[/api/score] handler error:", e?.message ?? e);
    if ("withTokens" in req.query || "expanded" in req.query) return res.status(200).json({ items: [] });
    return res.status(200).json([]); // safe empty
  }
}
