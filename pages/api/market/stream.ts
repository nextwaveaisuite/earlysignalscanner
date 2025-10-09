import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mode = String(req.query.mode ?? "");
    if (mode === "daily-pl") {
      const { data, error } = await db
        .from("daily_pl")
        .select("*")
        .order("date", { ascending: true });
      if (error) {
        console.error("[/api/market/stream] daily_pl error:", error.message);
        return res.status(200).json([]);
      }
      return res.status(200).json(data || []);
    }

    const { data, error } = await db
      .from("scores_with_tokens")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[/api/market/stream] scores_with_tokens error:", error.message);
      return res.status(200).json([]);
    }
    return res.status(200).json(data || []);
  } catch (err: any) {
    console.error("[/api/market/stream] unexpected error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
