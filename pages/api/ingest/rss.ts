import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
import { supabaseService as db } from "@/lib/db";
import { simpleScore, riskFromScore, upsertAlertFromSocial } from "@/lib/ingest";

const parser = new Parser({ timeout: 10000 });

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: sources, error: sErr } = await db
      .from("sources")
      .select("*")
      .eq("kind", "rss")
      .eq("enabled", true);

    if (sErr) throw sErr;
    if (!sources?.length) return res.status(200).json({ ok: true, ingested: 0 });

    let saved = 0;
    for (const src of sources) {
      try {
        const feed = await parser.parseURL(src.url!);
        for (const item of feed.items || []) {
          const link = item.link || item.guid;
          if (!link) continue;

          const { data: exists } = await db
            .from("news_items")
            .select("id").eq("url", link).limit(1).maybeSingle();
          if (exists?.id) continue;

          await db.from("news_items").insert({
            source_id: src.id, kind: "rss",
            title: item.title ?? null, url: link,
            author: item.creator ?? item.author ?? null,
            published_at: item.isoDate ? new Date(item.isoDate) : null,
            summary: item.contentSnippet ?? null,
            tags: feed.title ? [feed.title] : []
          });

          const score = simpleScore(item.contentSnippet ?? "", item.title ?? "");
          if (score >= 60) {
            await upsertAlertFromSocial({
              message: `[NEWS] ${item.title}`,
              score,
              risk: riskFromScore(score),
              confidence: Math.min(95, 50 + Math.floor(score / 2))
            });
          }
          saved++;
        }
      } catch (inner) {
        console.error("RSS ingest failure for", src.url, inner);
      }
    }
    return res.status(200).json({ ok: true, ingested: saved });
  } catch (e: any) {
    console.error("/api/ingest/rss error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
