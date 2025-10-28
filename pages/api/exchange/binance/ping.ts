import type { NextApiRequest, NextApiResponse } from "next";
import { getBinanceClient } from "./client";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getBinanceClient();
    // binance-api-node: time() -> Promise<number>
    const serverTimeMs: number = await client.time();
    res.status(200).json({
      ok: true,
      binanceTime: serverTimeMs,
      iso: new Date(serverTimeMs).toISOString()
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || "unknown error" });
  }
}
