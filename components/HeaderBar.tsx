export default function HeaderBar(){
  return (
    <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
      <div>
        <div className="h1">SignalRadar</div>
        <div className="sub">Early-signal scanner for new & micro-cap narratives • GitHub + Vercel + Supabase</div>
      </div>
      <div className="badges">
        <span className="badge">Last update: realtime</span>
        <span className="badge">Focus: safer micro-caps</span>
      </div>
    </header>
  )
}
