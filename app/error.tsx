"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("Application error:", error); }, [error]);

  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">⚠️ Something went wrong</h1>
        <p className="text-white/70 mb-4">{error.message}</p>
        <button onClick={() => reset()} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700">
          Try again
        </button>
      </div>
    </div>
  );
}
