// pages/api/trade/paper_settle.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const supa = serverSupabase();
    const { id, exit_price } = req.body || {};
    if (!id || typeof exit_price !== 'number') {
      return res.status(400).json({ ok: false, error: 'id and exit_price required' });
    }

    const { data: row, error: fetchErr } = await supa
      .from('paper_trades')
      .select('id, qty, entry_price, side')
      .eq('id', id)
      .single();

    if (fetchErr || !row) return res.status(404).json({ ok: false, error: fetchErr?.message || 'Trade not found' });

    const pnl =
      (row.side === 'buy'
        ? (exit_price - row.entry_price) * row.qty
        : (row.entry_price - exit_price) * row.qty);

    const { error: updErr } = await supa
      .from('paper_trades')
      .update({ exit_price, pnl, status: 'closed' })
      .eq('id', id);

    if (updErr) return res.status(500).json({ ok: false, error: updErr.message });
    return res.status(200).json({ ok: true, data: { id, exit_price, pnl } });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
        }
           
