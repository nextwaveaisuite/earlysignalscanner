type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AlertItem = { id?: string; token?: string; symbol?: string; score?: number; risk?: RiskLevel; confidence?: number; message?: string; ts?: string; [k: string]: unknown; };
export type ScoreWithToken = { token?: string; symbol?: string; name?: string; score?: number; risk?: RiskLevel; confidence?: number; sparkline?: number[]; [k: string]: unknown; };
export type DailyPL = { date?: string; realized?: number; unrealized?: number; [k: string]: unknown; };

type NextRequestInit = RequestInit & { next?: { revalidate?: number } };

function baseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return explicit || vercel || 'http://localhost:3000';
}

const noStore: NextRequestInit = { next: { revalidate: 0 }, cache: 'no-store' };

async function fetchJSON<T=any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl()}${path}`;
  const res = await fetch(url, { ...(noStore as RequestInit), ...(init||{}) });
  if(!res.ok){ throw new Error(`Fetch ${path} failed: ${res.status}`); }
  return res.json() as Promise<T>;
}

export async function getAlerts(): Promise<AlertItem[]> {
  const data = await fetchJSON<any>('/api/alerts');
  return Array.isArray(data) ? data : data?.items ?? [];
}

export async function getTopSignals(): Promise<ScoreWithToken[]> {
  try { const d = await fetchJSON<any>('/api/score?top=10'); return (Array.isArray(d)?d:d?.items??[]) }
  catch { const d = await fetchJSON<any>('/api/score'); return (Array.isArray(d)?d:d?.items??[]) }
}

export async function getScoresWithTokens(): Promise<ScoreWithToken[]> {
  const paths = ['/api/score?withTokens=1','/api/score?expanded=1','/api/score'];
  for(const p of paths){
    try{
      const d:any = await fetchJSON<any>(p);
      const items:any[] = Array.isArray(d)?d:d?.items??[];
      return items.map((it:any)=>({
        token: it.token ?? it.address ?? it.id,
        symbol: it.symbol ?? it.ticker ?? it.sym,
        name: it.name ?? it.tokenName,
        score: typeof it.score==='number'? it.score : Number(it.score??0),
        risk: it.risk as RiskLevel,
        confidence: typeof it.confidence==='number'? it.confidence : Number(it.confidence ?? it.conf ?? 0),
        sparkline: Array.isArray(it.sparkline)? it.sparkline : it.spark ?? undefined,
        ...it,
      })) as ScoreWithToken[];
    }catch{}
  }
  return [];
}

export async function getDailyPL(): Promise<DailyPL[]> {
  try { const d = await fetchJSON<any>('/api/market/stream?mode=daily-pl'); return (Array.isArray(d)?d:d?.items??[]) }
  catch { const d = await fetchJSON<any>('/api/market/stream'); return (Array.isArray(d)?d:d?.items??[]) }
}
