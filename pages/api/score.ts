import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';

function composite(f:any){
  const score = 0.30*(f.narrative_momentum||0) + 0.20*(f.social_breadth||0) + 0.15*(f.dev_velocity||0) + 0.15*(f.liq_health||0) + 0.10*(f.tokenomics_quality||0) - 0.10*(f.risk_penalty||0);
  const prob = 1/(1+Math.exp(-score));
  return { score, prob };
}

function safetyToLevel(f:any): 'GREEN'|'AMBER'|'RED' {
  const risk = (f.risk_penalty||0);
  if (risk <= -0.5) return 'GREEN';
  if (risk < 0.8) return 'AMBER';
  return 'RED';
}

function confidenceFromInputs(f:any): 'LOW'|'MED'|'HIGH' {
  const breadth = f.social_breadth||0, narrative=f.narrative_momentum||0;
  if (breadth>1.0 && narrative>1.0) return 'HIGH';
  if (breadth>0.3 || narrative>0.3) return 'MED';
  return 'LOW';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const today = new Date().toISOString().slice(0,10);
  const { data: feats, error } = await supa.from('features_daily').select('*').lte('dt', today);
  if (error) return res.status(500).json({ error });
  if (!feats || feats.length===0) return res.json({ ok:true, message:'no features yet' });

  const rows = feats.slice(0,50).map((f:any)=>{
    const { score, prob } = composite(f);
    const risk_level = safetyToLevel(f);
    const confidence = confidenceFromInputs(f);
    return {
      dt: today,
      token_id: f.token_id,
      composite_score: score,
      prob_up_4h: prob,
      risk_level,
      confidence,
      explain: { breadth_delta: Math.max(0, f.social_breadth||0), narrative_delta: Math.max(0, f.narrative_momentum||0) }
    };
  });

  const { error: up } = await supa.from('scores_daily').upsert(rows, { onConflict:'dt,token_id' });
  if (up) return res.status(500).json({ error: up });

  res.json({ ok:true, scored: rows.length });
}
