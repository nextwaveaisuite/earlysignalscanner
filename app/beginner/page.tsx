import TopSignalFilters from "@/components/TopSignalFilters";
// ...
<section className="card p-4">
  <h2 className="font-semibold mb-1">Top Signals</h2>
  <p className="text-white/60 mb-3">Score • Risk • Confidence • Momentum</p>
  <TopSignalFilters items={scores}>
    {(filtered) => (
      <div className="grid md:grid-cols-2 gap-3">
        {filtered?.length ? filtered.map((s:any) => (
          // ... your existing row render ...
          <div key={s.token_id} className="flex items-center justify-between border-b border-white/5 py-3">
            {/* unchanged content */}
          </div>
        )) : <div className="text-white/50">No signals after filters.</div>}
      </div>
    )}
  </TopSignalFilters>
</section>
