import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getBinanceClient } from '../exchange/binance/client';

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: open } = await supa.from('positions').select('*').is('closed_at', null).eq('mode','paper');
    if (!open?.length) return res.status(200).json({ ok:true, closed:0 });

    const client = getBinanceClient();
    let closed = 0;

    for (const p of open) {
      const ticker = await client.prices({ symbol: p.token_symbol });
      const price = Number((ticker as any)[p.token_symbol]);
      if (!price) continue;

      const hitTP = p.tp && price >= Number(p.tp);
      const hitSL = p.sl && price <= Number(p.sl);
      if (!hitTP && !hitSL) continue;

      const pnl = (price - Number(p.entry_price)) * Number(p.qty);
      await supa.from('positions').update({ closed_at: new Date().toISOString(), pnl_usd:pnl }).eq('id', p.id);
      await supa.from('execution_logs').insert({
        ref_type:'position', ref_id:String(p.id), level:'INFO',
        message: hitTP ? 'Take profit hit' : 'Stop loss hit',
        payload: { price, tp:p.tp, sl:p.sl, pnl }
      });
      closed++;
    }
    return res.status(200).json({ ok:true, closed });
  } catch (e:any) {
    return res.status(500).json({ ok:false, error:e.message });
  }
}
