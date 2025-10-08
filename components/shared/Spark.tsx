export default function Spark({ data=[] }: { data?: number[] }) {
  return <div className="text-slate-400 text-xs">spark {data.length ? `(${data.length})` : ""}</div>;
}

