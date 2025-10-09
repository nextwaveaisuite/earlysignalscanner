import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) return res.status(200).json({ ok: true, skipped: "No X_BEARER_TOKEN set" });
  return res.status(200).json({ ok: true, note: "X stub ready" });
}
