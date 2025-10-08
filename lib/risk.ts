export function classify(score: number): "LOW"|"MEDIUM"|"HIGH"{
  if(score >= 70) return "LOW";
  if(score >= 40) return "MEDIUM";
  return "HIGH";
}
