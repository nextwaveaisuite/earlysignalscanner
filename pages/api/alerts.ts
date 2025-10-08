import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Correct Supabase syntax
    const { data, error } = await db
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[/api/alerts] supabase error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  } catch (err: any) {
    console.error("[/api/alerts] unexpected error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
