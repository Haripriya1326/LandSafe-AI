import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskMap from "../../components/common/RiskMap";
import RiskBadge from "../../components/common/RiskBadge";

export default function FieldRiskMapPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="GIS Field View"
        title="Risk Map"
        description="Tap a marker to check ground condition data before heading to a zone."
      />
      <RiskMap height="540px" onSelectZone={setSelected} />
      {selected && (
        <div className="glass-panel p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="text-sm font-semibold text-ink-hi">{selected.name}</p>
            <p className="text-xs text-ink-mid">{selected.district}</p>
          </div>
          <RiskBadge level={selected.risk} size="md" />
          <span className="text-sm text-ink-mid">Rainfall: <span className="data-num text-ink-hi">{selected.rainfall} mm</span></span>
          <span className="text-sm text-ink-mid">Soil Moisture: <span className="data-num text-ink-hi">{selected.soilMoisture}%</span></span>
          <span className="text-sm text-ink-mid">Road: <span className="text-ink-hi">{selected.roadStatus}</span></span>
        </div>
      )}
    </div>
  );
}
