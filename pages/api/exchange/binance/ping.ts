import type { NextApiRequest, NextApiResponse } from "next";
import { getBinanceClient } from "./client";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getBinanceClient();
    const time = await client.time(); // public endpoint
    res.status(200).json({ ok: true, binanceTime: time.serverTime });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || "unknown error" });
  }
}
