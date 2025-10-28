import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE!;
const supa = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supa
      .from('alerts')
      .select('id, token_symbol, risk_band, confidence, score, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.status(200).json({ alerts: data || [] });
  } catch (e:any) {
    res.status(200).json({ alerts: [] });
  }
}
