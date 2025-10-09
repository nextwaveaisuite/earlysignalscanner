import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseService as db } from "@/lib/db";
import { simpleScore, riskFromScore, upsertAlertFromSocial } from "@/lib/ingest";

async function fetchRedditJSON(url: string) {
  const r = await fetch(url, { headers: { "User-Agent": "EarlySignalScanner/1.0" } });
  if (!r.ok) throw new Error(`Reddit fetch failed ${r.status}`);
  return r.json();
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: sources, error: sErr } = await db
      .from("sources")
      .select("*")
      .eq("kind", "reddit")
      .eq("enabled", true);

    if (sErr) throw sErr;
    if (!sources?.length) return res.status(200).json({ ok: true, ingested: 0 });

    let saved = 0;

    for (const src of sources) {
      try {
        const json = await fetchRedditJSON(src.url!); // e.g., .../new.json
        const posts = json?.data?.children ?? [];
        for (const p of posts) {
          const d = p?.data;
          if (!d?.permalink) continue;
          const url = `https://www.reddit.com${d.permalink}`;

          const { data: exists } = await db
            .from("social_posts")
            .select("id")
            .eq("url", url)
            .limit(1)
            .maybeSingle();
          if (exists?.id) continue;

          await db.from("social_posts").insert({
            source_id: src.id,
            platform: "reddit",
            author: d.author,
            text: d.title,
            url,
            published_at: new Date(d.created_utc * 1000),
            score: 0
          });

          const score = simpleScore(d.title ?? "");
          if (score >= 60) {
            await upsertAlertFromSocial({
              symbol: undefined,
              message: `[REDDIT] ${d.title}`,
              score,
              risk: riskFromScore(score),
              confidence: Math.min(95, 50 + Math.floor(score / 2)),
            });
          }

          saved++;
        }
      } catch (inner) {
        console.error("Reddit ingest failure for", src.url, inner);
      }
    }

    return res.status(200).json({ ok: true, ingested: saved });
  } catch (e: any) {
    console.error("/api/ingest/reddit error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
