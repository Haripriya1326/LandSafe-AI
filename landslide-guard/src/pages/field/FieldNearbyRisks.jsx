import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { riskZones } from "../../data/mockData";
import { FiEdit3 } from "react-icons/fi";

export default function FieldNearbyRisks() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Ground Coverage"
        title="Nearby Risk Zones"
        description="All zones within your assigned response radius, ranked by current risk level."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {riskZones.map((z) => (
          <div key={z.id} className="glass-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <RiskBadge level={z.risk} size="sm" pulse={z.risk === "critical"} />
              <span className="text-[10px] font-mono text-ink-mid">{z.district.split(",")[1]?.trim()}</span>
            </div>
            <h3 className="font-display font-semibold text-ink-hi">{z.name}</h3>
            <p className="text-xs text-ink-mid mt-1">{z.district}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-base-line text-xs">
              <span className="text-ink-mid">Rainfall <span className="data-num text-ink-hi block">{z.rainfall} mm</span></span>
              <span className="text-ink-mid">Soil Moisture <span className="data-num text-ink-hi block">{z.soilMoisture}%</span></span>
              <span className="text-ink-mid">Slope <span className="data-num text-ink-hi block">{z.slope}°</span></span>
              <span className="text-ink-mid">Road <span className="text-ink-hi block">{z.roadStatus}</span></span>
            </div>

            <Link
              to="/field/report"
              className="mt-4 text-xs font-medium text-signal hover:text-signal-dim flex items-center gap-1.5"
            >
              <FiEdit3 size={13} /> Report condition here
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
