import type { NextApiRequest, NextApiResponse } from 'next';
import { supa } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const today = new Date().toISOString().slice(0,10);
  const { data: scores } = await supa.from('scores_daily').select('*').eq('dt', today);

  const newAlerts:any[] = [];
  (scores||[]).forEach((s:any)=>{
    if ((s.explain?.narrative_delta||0) > 0.8 && (s.explain?.breadth_delta||0)>0.8) {
      newAlerts.push({ type:'NARRATIVE_BREAKOUT', severity:'critical', title:'Narrative breakout', token_id:s.token_id, details:{...s.explain} });
    } else if ((s.explain?.breadth_delta||0) > 0.6) {
      newAlerts.push({ type:'BREADTH_SURGE', severity:'warning', title:'Breadth surge', token_id:s.token_id, details:{...s.explain} });
    }
    if (s.risk_level==='GREEN' && (s.explain?.narrative_delta||0)>0.4) {
      newAlerts.push({ type:'FRESH_LAUNCH_SAFE', severity:'info', title:'Fresh launch safe candidate', token_id:s.token_id, details:{...s.explain} });
    }
  });

  if (newAlerts.length) {
    const rows = newAlerts.map(a=>({ dt:new Date().toISOString(), ...a }));
    await supa.from('alerts').insert(rows);
  }

  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (hook){
    const critical = newAlerts.filter(a=>a.severity==='critical');
    for (const c of critical){
      const text = `**${c.title}**\nBreadth +${c.details?.breadth||0}% · Narrative +${c.details?.narrative||0}%`;
      await fetch(hook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: text })});
    }
  }

  res.json({ ok:true, created: newAlerts.length });
}
