"use client";
import { useEffect, useState } from "react";

export default function HealthDot() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    let cancel = false;
    async function run() {
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        const j = await r.json();
        if (!cancel) { setOk(!!j.ok); setTokens(j.tokens ?? 0); }
      } catch {
        if (!cancel) setOk(false);
      }
    }
    run();
    const t = setInterval(run, 15000);
    return () => { cancel = true; clearInterval(t); };
  }, []);

  const color = ok === null ? "bg-zinc-500" : ok ? "bg-emerald-500" : "bg-red-500";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-white/70">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{ok === null ? "checking…" : ok ? `healthy • ${tokens} tokens` : "unhealthy"}</span>
    </span>
  );
}
