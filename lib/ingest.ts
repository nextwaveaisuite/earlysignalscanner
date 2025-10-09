// lib/ingest.ts
import { supabaseService as db } from "@/lib/db";

// naive “signal” scorer (you can evolve later)
export function simpleScore(text: string, title?: string) {
  const t = `${title ?? ""} ${text}`.toLowerCase();
  let s = 0;
  if (t.includes("accumulation") || t.includes("smart money")) s += 30;
  if (t.includes("partnership") || t.includes("listing")) s += 20;
  if (t.includes("pump") || t.includes("moon")) s -= 10; // spammy
  if (t.includes("exploit") || t.includes("hack")) s -= 30;
  return Math.max(0, Math.min(100, s));
}

export async function upsertAlertFromSocial(opts: {
  symbol?: string;
  message: string;
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
}) {
  const { error } = await db.from("alerts").insert({
    symbol: opts.symbol ?? null,
    message: opts.message,
    score: opts.score,
    risk: opts.risk,
    confidence: opts.confidence,
  });
  if (error) console.error("upsertAlertFromSocial error:", error.message);
}

export function riskFromScore(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score >= 70) return "LOW";
  if (score >= 40) return "MEDIUM";
  return "HIGH";
}
