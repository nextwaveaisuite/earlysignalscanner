import BeginnerAutoData from "@/components/BeginnerAutoData";
// ...
export default async function BeginnerPage() {
  const [alerts, scores, pl] = await Promise.all([getAlerts(), getScoresWithTokens(), getDailyPL()]);
  return (
    <div className="space-y-8">
      <BeginnerAutoData initial={{ alerts, scores, pl }} />
      {/* rest of your sections unchanged */}
