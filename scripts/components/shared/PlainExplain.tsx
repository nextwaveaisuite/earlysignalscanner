export default function PlainExplain({explain}:{explain?:any}){
  if (!explain) return null;
  const breadth = Math.round((explain.breadth_delta||0)*100);
  const narrative = Math.round((explain.narrative_delta||0)*100);
  return (
    <div className="small" style={{marginTop:8, lineHeight:1.45}}>
      <b>Why this is here:</b> More people are talking about it (breadth +{breadth}%),
      and the story is heating up (narrative +{narrative}%). Safety checks look okay if the badge is GREEN.
    </div>
  )
}
