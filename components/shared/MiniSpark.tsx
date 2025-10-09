export function MiniSpark({ data }: { data: number[] }) {
  if (!data?.length) return null;
  const w = 100, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const norm = (v:number) => max === min ? h/2 : (h - ((v - min) / (max - min)) * h);
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const d = data.map((v,i)=>`${i===0?'M':'L'} ${i*step},${norm(v)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
