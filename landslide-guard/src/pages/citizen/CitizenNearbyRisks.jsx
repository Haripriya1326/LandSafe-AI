import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { citizenNearbyRisks } from "../../data/mockData";
import { FiMapPin } from "react-icons/fi";

export default function CitizenNearbyRisks() {
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader
        eyebrow="Around You"
        title="Nearby Risks"
        description="Risk levels for locations closest to you."
      />
      <div className="space-y-3">
        {citizenNearbyRisks.map((z) => (
          <div key={z.zone} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-base-panel2 flex items-center justify-center shrink-0">
                <FiMapPin className="text-ink-mid" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-hi">{z.zone}</p>
                <p className="text-xs text-ink-mid">{z.distance}</p>
              </div>
            </div>
            <RiskBadge level={z.risk} size="sm" pulse={z.risk === "high" || z.risk === "critical"} />
          </div>
        ))}
      </div>
    </div>
  );
}
