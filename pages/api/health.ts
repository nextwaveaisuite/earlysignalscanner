import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseService as db } from "@/lib/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { count, error } = await db.from("tokens").select("*", { count: "exact", head: true });
    if (error) return res.status(200).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, tokens: count ?? 0 });
  } catch (e: any) {
    return res.status(200).json({ ok: false, error: e?.message ?? "unknown" });
  }
}
