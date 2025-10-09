import type { NextApiRequest, NextApiResponse } from "next";
export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  return res.status(200).json({ ok: true });
}
