export default function RiskBadge({ level="LOW" }: { level?: "LOW"|"MEDIUM"|"HIGH" }) {
  const color = level==="HIGH" ? "text-red-300" : level==="MEDIUM" ? "text-yellow-300" : "text-emerald-300";
  return <span className={`badge ${color}`}>Risk: {level}</span>;
}
