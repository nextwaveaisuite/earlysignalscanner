import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { limit=50 } = req.query;
  const { data, error } = await supa.from('paper_orders').select('*').order('ts', { ascending:false }).limit(Number(limit));
  if (error) return res.status(500).json({error});
  res.json({ ok:true, orders: data });
}
