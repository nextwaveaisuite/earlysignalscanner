export default function Spark({series}:{series:number[]}){
  const max = Math.max(...series, 1);
  return (
    <div className="spark">
      {series.map((v,i)=>{
        const h = Math.round((v/max)*26)+2;
        return <i key={i} style={{left: i*7, width:5, height: h}}/>;
      })}
    </div>
  )
}
