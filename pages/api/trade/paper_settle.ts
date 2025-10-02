import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';

function today(){ return new Date().toISOString().slice(0,10); }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const { id, outcome, pnl } = req.body || {}; // outcome: 'TP'|'SL'
  if (!id || !outcome) return res.status(400).json({error:'id and outcome required'});

  const { error: e1 } = await supa.from('paper_orders').update({ status: outcome==='TP'?'tp_hit':'sl_hit' }).eq('id', id);
  if (e1) return res.status(500).json({error:e1});

  const d = today();
  const { data: row } = await supa.from('risk_ledger').select('realized_pnl').eq('d', d).limit(1);
  const cur = Number(row?.[0]?.realized_pnl||0);
  const next = cur + Number(pnl||0);
  const { error: e2 } = await supa.from('risk_ledger').upsert({ d, realized_pnl: next }, { onConflict:'d' });
  if (e2) return res.status(500).json({error:e2});

  res.json({ ok:true, realized_pnl: next });
}
