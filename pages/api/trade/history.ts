// pages/api/trade/history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supa = serverSupabase();
    const { limit = 100 } = req.query;

    const { data, error } = await supa
      .from('paper_trades')
      .select('id, created_at, symbol, side, qty, entry_price, exit_price, pnl, status')
      .order('created_at', { ascending: false })
      .limit(Number(limit) || 100);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
  }
