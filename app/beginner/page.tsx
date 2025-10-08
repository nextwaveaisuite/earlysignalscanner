export const dynamic = "force-dynamic";

import HeaderBar from "@/components/HeaderBar";
import AlertFeed from "@/components/AlertFeed";
import TopSignals from "@/components/TopSignals";
import DailyPL from "@/components/DailyPL";
import BeginnerSettings from "@/components/BeginnerSettings";
import Glossary from "@/components/Glossary";

export default function Beginner() {
  return (
    <main className="min-h-screen bg-nextwave text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <HeaderBar />
        <div className="grid gap-6 md:grid-cols-3">
          <section className="md:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Live Alerts</h2>
                <p className="card-sub">Narratives, on-chain, sentiment</p>
              </div>
              <div className="card-body"><AlertFeed /></div>
            </div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Top Signals</h2>
                <p className="card-sub">Score • Risk • Confidence • Momentum</p>
              </div>
              <div className="card-body"><TopSignals /></div>
            </div>
          </section>
          <aside className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Daily P/L</h2>
                <p className="card-sub">Paper trading results</p>
              </div>
              <div className="card-body"><DailyPL /></div>
            </div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Beginner Settings</h2>
                <p className="card-sub">Stops, caps, take-profit</p>
              </div>
              <div className="card-body"><BeginnerSettings /></div>
            </div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Glossary</h2>
                <p className="card-sub">Plain-English definitions</p>
              </div>
              <div className="card-body"><Glossary /></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
