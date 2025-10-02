import { getAlerts } from "@/lib/serverData";

function Pill({children}:{children:React.ReactNode}){
  return <span className="badge" style={{background:'rgba(255,255,255,.04)'}}>{children}</span>
}

export default async function AlertFeed(){
  const alerts = await getAlerts();
  return (
    <div className="list">
      {alerts.map((a:any)=> (
        <div key={a.id} className={`alert ${a.severity}`}>
          <div style={{width:8, height:8, borderRadius:4, marginTop:6, background:a.severity==='critical'?'#ff9a9a':a.severity==='warning'?'#ffd68a':'#6ea8ff'}}/>
          <div style={{flex:1}}>
            <div className="title">{a.title}</div>
            <div className="small" style={{marginTop:4}}>{new Date(a.dt).toLocaleString()}</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
              <Pill>{a.type.replaceAll('_',' ')}</Pill>
              {a.details?.symbol && <Pill>{a.details.symbol}</Pill>}
              {a.details?.risk && <Pill>Risk: {a.details.risk}</Pill>}
              {a.details?.breadth && <Pill>Breadth↑ {a.details.breadth}%</Pill>}
              {a.details?.narrative && <Pill>Narrative↑ {a.details.narrative}%</Pill>}
              {a.details?.dev && <Pill>Dev wake {a.details.dev}</Pill>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
