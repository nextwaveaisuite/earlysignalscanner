import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE!;
const supa = createClient(url, service);

const SYMBOLS = ['PEPEUSDT','BONKUSDT','WIFUSDT','SHIBUSDT'];
function pick<T>(arr:T[]){return arr[Math.floor(Math.random()*arr.length)];}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const rows = Array.from({length:4}).map(()=>{
      const risk = pick(['LOW','MEDIUM','LOW','LOW','MEDIUM']);
      const confidence = Math.min(95, Math.max(55, Math.floor(60 + Math.random()*40)));
      const score = Math.min(95, Math.max(50, Math.floor(55 + Math.random()*40)));
      return { token_symbol: pick(SYMBOLS), risk_band: risk, confidence, score };
    });
    const { error } = await supa.from('alerts').insert(rows);
    if (error) throw error;
    res.status(200).json({ ok:true, inserted: rows.length });
  }catch(e:any){
    res.status(500).json({ ok:false, error:e.message });
  }
}
