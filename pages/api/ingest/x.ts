import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseService as db } from "@/lib/db";
import { simpleScore, riskFromScore, upsertAlertFromSocial } from "@/lib/ingest";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const bearer = process.env.X_BEARER_TOKEN; // set in Vercel
    if (!bearer) return res.status(200).json({ ok: true, skipped: "No X_BEARER_TOKEN set" });

    // Example: recent search for microcaps (you’ll tune queries)
    // const q = encodeURIComponent("(crypto OR token) (small cap OR microcap) -giveaway -airdrop");
    // const r = await fetch(`https://api.x.com/2/tweets/search/recent?query=${q}&tweet.fields=created_at,author_id`, {
    //   headers: { Authorization: `Bearer ${bearer}` },
    // });
    // const json = await r.json();

    // TODO: parse & insert into social_posts; upsert alerts with simpleScore()

    return res.status(200).json({ ok: true, note: "X stub ready" });
  } catch (e: any) {
    console.error("/api/ingest/x error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
