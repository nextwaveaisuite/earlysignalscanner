// app/beginner/page.tsx
import { getAlerts, getScoresWithTokens, getDailyPL } from "@/lib/serverData";
import { MiniSpark } from "@/components/shared/MiniSpark";
import BeginnerAutoData from "@/components/BeginnerAutoData";

// --- tiny UI helpers (server-safe) ---
function RiskBadge({ risk }: { risk: string | null | undefined }) {
  const r = String(risk || "").toUpperCase();
  const color =
    r === "LOW" ? "text-emerald-400" :
    r === "MEDIUM" ? "text-amber-400" :
    r === "HIGH" ? "text-red-400" : "text-white/60";
  return <span className={`badge ${color}`}>{r || "NA"}</span>;
}

function ConfidenceBadge({ value }: { value: number | null | undefined }) {
  const v = Number(value ?? 0);
  const bucket = v >= 75 ? "HIGH" : v >= 55 ? "MEDIUM" : "LOW";
  return <span className="badge">{bucket} • {isFinite(v) ? Math.round(v) : 0}%</span>;
}

export default async function BeginnerPage() {
  // SSR fetch of initial data
  const [alerts, scores, pl] = await Promise.all([
    getAlerts(),
    getScoresWithTokens(),
    getDailyPL(),
  ]);

  return (
    <div className="space-y-8">
      {/* mounts a client helper that refreshes data in the background */}
      <BeginnerAutoData initial={{ alerts, scores, pl }} />

      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold">Beginner Dashboard</h1>
        <p className="text-white/60">Plain-English, safety-first view.</p>
      </section>

      {/* Alerts + Settings */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-4 md:col-span-2">
          <h2 className="font-semibold mb-3">Live Alerts</h2>
          <div className="space-y-3">
            {alerts?.length ? (
              alerts.map((a: any) => (
                <div key={a.id} className="flex items-start justify-between border-b border-white/5 pb-3">
                  <div>
                    <div className="text-white/80">
                      {a.symbol ?? "—"} • {a.message}
                    </div>
                    <div className="text-white/50 text-sm">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={a.risk} />
                    <span className="badge">Score {Math.round(Number(a.score ?? 0))}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/50">No alerts yet.</div>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">Beginner Settings</h2>
          <div className="space-y-2 text-sm text-white/80">
            <div>Stop-loss: 5%</div>
            <div>Daily cap: $200</div>
            <div>Take-profit: 12%</div>
          </div>
        </div>
      </section>

      {/* Top Signals */}
      <section className="card p-4">
        <h2 className="font-semibold mb-1">Top Signals</h2>
        <p className="text-white/60 mb-3">Score • Risk • Confidence • Momentum</p>

        <div className="grid md:grid-cols-2 gap-3">
          {scores?.length ? (
            scores.map((s: any) => (
              <div
                key={s.token_id ?? `${s.symbol}-${s.name}`}
                className="flex items-center justify-between border-b border-white/5 py-3"
              >
                <div>
                  <div className="text-white/90 font-medium">
                    {s.symbol} <span className="text-white/50">({s.name})</span>
                  </div>
                  <div className="text-white/60 text-sm flex items-center gap-2">
                    <span className="badge">Score {Math.round(Number(s.score ?? 0))}</span>
                    <RiskBadge risk={s.risk} />
                    <ConfidenceBadge value={s.confidence} />
                  </div>
                </div>
                <div className="text-white/50">
                  <MiniSpark data={Array.isArray(s.sparkline) ? s.sparkline : []} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-white/50">No signals yet.</div>
          )}
        </div>
      </section>

      {/* Daily P/L */}
      <section className="card p-4">
        <h2 className="font-semibold">Daily P/L</h2>
        <p className="text-white
