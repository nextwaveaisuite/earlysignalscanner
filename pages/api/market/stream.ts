import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse){
  const mode = req.query.mode;
  if(mode === "daily-pl"){
    return res.status(200).json([
      { date: "2025-10-06", realized: 35, unrealized: 5 },
      { date: "2025-10-07", realized: -12, unrealized: 8 },
      { date: "2025-10-08", realized: 22, unrealized: 3 }
    ]);
  }
  res.status(200).json({ ok: true });
}
