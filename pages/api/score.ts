import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Query the scores_with_tokens view (joined scores + token metadata)
    const { data, error } = await db
      .from("scores_with_tokens")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.error("[/api/score] supabase error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  } catch (err: any) {
    console.error("[/api/score] unexpected error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
