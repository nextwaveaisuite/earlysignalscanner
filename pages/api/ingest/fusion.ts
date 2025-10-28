import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Binance from 'binance-api-node';

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const BINANCE_MODE = process.env.BINANCE_MODE || 'testnet';
const BINANCE_API_KEY = process.env.BINANCE_API_KEY || '';
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET || '';

function client(){
  const test = BINANCE_MODE === 'testnet';
  return Binance({ apiKey: BINANCE_API_KEY, apiSecret: BINANCE_API_SECRET,
    httpBase: test ? 'https://testnet.binance.vision' : undefined,
    wsBase: test ? 'wss://testnet.binance.vision' : undefined });
}

const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try{
    const { data: signals, error: sigErr } = await supa.rpc('get_top_trade_signals', { max_rows: 25 });
    if (sigErr) throw sigErr;
    if (!signals?.length) return res.status(200).json({ ok:true, msg:'no signals' });

    const now = new Date();
    const aStart = new Date(now.getTime() - 30*60*1000);
    const bStart = new Date(now.getTime() - 60*60*1000);
    const bin = client();
    const results:any[] = [];

    for (const s of signals){
      const symbol = s.token_symbol;

      const { data: newsA } = await supa.from('news_items').select('id').eq('token_symbol', symbol).gte('created_at', aStart.toISOString());
      const { data: newsB } = await supa.from('news_items').select('id').eq('token_symbol', symbol).gte('created_at', bStart.toISOString()).lt('created_at', aStart.toISOString());
      const { data: socA }  = await supa.from('social_posts').select('id').eq('token_symbol', symbol).gte('created_at', aStart.toISOString());
      const { data: socB }  = await supa.from('social_posts').select('id').eq('token_symbol', symbol).gte('created_at', bStart.toISOString()).lt('created_at', aStart.toISOString());

      const a = (newsA?.length||0)+(socA?.length||0);
      const b = (newsB?.length||0)+(socB?.length||0);
      const momentum = a + b == 0 ? 0 : (a - b)/Math.max(1,b);
      const sentiment_delta = clamp(momentum, -1, 1);

      let volume_proxy_usd = 0; let volatility_penalty = 0;
      try {
        const stats:any = await bin.dailyStats({ symbol });
        const high = Number(stats.highPrice||0), low=Number(stats.lowPrice||0), last=Number(stats.lastPrice||0);
        volume_proxy_usd = Number(stats.quoteVolume||0);
        const rangePct = last>0 ? ((high-low)/last) : 0;
        volatility_penalty = clamp(rangePct*100, 0, 100);
      } catch {}

      const wConf=0.55, wSent=0.25, wVolu=0.12, wVola=0.08;
      const confTerm = clamp(Number(s.confidence),0,100)*wConf;
      const sentPct = 50 + 50*sentiment_delta;
      const sentTerm = sentPct * wSent;
      const voluLog = Math.log10(Math.max(1, volume_proxy_usd));
      const voluPct = clamp((voluLog/7)*100, 0, 100);
      const voluTerm = voluPct * wVolu;
      const volaTerm = clamp(volatility_penalty,0,100)*wVola;

      const trigger_score = clamp(confTerm + sentTerm + voluTerm - volaTerm, 0, 100);

      await supa.from('trade_triggers').insert({
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
    return res.status(200).json({ ok:true, triggers: results });
  } catch(e:any){
    return res.status(500).json({ ok:false, error:e.message });
  }
}
