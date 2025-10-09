// pages/api/ingest/x.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN || "";

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function fetchXRecent(query: string) {
  if (!X_BEARER_TOKEN) return [];
  const endpoint = "https://api.x.com/2/tweets/search/recent";
  const qs = new URLSearchParams({
    query,
    "tweet.fields": "created_at,public_metrics,lang",
    max_results: "50",
  }).toString();

  const r = await fetch(`${endpoint}?${qs}`, {
    headers: { Authorization: `Bearer ${X_BEARER_TOKEN}` },
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`X API ${r.status}: ${text}`);
  }
  const j = await r.json();
  return Array.isArray(j.data) ? j.data : [];
}

function scoreTweet(t: any): number {
  // naive scoring: likes+retweets+replies (log-ish)
  const pm = t?.public_metrics || {};
  const raw = (pm.like_count || 0) + (pm.retweet_count || 0) + (pm.reply_count || 0) + (pm.quote_count || 0);
  return Math.round(Math.min(100, Math.log10(1 + raw) * 30));
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // English crypto query; tweak as needed
    const q = '(crypto OR bitcoin OR ether OR solana OR defi) -is:retweet lang:en';
    const items = await fetchXRecent(q);

    const rows = items.map((t: any) => {
      const id = t.id;
      const url = `https://x.com/i/web/status/${id}`;
      return {
        platform: "x",
        author: t.author_id || "unknown",
        text: t.text || "",
        url,
        published_at: t.created_at || null,
        score: scoreTweet(t),
      };
    });

    // Insert into social_posts with dedupe on url
    for (const row of rows) {
      await db.from("social_posts").insert({
        platform: row.platform,
        author: row.author,
        text: row.text,
        url: row.url,
        published_at: row.published_at,
        score: row.score,
      }).select("id").single().then(() => null).catch(() => null);
    }

    // Optional: push high-scoring posts into alerts (threshold = 70)
    const highs = rows.filter(r => r.score >= 70).slice(0, 5);
    for (const h of highs) {
      await db.from("alerts").insert({
        token_id: null,
        symbol: "SOCIAL",
        message: h.text.slice(0, 160),
        score: h.score,
        risk: h.score >= 85 ? "HIGH" : "MEDIUM",
        confidence: Math.min(95, 50 + Math.round(h.score / 2))
      }).select("id").single().then(() => null).catch(() => null);
    }

    res.status(200).json({ ok: true, ingested: rows.length, promoted: highs.length });
  } catch (e: any) {
    console.error("[/api/ingest/x] error:", e.message);
    res.status(200).json({ ok: false, error: e.message });
  }
}
