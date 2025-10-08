import type { NextApiRequest, NextApiResponse } from "next";
import { getScores } from "@/lib/serverData";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const scores = await getScores();
  return res.status(200).json(scores);
}
