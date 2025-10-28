import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholder: implement real telegram ingestion here.
  // This endpoint exists so the cron in vercel.json does not 404.
  return res.status(200).json({ ok: true, source: "telegram" });
}
