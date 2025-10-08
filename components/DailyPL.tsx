import { getDailyPL } from "@/lib/serverData";

export default async function DailyPL(){
  const series = await getDailyPL();
  if(!series?.length) return <p className="text-slate-400 text-sm">No P/L yet.</p>;
  return (
    <ul className="space-y-2">
      {series.map((d: any, i: number) => (
        <li key={i} className="flex justify-between">
          <span className="text-slate-300 text-sm">{d.date}</span>
          <span className="text-slate-100 text-sm">R {d.realized ?? 0} / U {d.unrealized ?? 0}</span>
        </li>
      ))}
    </ul>
  );
}
