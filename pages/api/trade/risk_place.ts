import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';
import { DEFAULT_RISK, planTrade, withOverrides, Side } from '@/lib/risk';

async function getToday(){ return new Date().toISOString().slice(0,10); }

async function upsertLedger(cap:number){
  const d = await getToday();
  await supa.from('risk_ledger').upsert({ d, loss_cap: cap }, { onConflict: 'd' });
  const { data } = await supa.from('risk_ledger').select('*').eq('d', d).limit(1);
  return data?.[0];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const { symbol, side, entry, mode, paperOnly=true, maxRiskPct, slPct, tpRR, dailyLossCap } = req.body || {};
  if (!symbol || !side || !entry) return res.status(400).json({error:'symbol, side, entry required'});
  if (paperOnly !== true) return res.status(400).json({error:'Paper‑Only lock is enabled'});
  if (mode !== 'PAPER') return res.status(400).json({error:'Live trading disabled'});

  const ledger = await upsertLedger(Number(dailyLossCap||200));
  if (ledger && Number(ledger.realized_pnl) <= -Number(ledger.loss_cap)){
    return res.status(400).json({error:'Daily loss cap reached. Trading is paused for today.'});
  }

  const params = withOverrides(DEFAULT_RISK, { maxRiskPct, slPct, tpRR });
  const plan = planTrade({ entry: Number(entry), side: side as Side, params });

  const { data, error } = await supa.from('paper_orders')
    .insert({ symbol, side, entry: Number(entry), qty: plan.qty, sl: plan.sl, tp: plan.tp, status:'open' })
    .select('id');
  if (error) return res.status(500).json({error});

  return res.json({ ok:true, orderId: data?.[0]?.id, mode, symbol, side, entry: Number(entry), ...plan, risk: params });
}
