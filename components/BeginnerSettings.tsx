'use client';
import { useEffect, useState } from 'react';

type Prefs = {
  paperOnly: boolean;
  maxRiskPct: number;
  slPct: number;
  tpRR: number;
  dailyLossCap: number;
};

const DEFAULT: Prefs = { paperOnly: true, maxRiskPct: 0.01, slPct: 0.03, tpRR: 2.0, dailyLossCap: 200 };

export default function BeginnerSettings(){
  const [p, setP] = useState<Prefs>(DEFAULT);

  useEffect(()=>{
    const saved = localStorage.getItem('beginner_prefs');
    if (saved) setP(JSON.parse(saved));
  },[]);
  useEffect(()=>{ localStorage.setItem('beginner_prefs', JSON.stringify(p)); },[p]);

  return (
    <div className="card" style={{marginTop:16}}>
      <div className="h1">Beginner Safety Settings</div>
      <p className="sub">Locked to <b>Paper‑Only</b> by default. Adjust risk with simple sliders. Live trading stays off unless you deliberately enable it later.</p>

      <div className="row" style={{alignItems:'center'}}>
        <div className="left"><b>Paper‑Only Mode</b><span className="small"> · Blocks any live orders</span></div>
        <label className="badge" style={{cursor:'pointer'}}>
          <input type="checkbox" checked={p.paperOnly} onChange={e=>setP({...p, paperOnly: e.target.checked})} /> Locked
        </label>
      </div>

      <div className="list" style={{marginTop:8}}>
        <div className="row">
          <div className="left"><b>Risk per trade</b><span className="small"> · % of account if stop hits</span></div>
          <input type="range" min={0.0025} max={0.02} step={0.0025}
            value={p.maxRiskPct}
            onChange={e=>setP({...p, maxRiskPct: parseFloat(e.target.value)})} />
          <span className="badge">{(p.maxRiskPct*100).toFixed(2)}%</span>
        </div>
        <div className="row">
          <div className="left"><b>Stop size</b><span className="small"> · % below/above entry</span></div>
          <input type="range" min={0.01} max={0.08} step={0.005}
            value={p.slPct}
            onChange={e=>setP({...p, slPct: parseFloat(e.target.value)})} />
          <span className="badge">{(p.slPct*100).toFixed(2)}%</span>
        </div>
        <div className="row">
          <div className="left"><b>Take‑profit multiple</b><span className="small"> · Rewards vs. risk (R)</span></div>
          <input type="range" min={1.0} max={3.0} step={0.25}
            value={p.tpRR}
            onChange={e=>setP({...p, tpRR: parseFloat(e.target.value)})} />
          <span className="badge">{p.tpRR.toFixed(2)}R</span>
        </div>
        <div className="row">
          <div className="left"><b>Daily loss cap</b><span className="small"> · Halt new trades once losses reach this amount</span></div>
          <input type="range" min={50} max={1000} step={25}
            value={p.dailyLossCap}
            onChange={e=>setP({...p, dailyLossCap: parseFloat(e.target.value)})} />
          <span className="badge">${p.dailyLossCap.toFixed(0)}</span>
        </div>
      </div>

      <div className="small" style={{marginTop:8}}>
        These settings auto‑apply to the Beginner Paper Ticket and (if you ever enable live trading) will be validated by the backend before any real order is sent.
      </div>
    </div>
  );
}
