import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, res: NextApiResponse){
  res.status(200).json([
    { symbol: "NOVA", score: 72, message: "Smart money accumulation", confidence: 82, risk: "LOW" },
    { symbol: "FLUX", score: 55, message: "Narrative trending", confidence: 64, risk: "MEDIUM" }
  ]);
}
