'use client';
import { useEffect, useState } from 'react';

type Ledger = { d:string; realized_pnl:number; loss_cap:number };

export default function DailyPL(){
  const [ledger, setLedger] = useState<Ledger|undefined>();

  async function load(){
    const r = await fetch('/api/risk/ledger');
    const j = await r.json();
    setLedger(j.ledger);
  }
  useEffect(()=>{ load(); const t = setInterval(load, 5000); return ()=>clearInterval(t); },[]);

  const pnl = ledger?.realized_pnl||0; const cap = ledger?.loss_cap||0;
  const pct = cap>0 ? Math.min(100, Math.max(0, ((pnl+cap)/(2*cap))*100)) : 50;

  return (
    <div className="card" style={{marginTop:16}}>
      <div className="h1">Daily P/L</div>
      <div className="kpi"><span className="num">${pnl.toFixed(2)}</span><span className="small"> · Cap: ${cap.toFixed(0)}</span></div>
      <div className="progress" style={{marginTop:8}}><i style={{width: pct+'%'}}/></div>
      <div className="small" style={{marginTop:8}}>Updates every 5s. New trades pause once losses reach the cap.</div>
    </div>
  );
}
