// app/beginner/page.tsx
import React from "react";
import HeaderBar from "@/components/HeaderBar";
import BeginnerPanel from "@/components/BeginnerPanel";
import TopSignals from "@/components/TopSignals";
import AlertFeed from "@/components/AlertFeed";
import Glossary from "@/components/Glossary";
import BeginnerSettings from "@/components/BeginnerSettings";
import BeginnerTicket from "@/components/BeginnerTicket";
import DailyPL from "@/components/DailyPL";
import PaperHistory from "@/components/PaperHistory";

export default function BeginnerPage(): JSX.Element {
  return (
    <main className="container">
      <HeaderBar />
      <BeginnerPanel onChange={() => {}} />
      <BeginnerSettings />
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h2 className="h1">Top Signals (Beginner)</h2>
          <p className="sub">
            Safety-Only + Plain English. Probability is an estimate; not
            financial advice.
          </p>
          <TopSignals />
        </section>
        <aside className="card">
          <h2 className="h1">Alert Feed</h2>
          <AlertFeed />
          <div style={{ marginTop: 16 }}>
            <Glossary />
          </div>
          <BeginnerTicket />
          <DailyPL />
          <PaperHistory />
        </aside>
      </div>
      <div className="footer">Educational analytics only. Trading disabled by default.</div>
    </main>
  );
}
