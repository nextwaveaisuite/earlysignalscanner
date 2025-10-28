import useSWR from 'swr';

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

function Badge({risk}:{risk:string}){
  const cls = risk==='LOW'?'low':risk==='HIGH'?'high':'med';
  return <span className={`badge ${cls}`}>{risk}</span>;
}

export default function Home(){
  const { data } = useSWR('/api/alerts', fetcher, { refreshInterval: 10000 });
  const alerts = data?.alerts || [];

  return (
    <div className="wrap">
      <h1>SignalRadar</h1>
      <p><small>Autonomous Microcap Crypto Signal & Paper Trading (Binance testnet by default)</small></p>

      <div className="grid">
        <div className="card">
          <h2>Live Alerts</h2>
          {alerts.length===0 && <p>No alerts yet.</p>}
          {alerts.map((a:any)=> (
            <div key={a.id} style={{marginBottom:12}}>
              <div><strong>{a.token_symbol}</strong> &nbsp; <Badge risk={a.risk_band}/></div>
              <div>Confidence: <code>{a.confidence}%</code> | Score: <code>{a.score}</code></div>
              <small>{new Date(a.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Status</h2>
          <ul>
            <li>/api/ingest/* crons active via <code>vercel.json</code></li>
            <li>Paper trades auto-close via <code>/api/paper/mark</code></li>
            <li>Trade trigger runs every 5 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
