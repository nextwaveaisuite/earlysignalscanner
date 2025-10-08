// pages/api/trade/risk_place.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Placeholder response; wire to Supabase later.
  return res.status(200).json({ placed: false, reason: "stubbed", ok: true });
}
