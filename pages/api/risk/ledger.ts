// pages/api/risk/ledger.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const supa = serverSupabase();

    const { data, error } = await supa
      .from('paper_ledger')
      .select('created_at, event, amount, balance')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
}
