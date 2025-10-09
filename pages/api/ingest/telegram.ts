import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseService as db } from "@/lib/db";
import { simpleScore, riskFromScore, upsertAlertFromSocial } from "@/lib/ingest";

// Set TELEGRAM_BOT_TOKEN and configure Telegram webhook -> this endpoint URL
export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const update = req.body; // Telegram sends chat update JSON
    const text: string | undefined = update?.message?.text;
    if (!text) return res.status(200).json({ ok: true });

    const url = `https://t.me/c/${update.message.chat?.id}/${update.message.message_id}`;
    const { data: exists } = await db.from("social_posts").select("id").eq("url", url).limit(1).maybeSingle();
    if (!exists?.id) {
      await db.from("social_posts").insert({
        platform: "telegram",
        author: String(update.message.from?.username ?? update.message.from?.id ?? "tg"),
        text,
        url,
        published_at: new Date(update.message.date * 1000)
      });
    }

    const score = simpleScore(text);
    if (score >= 60) {
      await upsertAlertFromSocial({
        symbol: undefined,
        message: `[TELEGRAM] ${text.slice(0, 160)}`,
        score,
        risk: riskFromScore(score),
        confidence: Math.min(95, 50 + Math.floor(score / 2)),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("/api/ingest/telegram error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
