// pages/api/score.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const supa = serverSupabase();
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supa
      .from('scores_daily')
      .select(
        "prob_up_4h, composite_score, risk_level, confidence, explain, token_id, tokens:scores_daily_token_id_fkey(symbol,name,chain)"
      )
      .eq('dt', today)
      .order('composite_score', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
}
