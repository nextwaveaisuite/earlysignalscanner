// app/page.tsx
import React from "react";
import TopSignals from "@/components/TopSignals";
import AlertFeed from "@/components/AlertFeed";
import HeaderBar from "@/components/HeaderBar";
import BeginnerPanel from "@/components/BeginnerPanel";

export default function Page(): JSX.Element {
  return (
    <main className="container">
      <HeaderBar />
      <BeginnerPanel onChange={() => {}} />
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h2 className="h1">Top Signals</h2>
          <p className="sub">
            Well-defined, safety-weighted picks. Confidence tiers and risk
            badges make safer micro-cap candidates stand out.
          </p>
          <TopSignals />
        </section>
        <aside className="card">
          <h2 className="h1">Alert Feed</h2>
          <p className="sub">
            Live triggers for Narrative Breakouts, Breadth Surges, Dev Wake-ups
            and Risk Flips—sorted by severity.
          </p>
          <AlertFeed />
        </aside>
      </div>
      <div className="footer">
        Analytics are probabilistic and educational—this is not financial
        advice.
      </div>
    </main>
  );
}
