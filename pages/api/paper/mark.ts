import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Binance from 'binance-api-node';

// ====== Environment ======
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
const BINANCE_MODE = process.env.BINANCE_MODE || 'testnet';
const BINANCE_API_KEY = process.env.BINANCE_API_KEY!;
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

function getBinanceClient() {
  const test = BINANCE_MODE === 'testnet';
  return Binance({
    apiKey: BINANCE_API_KEY,
    apiSecret: BINANCE_API_SECRET,
    httpBase: test ? 'https://testnet.binance.vision' : undefined,
    wsBase:   test ? 'wss://testnet.binance.vision'   : undefined
  });
}

// ====== Handler ======
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Get all open paper positions
    const { data: open, error } = await supabase
      .from('positions')
      .select('*')
      .is('closed_at', null)
      .eq('mode', 'paper');

    if (error) throw error;
    if (!open?.length) return res.status(200).json({ ok: true, closed: 0 });

    const client = getBinanceClient();
    let closedCount = 0;

    for (const p of open) {
      const symbol = p.token_symbol;
      const ticker = await client.prices({ symbol });
      const price = Number(ticker[symbol]);
      if (!price || isNaN(price)) continue;

      const hitTP = p.tp && price >= Number(p.tp);
      const hitSL = p.sl && price <= Number(p.sl);

      if (!hitTP && !hitSL) continue;

      const pnl = (price - Number(p.entry_price)) * Number(p.qty);

      // 2️⃣ Close position and record P/L
      await supabase.from('positions')
        .update({
          closed_at: new Date().toISOString(),
          pnl_usd: pnl
        })
        .eq('id', p.id);

      // 3️⃣ Insert execution log
      await supabase.from('execution_logs').insert({
        ref_type: 'position',
        ref_id: String(p.id),
        level: 'INFO',
        message: hitTP ? 'Take profit hit' : 'Stop loss hit',
        payload: { price, tp: p.tp, sl: p.sl, pnl }
      });

      closedCount++;
    }

    return res.status(200).json({ ok: true, closed: closedCount });
  } catch (e: any) {
    console.error('Paper Mark Error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
