// helper inside the file (above the component or near the P/L section)
function fmtUSD(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ... inside the Daily P/L section mapping:
<div className="space-y-2">
  {pl?.length ? (
    pl.map((row: any) => {
      const r = Number(row.realized ?? 0);
      const u = Number(row.unrealized ?? 0);
      const rCls = r >= 0 ? "text-emerald-400" : "text-red-400";
      const uCls = u >= 0 ? "text-emerald-300" : "text-red-300";
      return (
        <div key={row.date} className="flex items-center justify-between border-b border-white/5 py-2">
          <div>{row.date ? new Date(row.date).toISOString().slice(0, 10) : ""}</div>
          <div className="text-white/80 flex items-center gap-4">
            <span className={rCls}>Realized: {fmtUSD(r)}</span>
            <span className={uCls}>Unrealized: {fmtUSD(u)}</span>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-white/50">No P/L yet.</div>
  )}
</div>
