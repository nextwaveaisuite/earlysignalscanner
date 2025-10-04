// lib/serverData.ts
import { supa } from '@/lib/db';

type TokenRow = {
  prob_up_4h: number;
  composite_score: number;
  risk_level: string;
  confidence: number;
  explain: string | null;
  token_id: number;
  tokens: { symbol: string; name: string; chain: string } | null;
};

export async function getScoresWithTokens(): Promise<TokenRow[]> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const { data, error } = await supa
      .from('scores_daily')
      .select(
        "prob_up_4h, composite_score, risk_level, confidence, explain, token_id, tokens:scores_daily_token_id_fkey(symbol,name,chain)"
      )
      .eq('dt', today)
      .order('composite_score', { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data as unknown as TokenRow[];
  } catch (e) {
    console.error('getScoresWithTokens error', e);
    return [];
  }
}
