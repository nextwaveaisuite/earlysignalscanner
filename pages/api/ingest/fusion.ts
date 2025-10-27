// pages/api/ingest/fusion.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Binance from 'binance-api-node';

// ---- env
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
const BINANCE_MODE = process.env.BINANCE_MODE || 'testnet';
const BINANCE_API_KEY = process.env.BINANCE_API_KEY!;
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Build a Binance client that works in testnet (Spot)
function getBinanceClient() {
  const test = BINANCE_MODE === 'testnet';
  return Binance({
    apiKey: BINANCE_API_KEY,
    apiSecret: BINANCE_API_SECRET,
    httpBase: test ? 'https://testnet.binance.vision' : undefined,
    wsBase: test ? 'wss://testnet.binance.vision' : undefined
  });
}

// Helper: clamp to range
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1) Get top N candidate signals from DB (risk/conf thresholds applied inside RPC)
    const { data: signals, error: sigErr } = await supabase.rpc('get_top_trade_signals', { max_rows: 25 });
    if (sigErr) throw sigErr;

    if (!signals || signals.length === 0) {
      return res.status(200).json({ ok: true, msg: 'no signals' });
    }

    // 2) For each symbol, compute chatter momentum from social/news + price sidecar stats
    const now = new Date();
    const winAStart = new Date(now.getTime() - 30 * 60 * 1000); // last 30m
    const winBStart = new Date(now.getTime() - 60 * 60 * 1000); // 30–60m ago

    const client = getBinanceClient();
    const results: any[] = [];

    for (const s of signals) {
      const symbol = s.token_symbol;

      // SOCIAL/NEWS MOMENTUM — counts in last 30m vs prev 30m
      const { data: newsA } = await supabase
        .from('news_items')
        .select('id')
        .eq('token_symbol', symbol)
        .gte('created_at', winAStart.toISOString());

      const { data: newsB } = await supabase
        .from('news_items')
        .select('id')
        .eq('token_symbol', symbol)
        .gte('created_at', winBStart.toISOString())
        .lt('created_at', winAStart.toISOString());

      const { data: socA } = await supabase
        .from('social_posts')
        .select('id')
        .eq('token_symbol', symbol)
        .gte('created_at', winAStart.toISOString());

      const { data: socB } = await supabase
        .from('social_posts')
        .select('id')
        .eq('token_symbol', symbol)
        .gte('created_at', winBStart.toISOString())
        .lt('created_at', winAStart.toISOString());

      const a = (newsA?.length || 0) + (socA?.length || 0);
      const b = (newsB?.length || 0) + (socB?.length || 0);
      const momentum = a + b === 0 ? 0 : (a - b) / Math.max(1, b); // could be >1; scale next
      // scale to -1..+1 softly
      const sentiment_delta = clamp(momentum, -1, 1);

      // PRICE/Liquidity — 24h stats (rough proxy)
      // NOTE: testnet has limited symbols; in testnet this may return undefined. Handle gracefully.
      let volume_proxy_usd = 0;
      let volatility_penalty = 0;

      try {
        const stats = await client.dailyStats({ symbol });
        // quoteVolume is in quote asset (e.g., USDT)
        volume_proxy_usd = Number(stats.quoteVolume || 0);

        // simple volatility penalty using (high-low)/close scaled to 0..100
        const high = Number(stats.highPrice || 0);
        const low = Number(stats.lowPrice || 0);
        const last = Number(stats.lastPrice || 0);
        const rangePct = last > 0 ? ((high - low) / last) : 0; // e.g., 0.10 = 10%
        volatility_penalty = clamp(rangePct * 100, 0, 100);     // 0..100
      } catch {
        // testnet or unknown symbol — keep proxies at 0
      }

      // 3) Compose TRIGGER SCORE (0..100)
      // Weights — tweak as you learn:
      const wConf = 0.55;     // confidence
      const wSent = 0.25;     // sentiment momentum
      const wVolu = 0.12;     // liquidity floor
      const wVola = 0.08;     // penalty weight

      const confTerm = clamp(Number(s.confidence), 0, 100) * wConf;

      // sentiment: -1..+1 → 0..100 scale (50 = neutral)
      const sentPct = 50 + 50 * sentiment_delta; // -1->0, 0->50, +1->100
      const sentTerm = sentPct * wSent;

      // liquidity: map log-scale quote volume into 0..100 (very rough)
      //   $0  -> 0
      //   $1M -> ~66
      //   $10M-> ~100
      const voluLog = Math.log10(Math.max(1, volume_proxy_usd));
      const voluPct = clamp((voluLog / 7) * 100, 0, 100); // 10^7 ≈ $10,000,000
      const voluTerm = voluPct * wVolu;

      const volaTerm = clamp(volatility_penalty, 0, 100) * wVola;

      const trigger_score = clamp(confTerm + sentTerm + voluTerm - volaTerm, 0, 100);

      // 4) Insert a trigger snapshot (append-only)
      await supabase.from('trade_triggers').insert({
        token_symbol: symbol,
        trigger_score,
        confidence: Number(s.confidence),
        risk_band: s.risk_band,
        sentiment_delta,
        volume_proxy_usd: volume_proxy_usd || null,
        volatility_penalty
      });

      results.push({ symbol, trigger_score });
    }

    return res.status(200).json({ ok: true, triggers: results });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
