import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = String(req.query.mode ?? "");
  if (mode === "daily-pl") {
    const { data, error } = await db.dailyPL();
    if (error) return res.status(500).json({ ok: false, error: error.message });

    const items = (data ?? []).map((d: any) => ({
      date: String(d.date),
      realized: Number(d.realized ?? 0),
      unrealized: Number(d.unrealized ?? 0),
    }));
    return res.status(200).json(items);
  }
  return res.status(200).json({ ok: true });
}
