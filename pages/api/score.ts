import type { NextApiRequest, NextApiResponse } from "next";
import { getScoresWithTokens } from "@/lib/serverData";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const scores = await getScoresWithTokens();
    return res.status(200).json(scores);
  } catch (error: any) {
    console.error("[/api/score] error:", error.message);
    return res.status(500).json({ error: "Failed to fetch scores" });
  }
}
