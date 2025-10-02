import type { NextApiRequest, NextApiResponse } from 'next';
export const config = { api: { bodyParser: false } };

function mulberry32(a:number){
  return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14) >>> 0) / 4294967296; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const url = new URL(req.url||'', 'http://localhost');
  const symbol = (url.searchParams.get('symbol')||'DEMOUSDT').toUpperCase();
  const seed = Array.from(symbol).reduce((s,c)=> s + c.charCodeAt(0), 0);
  const rand = mulberry32(seed);
  let price = 1 + (rand()*0.2);

  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });

  const iv = setInterval(()=>{
    const drift = (rand()-0.5)*0.01;
    price = Math.max(0.0001, price * (1 + drift));
    const tick = { t: Date.now(), symbol, price: price.toFixed(6) };
    res.write(`data: ${JSON.stringify(tick)}\n\n`);
  }, 1000);
  req.on('close', ()=> clearInterval(iv));
}
