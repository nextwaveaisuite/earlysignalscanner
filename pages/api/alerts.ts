import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supa
      .from('alerts')
      .select('id, token_symbol, risk_band, confidence, score, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return res.status(200).json({ alerts: data || [] });
  } catch (e:any) {
    // fallback demo
    return res.status(200).json({ alerts: [] });
  }
}
