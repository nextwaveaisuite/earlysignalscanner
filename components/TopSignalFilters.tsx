"use client";
import { useMemo, useState } from "react";

export default function TopSignalFilters({ items, children }:{
  items: any[]; children: (filtered:any[]) => React.ReactNode;
}) {
  const [risk, setRisk] = useState<"ALL"|"LOW"|"MEDIUM"|"HIGH">("ALL");
  const [confidence, setConfidence] = useState<"ALL"|"HIGH"|"MEDIUM"|"LOW">("ALL");
  const [easy, setEasy] = useState(true);

  const filtered = useMemo(() => {
    return (items ?? []).filter((x:any) => {
      const r = String(x.risk || "").toUpperCase();
      const cVal = Number(x.confidence ?? 0);
      const cBucket = cVal >= 75 ? "HIGH" : cVal >= 55 ? "MEDIUM" : "LOW";
      const riskOk = risk === "ALL" || r === risk;
      const confOk = confidence === "ALL" || cBucket === confidence;
      const easyOk = !easy || r === "LOW";
      return riskOk && confOk && easyOk;
    });
  }, [items, risk, confidence, easy]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="text-white/70">Risk</label>
        <select value={risk} onChange={e=>setRisk(e.target.value as any)}
          className="bg-white/5 border border-white/10 text-white rounded px-2 py-1">
          <option>ALL</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option>
        </select>

        <label className="text-white/70 ml-3">Confidence</label>
        <select value={confidence} onChange={e=>setConfidence(e.target.value as any)}
          className="bg-white/5 border border-white/10 text-white rounded px-2 py-1">
          <option>ALL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option>
        </select>

        <label className="ml-4 inline-flex items-center gap-2 text-white/80">
          <input type="checkbox" checked={easy} onChange={()=>setEasy(!easy)} />
          Easy Mode (safety-first)
        </label>
      </div>

      {children(filtered)}
    </div>
  );
}
