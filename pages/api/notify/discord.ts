import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return res.status(400).json({error:'DISCORD_WEBHOOK_URL not set'});
  const { title, body } = req.body || {};
  const payload = { content: `**${title||'Alert'}**\n${body||''}` };
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  res.json({ ok: r.ok });
}
