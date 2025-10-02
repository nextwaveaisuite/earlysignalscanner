export default function ConfidenceBadge({level}:{level:'LOW'|'MED'|'HIGH'}){
  const colors = { LOW:'badge', MED:'badge', HIGH:'badge'} as const;
  const label = level==='HIGH'? 'Confidence: High' : level==='MED' ? 'Confidence: Med' : 'Confidence: Low';
  return <span className={colors[level]}>{label}</span>
}
