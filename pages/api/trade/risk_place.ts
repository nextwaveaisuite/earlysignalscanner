// pages/api/trade/risk_place.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const supa = serverSupabase();
    const { symbol, side, qty, entry_price, take_profit, stop_loss } = req.body || {};
    if (!symbol || !side || !qty || !entry_price) {
      return res.status(400).json({ ok: false, error: 'symbol, side, qty, entry_price required' });
    }

    const { data, error } = await supa
      .from('paper_trades')
      .insert([{ symbol, side, qty, entry_price, take_profit, stop_loss, status: 'open' }])
      .select('id, created_at')
      .single();

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
}
