import { getScoresWithTokens } from "@/lib/serverData";
import RiskBadge from "@/components/shared/RiskBadge";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import Spark from "@/components/shared/Spark";
import PlainExplain from "@/components/shared/PlainExplain";

export default async function TopSignals(){
  const rows = await getScoresWithTokens();
  return (
    <div className="list" id="top-signals-root">
      {rows.map((r:any, i:number)=>{
        const prob = (r.prob_up_4h*100).toFixed(1);
        const barWidth = Math.min(100, Math.max(0, Math.round(r.prob_up_4h*100)));
        return (
          <div className="row" key={i} data-risk={r.risk_level} data-conf={r.confidence}>
            <div className="left">
              <div>
                <div className="token">{r.symbol} · {r.name}</div>
                <div className="small">Chain: {r.chain}</div>
                <div className="badges" style={{marginTop:6}}>
                  <RiskBadge level={r.risk_level}/>
                  <ConfidenceBadge level={r.confidence}/>
                </div>
                <PlainExplain explain={r.explain} />
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, minWidth:240}}>
              <div className="kpi"><span className="num">Prob ↑ (4h): {prob}%</span></div>
              <div className="progress"><i style={{width: barWidth+'%'}}/></div>
              <Spark series={r.explain?.spark || [2,4,3,5,4,7,9]} />
            </div>
          </div>
        )
      })}
      <script dangerouslySetInnerHTML={{__html:`
        (function(){
          const params = new URLSearchParams(location.search);
          const safetyOnly = params.get('safe')!== '0';
          const min = (params.get('min')||'MED');
          const root = document.getElementById('top-signals-root');
          if(!root) return;
          const confRank = {LOW:0, MED:1, HIGH:2};
          Array.from(root.children).forEach((row)=>{
            const el = row;
            const risk = el.getAttribute('data-risk');
            const conf = el.getAttribute('data-conf');
            if (safetyOnly && risk!== 'GREEN') el.style.display='none';
            else if (confRank[conf] < confRank[min]) el.style.display='none';
          });
        })();
      `}} />
    </div>
  )
}
