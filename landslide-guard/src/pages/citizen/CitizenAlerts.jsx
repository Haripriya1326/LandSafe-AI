import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { alerts } from "../../data/mockData";
import { FiBell, FiClock } from "react-icons/fi";

export default function CitizenAlerts() {
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader
        eyebrow="Stay Informed"
        title="Alerts"
        description="Official warnings issued for your area and nearby zones."
      />
      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="glass-card p-5 border-l-4" style={{ borderLeftColor: sevColor(a.severity) }}>
            <div className="flex items-center gap-2 mb-2">
              <FiBell style={{ color: sevColor(a.severity) }} size={15} />
              <p className="text-sm font-semibold text-ink-hi">{a.title}</p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <RiskBadge level={a.severity} size="sm" />
              <span className="text-[11px] font-mono text-ink-mid flex items-center gap-1"><FiClock size={10} /> {a.time}</span>
            </div>
            <p className="text-sm text-ink-mid leading-relaxed">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function sevColor(level) {
  return { low: "#22C55E", moderate: "#EAB308", high: "#F97316", critical: "#EF4444" }[level];
}
