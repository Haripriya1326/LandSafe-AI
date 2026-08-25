import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import RiskMap from "../../components/common/RiskMap";
import RiskBadge from "../../components/common/RiskBadge";
import { riskOverview, alerts, riskZones } from "../../data/mockData";

export default function AdminDashboard() {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1.5">Regional Overview</p>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-ink-hi">Risk Command Dashboard</h1>
        <p className="text-sm text-ink-mid mt-1">
          Live overview of monitored zones across the North Eastern Region.
        </p>
      </div>

      {/* A. Risk overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {riskOverview.map((r) => (
          <StatCard key={r.level} level={r.level} label={r.label} count={r.count} />
        ))}
      </div>

      {/* B. GIS Risk Map + selected zone panel */}
      <div>
        <SectionHeader
          eyebrow="Live GIS Feed"
          title="Regional Risk Map"
          description="Click any marker to inspect live rainfall, soil moisture, slope and road status."
          action={
            <Link to="/admin/risk-map" className="btn-ghost !py-2 !px-4 text-xs flex items-center gap-1.5">
              Full Map <FiArrowRight size={13} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <RiskMap height="420px" onSelectZone={setSelectedZone} />
          <div className="glass-panel p-5 flex flex-col">
            {selectedZone ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin className="text-signal" size={15} />
                  <span className="text-[11px] font-mono text-ink-mid uppercase tracking-wide">Selected Zone</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink-hi">{selectedZone.name}</h3>
                <p className="text-xs text-ink-mid mb-3">{selectedZone.district}</p>
                <RiskBadge level={selectedZone.risk} size="md" pulse />
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-line text-sm">
                  <Metric label="Rainfall" value={`${selectedZone.rainfall} mm`} />
                  <Metric label="Soil Moisture" value={`${selectedZone.soilMoisture}%`} />
                  <Metric label="Slope" value={`${selectedZone.slope}°`} />
                  <Metric label="Road Status" value={selectedZone.roadStatus} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <FiMapPin className="text-ink-low mb-2" size={26} />
                <p className="text-sm text-ink-mid">Select a marker on the map to view zone details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick links grid */}
      <div>
        <SectionHeader eyebrow="Quick Access" title="Monitoring Modules" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: "/admin/sensors", label: "Sensor Data", desc: "Rainfall, soil, slope" },
            { to: "/admin/ai-prediction", label: "AI Prediction", desc: "Run risk analysis" },
            { to: "/admin/field-reports", label: "Field Reports", desc: `${4} active reports` },
            { to: "/admin/response-priority", label: "Response Priority", desc: "Coordinate response" },
          ].map((m) => (
            <Link key={m.to} to={m.to} className="glass-card p-4 group">
              <p className="text-sm font-semibold text-ink-hi group-hover:text-signal transition-colors">{m.label}</p>
              <p className="text-xs text-ink-mid mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent alerts */}
      <div>
        <SectionHeader
          eyebrow="Attention Required"
          title="Recent Alerts"
          action={
            <Link to="/admin/alerts" className="btn-ghost !py-2 !px-4 text-xs flex items-center gap-1.5">
              Alert Center <FiArrowRight size={13} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 2).map((a) => (
            <div key={a.id} className="glass-card p-4 border-l-4" style={{ borderLeftColor: severityColor(a.severity) }}>
              <div className="flex items-center justify-between mb-1.5">
                <RiskBadge level={a.severity} size="sm" />
                <span className="text-[10px] font-mono text-ink-mid">{a.time}</span>
              </div>
              <p className="text-sm font-semibold text-ink-hi">{a.title}</p>
              <p className="text-xs text-ink-mid mt-1">{a.zone}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-ink-low pt-2">
        Showing {riskZones.length} of 85 monitored zones · Mock data for demonstration purposes
      </p>
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

function severityColor(level) {
  return { low: "#22C55E", moderate: "#EAB308", high: "#F97316", critical: "#EF4444" }[level];
}
