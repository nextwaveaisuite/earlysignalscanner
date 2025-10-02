export default function RiskBadge({level}:{level:'GREEN'|'AMBER'|'RED'}){
  const cls = level==='GREEN'?'badge green':level==='AMBER'?'badge amber':'badge red';
  const text = level==='GREEN'?'Safety: Green': level==='AMBER'?'Safety: Amber':'Safety: Red';
  return <span className={cls}>{text}</span>
}
