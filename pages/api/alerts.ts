// pages/api/alerts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverSupabase } from '@/lib/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const supa = serverSupabase();
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(); // last 24h

    const { data, error } = await supa
      .from('alerts')
      .select('created_at, kind, severity, message, token_id')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
                                            }
                                 
