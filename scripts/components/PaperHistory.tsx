'use client';
import { useEffect, useState } from 'react';

type Row = { id:number; ts:string; symbol:string; side:'BUY'|'SELL'; entry:number; qty:number; sl:number; tp:number; status:string };

function StatusBadge({s}:{s:string}){
  const map:any = { open:'badge', tp_hit:'badge green', sl_hit:'badge red' };
  const text:any = { open:'Open', tp_hit:'TP hit', sl_hit:'SL hit' };
  return <span className={map[s]||'badge'}>{text[s]||s}</span>;
}

export default function PaperHistory(){
  const [rows, setRows] = useState<Row[]>([]);
  async function load(){
    const r = await fetch('/api/trade/history?limit=50');
    const j = await r.json(); setRows(j.orders||[]);
  }
  useEffect(()=>{ load(); const t=setInterval(load, 5000); return ()=>clearInterval(t); },[]);
  return (
    <div className="card" style={{marginTop:16}}>
      <div className="h1">Paper Trades (Today)</div>
      <div className="list">
        {rows.length===0 && <div className="small">No practice trades yet.</div>}
        {rows.map(r=> (
          <div className="row" key={r.id}>
            <div className="left">
              <div>
                <div className="token">{r.symbol}</div>
                <div className="small">{new Date(r.ts).toLocaleTimeString()} · {r.side} @ {r.entry}</div>
                <div className="small">SL {r.sl} · TP {r.tp} · Qty {Number(r.qty).toFixed(4)}</div>
              </div>
            </div>
            <StatusBadge s={r.status}/>
          </div>
        ))}
      </div>
    </div>
  );
}
