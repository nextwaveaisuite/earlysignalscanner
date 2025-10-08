export default function ConfidenceBadge({ value=0 }: { value?: number }) {
  return <span className="badge">Confidence: {Math.round(value)}%</span>;
}
