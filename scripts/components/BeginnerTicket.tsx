'use client';
import { useState, useEffect } from 'react';

export default function BeginnerTicket(){
  const [symbol, setSymbol] = useState('DEMOUSDT');
  const [side, setSide] = useState<'BUY'|'SELL'>('BUY');
  const [entry, setEntry] = useState(1.0000);
  const [resp, setResp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState({ maxRiskPct: 0.01, slPct: 0.03, tpRR: 2.0, paperOnly: true, dailyLossCap: 200 });

  useEffect(()=>{
    const saved = localStorage.getItem('beginner_prefs');
    if (saved){
      const p = JSON.parse(saved);
      setRisk({ maxRiskPct: p.maxRiskPct, slPct: p.slPct, tpRR: p.tpRR, paperOnly: p.paperOnly, dailyLossCap: p.dailyLossCap });
    }
  },[]);

  async function place(){
    setLoading(true);
    const r = await fetch('/api/trade/risk_place', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ symbol, side, entry, mode:'PAPER', ...risk })});
    const j = await r.json(); setResp(j); setLoading(false);
  }

  useEffect(()=>{
    if (!resp?.ok || !resp?.orderId) return;
    const es = new EventSource(`/api/market/stream?symbol=${encodeURIComponent(symbol)}`);
    const entryP = Number(resp.entry); const tp = Number(resp.tp); const sl = Number(resp.sl);
    const s = (resp.side || 'BUY') as 'BUY'|'SELL';
    const qty = Number(resp.qty||0);
    function check(p: number){
      if (s==='BUY'){
        if (p >= tp) return {outcome:'TP', pnl:(tp-entryP)*qty};
        if (p <= sl) return {outcome:'SL', pnl:(sl-entryP)*qty};
      } else {
        if (p <= tp) return {outcome:'TP', pnl:(entryP-tp)*qty};
        if (p >= sl) return {outcome:'SL', pnl:(entryP-sl)*qty};
      }
      return null;
    }
    es.onmessage = async (ev)=>{
      try{
        const tick = JSON.parse(ev.data);
        const price = Number(tick.price);
        const hit = check(price);
        if (hit){
          es.close();
          setResp((r:any)=>({...r, outcome: hit.outcome, pnl: hit.pnl }));
          await fetch('/api/trade/paper_settle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: resp.orderId, outcome: hit.outcome, pnl: hit.pnl })});
        }
      }catch(err){ /* ignore */ }
    };
    return ()=> es.close();
  }, [resp?.orderId]);

  return (
    <div className="card" style={{marginTop:16}}>
      <div className="h1">Practice Trade (Paper)</div>
      <div className="small">Auto‑stop and take‑profit are added for you. Live trading is off.</div>
      <div className="list" style={{marginTop:8}}>
        <div className="row"><div className="left"><b>Symbol</b></div><input value={symbol} onChange={e=>setSymbol(e.target.value)} /></div>
        <div className="row"><div className="left"><b>Side</b></div>
          <select value={side} onChange={e=>setSide(e.target.value as any)}><option>BUY</option><option>SELL</option></select>
        </div>
        <div className="row"><div className="left"><b>Entry Price</b></div><input type="number" step="0.0001" value={entry} onChange={e=>setEntry(parseFloat(e.target.value))} /></div>
        <button className="row" onClick={place} disabled={loading}>
          <div className="left"><b>{loading?'Placing…':'Place Paper Trade with Auto SL/TP'}</b></div>
        </button>
        {resp?.ok && (
          <div className="row">
            <div>
              <div className="small">Qty: {Number(resp.qty||0).toFixed(4)}</div>
              <div className="small">SL: {Number(resp.sl||0).toFixed(6)} · TP: {Number(resp.tp||0).toFixed(6)}</div>
              <div className="small">Risk: {(resp.risk.maxRiskPct*100).toFixed(1)}% of ${(resp.risk.balance).toFixed(0)} (≈ ${(resp.risk.balance*resp.risk.maxRiskPct).toFixed(2)})</div>
            </div>
          </div>
        )}
        {resp?.outcome && (
          <div className="row">
            <div>
              <div className="small"><b>What happened:</b> {resp.outcome==='TP' ? 'Take‑profit hit' : 'Stop‑loss hit'}</div>
              <div className="small">P/L: ${Number(resp.pnl||0).toFixed(2)}</div>
            </div>
          </div>
        )}
        {resp?.error && <div className="row"><div className="small" style={{color:'#ff9a9a'}}>Error: {resp.error}</div></div>}
      </div>
    </div>
  )
}
