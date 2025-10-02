import { supa } from "@/lib/db";

export async function getScoresWithTokens(){
  const today = new Date().toISOString().slice(0,10);
  const { data, error } = await supa
    .from('scores_daily')
    .select('prob_up_4h, composite_score, risk_level, confidence, explain, token_id, tokens:scores_daily_token_id_fkey(symbol,name,chain)')
    .eq('dt', today)
    .order('composite_score', { ascending: false })
    .limit(20);

  if (error || !data) return stubScores();

  return data.map((r:any)=>({
    prob_up_4h: r.prob_up_4h,
    composite_score: r.composite_score,
    risk_level: r.risk_level,
    confidence: r.confidence,
    explain: r.explain,
    symbol: r.tokens?.symbol || 'TKN',
    name: r.tokens?.name || 'Token',
    chain: r.tokens?.chain || 'EVM'
  }));
}

export async function getAlerts(){
  const { data, error } = await supa
    .from('alerts')
    .select('*')
    .order('dt', { ascending: false })
    .limit(20);
  if (error || !data) return stubAlerts();
  return data;
}

function stubScores(){
  return [
    { symbol:'NOVA', name:'Nova AI', chain:'Base', prob_up_4h:0.71, composite_score: 1.84, risk_level:'GREEN', confidence:'HIGH', explain:{ breadth_delta:.82, narrative_delta:.67, spark:[2,3,4,5,7,9,11] } },
    { symbol:'FLOW', name:'FlowPad', chain:'Solana', prob_up_4h:0.62, composite_score: 1.22, risk_level:'AMBER', confidence:'MED', explain:{ breadth_delta:.44, narrative_delta:.38, spark:[1,2,2,3,4,5,6] } },
    { symbol:'CORE', name:'CoreNet', chain:'ETH', prob_up_4h:0.41, composite_score: 0.35, risk_level:'RED', confidence:'LOW', explain:{ breadth_delta:.12, narrative_delta:.10, spark:[1,1,1,2,2,2,2] } }
  ];
}

function stubAlerts(){
  return [
    { id:1, dt:new Date().toISOString(), type:'NARRATIVE_BREAKOUT', severity:'critical', title:'AI Agents narrative breakout', details:{ symbol:'NOVA', breadth: 120, narrative: 185, risk:'GREEN' } },
    { id:2, dt:new Date(Date.now()-1000*60*20).toISOString(), type:'BREADTH_SURGE', severity:'warning', title:'Breadth surge on FLOW', details:{ symbol:'FLOW', breadth: 88, narrative: 45, risk:'AMBER' } },
    { id:3, dt:new Date(Date.now()-1000*60*60).toISOString(), type:'RISK_FLIP', severity:'info', title:'Ownership renounced on CORE', details:{ symbol:'CORE', risk:'AMBER' } }
  ];
}
