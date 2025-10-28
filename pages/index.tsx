import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function Home() {
  const { data } = useSWR("/api/health", fetcher);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>SignalRadar</h1>
      <p>Status: {data?.ok ? "OK" : "…loading"}</p>
      <p><a href="/api/alerts">View Alerts</a></p>
    </main>
  );
}
