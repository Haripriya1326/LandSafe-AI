import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { alerts } from "../../data/mockData";
import { FiBell, FiMapPin, FiClock } from "react-icons/fi";

export default function AdminAlerts() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Alert Center"
        title="Active Warnings"
        description="System-generated and manually issued alerts across the monitored region, sorted by recency."
      />

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="glass-card p-5 border-l-4"
            style={{ borderLeftColor: sevColor(a.severity) }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${sevColor(a.severity)}1A`, border: `1px solid ${sevColor(a.severity)}40` }}
                >
                  <FiBell style={{ color: sevColor(a.severity) }} size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-ink-hi">{a.title}</p>
                    <RiskBadge level={a.severity} size="sm" />
                  </div>
                  <p className="text-xs text-ink-mid mt-1 flex items-center gap-1"><FiMapPin size={11} /> {a.zone}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-ink-mid flex items-center gap-1 shrink-0">
                <FiClock size={11} /> {a.time}
              </span>
            </div>
            <p className="text-sm text-ink-mid mt-3 leading-relaxed">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function sevColor(level) {
  return { low: "#22C55E", moderate: "#EAB308", high: "#F97316", critical: "#EF4444" }[level];
}
