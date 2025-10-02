export default function Glossary(){
  const items = [
    {k:'Safety Badge', v:'GREEN = basic checks okay; AMBER = caution; RED = high risk.'},
    {k:'Confidence', v:'How strong and broad the recent positive attention looks.'},
    {k:'Prob ↑ (4h)', v:'Estimated chance of an upward move in the next ~4 hours.'},
    {k:'Breadth↑', v:'More unique people talking about it (less hype from few accounts).'},
    {k:'Narrative↑', v:'The story/theme around the token is heating up.'}
  ];
  return (
    <div>
      <div className="h1">Quick Glossary</div>
      <ul style={{paddingLeft:18, marginTop:8}}>
        {items.map((x)=> <li key={x.k} className="small"><b>{x.k}:</b> {x.v}</li>)}
      </ul>
    </div>
  );
}
