import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Binance from 'binance-api-node';

// Environment setup
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
const BINANCE_MODE = process.env.BINANCE_MODE || 'testnet'; // "testnet" or "live"
const BINANCE_API_KEY = process.env.BINANCE_API_KEY!;
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET!;

// Create Supabase client (service role for server use)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Binance client factory
function getBinanceClient() {
  const test = BINANCE_MODE === 'testnet';
  return Binance({
    apiKey: BINANCE_API_KEY,
    apiSecret: BINANCE_API_SECRET,
    httpBase: test ? 'https://testnet.binance.vision' : undefined,
    wsBase: test ? 'wss://testnet.binance.vision' : undefined
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Get candidate trade triggers from Supabase
    const { data: fusion, error: fErr } = await supabase
      .from('trade_triggers')
      .select('token_symbol, trigger_score, confidence, risk_band, computed_at')
      .gte('computed_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // last 10m
      .order('trigger_score', { ascending: false })
      .limit(25);

    if (fErr) throw fErr;
    if (!fusion?.length) {
      return res.status(200).json({ ok: true, msg: 'No valid triggers' });
    }

    // 2️⃣ Load trading strategy parameters
    const { data: sp } = await supabase
      .from('strategy_params')
      .select('*')
      .eq('enabled', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const params = sp || {
      min_confidence: 75,
      max_risk_band: 'MEDIUM',
      risk_per_trade: 0.01,
      stop_loss_pct: 0.03,
      take_profit_pct: 0.06,
      daily_loss_cap_pct: 0.05,
      circuit_breaker: true
    };

    // 3️⃣ Get current equity snapshot (fallback $1000)
    const { data: eq } = await supabase
      .from('equity_snapshots')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(1)
      .single();

    const equity = Number(eq?.equity_usd ?? 1000);
    const client = getBinanceClient();

    const placed: any[] = [];

    // 4️⃣ Filter & process triggers
    for (const s of fusion) {
      const { token_symbol, trigger_score, confidence, risk_band } = s;

      // Skip if below thresholds
      if (confidence < params.min_confidence) continue;
      if (['HIGH'].includes(risk_band) && params.max_risk_band !== 'HIGH') continue;
      if (trigger_score < 70) continue;

      // 5️⃣ Get live price
      const ticker = await client.prices({ symbol: token_symbol });
      const price = Number(ticker[token_symbol]);
      if (!price || isNaN(price)) continue;

      // 6️⃣ Calculate position size & SL/TP
      const usdRisk = equity * Number(params.risk_per_trade);
      const qty = (usdRisk / (price * Number(params.stop_loss_pct))).toFixed(0);
      const qtyNum = Math.max(Number(qty), 1);

      const sl = price * (1 - Number(params.stop_loss_pct));
      const tp = price * (1 + Number(params.take_profit_pct));

      // 7️⃣ Paper mode (default)
      if (BINANCE_MODE === 'testnet') {
        const { data: ord } = await supabase.from('orders').insert({
          token_symbol,
          side: 'BUY',
          qty: qtyNum,
          price,
          sl,
          tp,
          status: 'FILLED',
          mode: 'paper',
          metadata: { trigger_score, confidence, risk_band }
        }).select().single();

        await supabase.from('positions').insert({
          token_symbol,
          entry_price: price,
          qty: qtyNum,
          sl,
          tp,
          mode: 'paper'
        });

        placed.push({ token_symbol, mode: 'paper', price, qty: qtyNum });
        continue;
      }

      // 8️⃣ Live trading mode
      const r = await client.order({
        symbol: token_symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity: qtyNum.toString()
      });

      await supabase.from('orders').insert({
        token_symbol,
        side: 'BUY',
        qty: qtyNum,
        price,
        sl,
        tp,
        status: 'PLACED',
        exchange_order_id: r.orderId?.toString(),
        mode: 'live',
        metadata: { fills: r.fills, trigger_score, confidence, risk_band }
      });

      placed.push({ token_symbol, mode: 'live', orderId: r.orderId, qty: qtyNum });
    }

    return res.status(200).json({ ok: true, placed });
  } catch (e: any) {
    console.error('Trade Trigger Error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
