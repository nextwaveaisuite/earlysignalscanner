import type { NextApiRequest, NextApiResponse } from "next";
import { getDailyPL } from "@/lib/serverData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = String(req.query.mode ?? "");

  if (mode === "daily-pl") {
    const pl = await getDailyPL();
    return res.status(200).json(pl);
  }

  return res.status(400).json({ error: "Invalid mode" });
}
