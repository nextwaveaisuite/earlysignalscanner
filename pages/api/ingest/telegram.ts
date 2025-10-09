// pages/api/ingest/telegram.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TELEGRAM_RSS_URL = process.env.TELEGRAM_RSS_URL || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function ingestViaRSS() {
  const r = await fetch(TELEGRAM_RSS_URL, { headers: { "user-agent": "SignalRadarBot/1.0" }});
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const xml = await r.text();

  // super tiny RSS parser (titles + links + pubDate)
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(m => m[1]);
  const rows = items.map((it) => {
    const title = (it.match(/<title>([\s\S]*?)<\/title>/) || [,""])[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    const link  = (it.match(/<link>([\s\S]*?)<\/link>/) || [,""])[1].trim();
    const pub   = (it.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [,""])[1].trim();
    return {
      platform: "telegram",
      author: "channel",
      text: title,
      url: link,
      published_at: pub ? new Date(pub).toISOString() : null,
      score: Math.min(100, title.length) // naive
    };
  });

  for (const row of rows) {
    await db.from("social_posts").insert(row).select("id").single().then(()=>null).catch(()=>null);
  }

  // Promote a few to alerts
  const highs = rows.filter(r => r.score >= 70).slice(0, 5);
  for (const h of highs) {
    await db.from("alerts").insert({
      token_id: null,
      symbol: "TELEGRAM",
      message: h.text.slice(0, 160),
      score: h.score,
      risk: h.score >= 85 ? "HIGH" : "MEDIUM",
      confidence: Math.min(95, 50 + Math.round(h.score / 2))
    }).select("id").single().then(()=>null).catch(()=>null);
  }

  return { ingested: rows.length, promoted: highs.length };
}

async function ingestViaBot() {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Bot API ${r.status}`);
  const j = await r.json();
  const msgs = Array.isArray(j.result) ? j.result : [];
  const rows = msgs
    .map((u: any) => u?.message)
    .filter((m: any) => m && (!TELEGRAM_CHAT_ID || String(m.chat?.id) === String(TELEGRAM_CHAT_ID)))
    .map((m: any) => ({
      platform: "telegram",
      author: m.from?.username || "user",
      text: m.text || m.caption || "(media)",
      url: `https://t.me/c/${m.chat?.id}/${m.message_id}`,
      published_at: m.date ? new Date(m.date * 1000).toISOString() : null,
      score: Math.min(100, (m.text || "").length)
    }));

  for (const row of rows) {
    await db.from("social_posts").insert(row).select("id").single().then(()=>null).catch(()=>null);
  }

  const highs = rows.filter(r => r.score >= 70).slice(0, 5);
  for (const h of highs) {
    await db.from("alerts").insert({
      token_id: null,
      symbol: "TELEGRAM",
      message: h.text.slice(0, 160),
      score: h.score,
      risk: h.score >= 85 ? "HIGH" : "MEDIUM",
      confidence: Math.min(95, 50 + Math.round(h.score / 2))
    }).select("id").single().then(()=>null).catch(()=>null);
  }

  return { ingested: rows.length, promoted: highs.length };
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    if (TELEGRAM_RSS_URL) {
      const out = await ingestViaRSS();
      return res.status(200).json({ ok: true, method: "rss", ...out });
    }
    if (TELEGRAM_BOT_TOKEN) {
      const out = await ingestViaBot();
      return res.status(200).json({ ok: true, method: "bot", ...out });
    }
    return res.status(200).json({ ok: false, error: "Set TELEGRAM_RSS_URL, or TELEGRAM_BOT_TOKEN(+CHAT_ID)" });
  } catch (e: any) {
    console.error("[/api/ingest/telegram] error:", e.message);
    res.status(200).json({ ok: false, error: e.message });
  }
}
