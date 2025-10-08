// pages/api/trade/risk_place.ts
import type { NextApiRequest, NextApiResponse } from "next";
import riskPlaceHandler from "../risk/risk_place";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return (riskPlaceHandler as any)(req, res);
}
