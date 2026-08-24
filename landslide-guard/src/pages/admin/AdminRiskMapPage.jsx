import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskMap from "../../components/common/RiskMap";
import RiskBadge from "../../components/common/RiskBadge";
import { riskZones } from "../../data/mockData";

export default function AdminRiskMapPage() {
  const [selected, setSelected] = useState(riskZones[0]);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? riskZones : riskZones.filter((z) => z.risk === filter);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="GIS Risk Mapping"
        title="Regional Risk Map"
        description="Interactive terrain risk map of the North Eastern Region with live sensor-linked zone markers."
        action={
          <div className="flex flex-wrap gap-1.5">
            {["all", "low", "moderate", "high", "critical"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] font-mono uppercase px-3 py-1.5 rounded-full border transition-colors ${
                  filter === f
                    ? "bg-signal/15 border-signal/50 text-signal"
                    : "border-base-line text-ink-mid hover:border-base-line2"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        <RiskMap height="560px" zones={filtered} onSelectZone={setSelected} />

        <div className="glass-panel p-5 flex flex-col max-h-[560px]">
          <p className="text-[11px] font-mono text-ink-mid uppercase tracking-wide mb-3">
            Zones ({filtered.length})
          </p>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {filtered.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelected(z)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  selected?.id === z.id
                    ? "border-signal/50 bg-signal/5"
                    : "border-base-line hover:border-base-line2"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink-hi truncate">{z.name}</p>
                  <RiskBadge level={z.risk} size="sm" />
                </div>
                <p className="text-[11px] text-ink-mid mt-1">{z.district}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-4 pt-4 border-t border-base-line grid grid-cols-2 gap-3 text-sm">
              <Metric label="Rainfall" value={`${selected.rainfall} mm`} />
              <Metric label="Soil Moisture" value={`${selected.soilMoisture}%`} />
              <Metric label="Slope" value={`${selected.slope}°`} />
              <Metric label="Road" value={selected.roadStatus} />
              <Metric label="Population at Risk" value={selected.population} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-mono text-ink-mid uppercase tracking-wide">{label}</p>
      <p className="data-num text-ink-hi font-medium mt-0.5">{value}</p>
    </div>
  );
}
