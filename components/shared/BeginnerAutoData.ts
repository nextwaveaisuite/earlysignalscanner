"use client";

import { useEffect, useState } from "react";

type Item = Record<string, any>;

export default function BeginnerAutoData({
  initial,
}: {
  initial: { alerts: Item[]; scores: Item[]; pl: Item[] };
}) {
  const [alerts, setAlerts] = useState<Item[]>(initial.alerts || []);
  const [scores, setScores] = useState<Item[]>(initial.scores || []);
  const [pl, setPl] = useState<Item[]>(initial.pl || []);

  useEffect(() => {
    let cancel = false;

    async function tick() {
      try {
        const [a, s, p] = await Promise.all([
          fetch("/api/alerts", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/score", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/market/stream?mode=daily-pl", { cache: "no-store" }).then((r) => r.json()),
        ]);
        if (!cancel) {
          if (Array.isArray(a)) setAlerts(a);
          if (Array.isArray(s)) setScores(s);
          if (Array.isArray(p)) setPl(p);
        }
      } catch {
        // ignore transient fetch errors
      }
    }

    // poll every 15s
    const t = setInterval(tick, 15000);
    return () => {
      cancel = true;
      clearInterval(t);
    };
  }, []);

  // Optional: expose for quick debugging
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.__beginnerData = { alerts, scores, pl };
  }

  // This component doesn't render UI; it just keeps data warm for future client widgets.
  return null;
}
