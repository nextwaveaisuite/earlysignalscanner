import RiskBadge from "@/components/shared/RiskBadge";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import Spark from "@/components/shared/Spark";
import { getScoresWithTokens } from "@/lib/serverData";

export default async function TopSignals(){
  const items = await getScoresWithTokens();
  if(!items?.length) return <p className="text-slate-400 text-sm">No signals yet.</p>;
  return (
    <div className="space-y-4">
      {items.map((t: any, i: number) => (
        <div key={i} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{t.symbol ?? t.name ?? t.token}</div>
            <div className="text-slate-400 text-sm">Score {t.score ?? 0}</div>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge level={(t.risk as any) ?? "LOW"} />
            <ConfidenceBadge value={t.confidence ?? 0} />
            <Spark data={t.sparkline ?? []}/>
          </div>
        </div>
      ))}
    </div>
  );
}
