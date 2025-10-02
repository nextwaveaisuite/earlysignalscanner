import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const d = new Date().toISOString().slice(0,10);
  const { data: ledger } = await supa.from('risk_ledger').select('*').eq('d', d).limit(1);
  const { data: orders } = await supa.from('paper_orders')
    .select('*')
    .gte('ts', `${d}T00:00:00.000Z`)
    .order('ts', { ascending: false })
    .limit(100);
  res.json({ ok:true, ledger: ledger?.[0]||{ d, realized_pnl:0, loss_cap:0 }, orders: orders||[] });
}
