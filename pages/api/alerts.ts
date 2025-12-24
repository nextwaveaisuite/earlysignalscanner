import { useEffect, useState } from "react";

type Alert = {
  token_symbol: string;
  risk_band: string;
  confidence: number;
  score: number;
  created_at: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ALWAYS relative path — never env based
    fetch("/api/alerts")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((d) => setAlerts(d.alerts || []))
      .catch(() => setError("Failed to load alerts"));
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>SignalRadar Alerts</h1>

      {alerts.length === 0 && <p>No alerts yet.</p>}

      {alerts.map((a, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #333",
            marginBottom: 12,
            padding: 12,
            borderRadius: 6
          }}
        >
          <strong>{a.token_symbol}</strong><br />
          Risk: {a.risk_band}<br />
          Confidence: {a.confidence}%<br />
          Score: {a.score}
        </div>
      ))}
    </div>
  );
}
