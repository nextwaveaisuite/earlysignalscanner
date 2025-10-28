import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getBinanceClient } from '../exchange/binance/client';

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const BINANCE_MODE = process.env.BINANCE_MODE || 'testnet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: fusion, error: fErr } = await supa
      .from('trade_triggers')
      .select('token_symbol, trigger_score, confidence, risk_band, computed_at')
      .gte('computed_at', new Date(Date.now() - 10*60*1000).toISOString())
      .order('trigger_score', { ascending: false })
      .limit(25);
    if (fErr) throw fErr;
    if (!fusion?.length) return res.status(200).json({ ok:true, msg:'No valid triggers' });

    const { data: sp } = await supa
      .from('strategy_params')
      .select('*').eq('enabled', true)
      .order('updated_at', { ascending:false }).limit(1).single();
    const params:any = sp || { min_confidence:75, max_risk_band:'MEDIUM', risk_per_trade:0.01, stop_loss_pct:0.03, take_profit_pct:0.06 };

    const { data: eq } = await supa.from('equity_snapshots').select('*').order('captured_at',{ascending:false}).limit(1).single();
    const equity = Number(eq?.equity_usd ?? 1000);

    const client = getBinanceClient();
    const placed:any[] = [];

    for (const s of fusion) {
      const { token_symbol, trigger_score, confidence, risk_band } = s;
      if (confidence < params.min_confidence) continue;
      if (['HIGH'].includes(risk_band) && params.max_risk_band !== 'HIGH') continue;
      if (trigger_score < 70) continue;

      const ticker = await client.prices({ symbol: token_symbol });
      const price = Number((ticker as any)[token_symbol]);
      if (!price || Number.isNaN(price)) continue;

      const usdRisk = equity * Number(params.risk_per_trade);
      const qty = Math.max(Number((usdRisk / (price * Number(params.stop_loss_pct))).toFixed(0)), 1);
      const sl = price * (1 - Number(params.stop_loss_pct));
      const tp = price * (1 + Number(params.take_profit_pct));

      if (BINANCE_MODE === 'testnet') {
        await supa.from('orders').insert({ token_symbol, side:'BUY', qty, price, sl, tp, status:'FILLED', mode:'paper',
          metadata:{ trigger_score, confidence, risk_band } });
        await supa.from('positions').insert({ token_symbol, entry_price:price, qty, sl, tp, mode:'paper' });
        placed.push({ token_symbol, mode:'paper', price, qty });
      } else {
        // Live trading would go here
        placed.push({ token_symbol, mode:'live', note:'place real order in production' });
      }
    }

    return res.status(200).json({ ok:true, placed });
  } catch (e:any) {
    return res.status(500).json({ ok:false, error:e.message });
  }
}
