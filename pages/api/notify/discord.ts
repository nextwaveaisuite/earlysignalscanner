import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return res.status(200).json({ ok: true, skipped: "No DISCORD_WEBHOOK_URL set" });
  const { content } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (!content) return res.status(400).json({ ok: false, error: "Missing content" });
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
  res.status(200).json({ ok: r.ok });
}
