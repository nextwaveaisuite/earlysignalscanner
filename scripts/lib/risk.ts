export type Side = 'BUY'|'SELL';

export type RiskParams = {
  balance: number;
  maxRiskPct: number;
  slPct: number;
  tpRR: number;
};

export function planTrade({entry, side, params}:{entry:number; side:Side; params:RiskParams}){
  const { balance, maxRiskPct, slPct, tpRR } = params;
  const riskAmt = balance * maxRiskPct;
  const slDist = entry * slPct;
  const qty = Math.max(0, riskAmt / slDist);
  const sl = side==='BUY' ? entry * (1 - slPct) : entry * (1 + slPct);
  const tpDist = slDist * tpRR;
  const tp = side==='BUY' ? entry + tpDist : entry - tpDist;
  return { qty, sl, tp };
}

export const DEFAULT_RISK: RiskParams = {
  balance: 10000,
  maxRiskPct: 0.01,
  slPct: 0.03,
  tpRR: 2.0
};

export function withOverrides(base: RiskParams, o?: Partial<RiskParams>): RiskParams {
  return {
    balance: o?.balance ?? base.balance,
    maxRiskPct: o?.maxRiskPct ?? base.maxRiskPct,
    slPct: o?.slPct ?? base.slPct,
    tpRR: o?.tpRR ?? base.tpRR,
  };
}
