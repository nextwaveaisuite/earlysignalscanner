import { getAlerts } from "@/lib/serverData";

export default async function AlertFeed(){
  const alerts = await getAlerts();
  if(!alerts?.length) return <p className="text-slate-400 text-sm">No alerts yet.</p>;
  return (
    <ul className="space-y-3">
      {alerts.map((a: any, i: number) => (
        <li key={i} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{a.symbol ?? a.token ?? "Token"}</div>
            <div className="text-slate-400 text-sm">{a.message ?? "Signal detected"}</div>
          </div>
          <div className="text-right text-sm text-slate-300">Score {a.score ?? 0}</div>
        </li>
      ))}
    </ul>
  );
}
