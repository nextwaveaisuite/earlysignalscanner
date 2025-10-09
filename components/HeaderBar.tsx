import HealthDot from "./HealthDot";

export default function HeaderBar() {
  return (
    <header className="w-full border-b border-white/10 bg-[#0b0f13]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-emerald-500/90" />
          <span className="text-white font-semibold tracking-wide">SignalRadar</span>
          <span className="ml-3 text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
            Beginner Mode
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/" className="text-white/70 hover:text-white text-sm">Home</a>
          <a href="/beginner" className="text-white/70 hover:text-white text-sm">/beginner</a>
          <HealthDot />
        </nav>
      </div>
    </header>
  );
}

