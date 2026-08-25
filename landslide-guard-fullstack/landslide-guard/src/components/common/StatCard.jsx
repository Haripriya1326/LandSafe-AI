import { RISK_LEVELS } from "../../data/mockData";

export default function StatCard({ level, label, count }) {
  const cfg = RISK_LEVELS[level];
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: cfg.color }}
      />
      <div className="flex items-center justify-between mb-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-mid">{cfg.label}</span>
      </div>
      <p className="data-num text-3xl md:text-4xl font-semibold text-ink-hi">{String(count).padStart(2, "0")}</p>
      <p className="text-xs text-ink-mid mt-1">{label}</p>
    </div>
  );
}
