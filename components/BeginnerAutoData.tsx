"use client";
import { useEffect, useState } from "react";

export default function BeginnerAutoData({ initial }:{ initial:{
  alerts:any[]; scores:any[]; pl:any[];
}}) {
  const [alerts, setAlerts] = useState(initial.alerts);
  const [scores, setScores] = useState(initial.scores);
  const [pl, setPl] = useState(initial.pl);

  useEffect(() => {
    let cancel = false;
    async function tick() {
      try {
        const [a,s,p] = await Promise.all([
          fetch("/api/alerts", { cache:"no-store" }).then(r=>r.json()),
          fetch("/api/score", { cache:"no-store" }).then(r=>r.json()),
          fetch("/api/market/stream?mode=daily-pl", { cache:"no-store" }).then(r=>r.json()),
        ]);
        if (!cancel) { setAlerts(a); setScores(s); setPl(p); }
      } catch {}
    }
    const t = setInterval(tick, 15000);
    return () => { cancel = true; clearInterval(t); };
  }, []);

  // Expose via window for debugging (optional)
  // @ts-ignore
  if (typeof window !== "undefined") window.__beginnerData = { alerts, scores, pl };

  return null; // data is kept in state; use filters above for UI rendering if needed
}
