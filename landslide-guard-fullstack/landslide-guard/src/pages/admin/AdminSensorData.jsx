import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import MiniTrendChart from "../../components/common/MiniTrendChart";
import { useSensorCards, useRiskZones } from "../../api/hooks";
import { sensorsApi } from "../../api/client";
import { FiCloudRain, FiDroplet, FiThermometer, FiTrendingDown, FiRefreshCw } from "react-icons/fi";

const icons = { rainfall: FiCloudRain, soil: FiDroplet, temperature: FiThermometer, slope: FiTrendingDown };
const statusColor = { normal: "#22C55E", high: "#F97316", critical: "#EF4444" };

export default function AdminSensorData() {
  const { data: sensorCards, isLive, loading } = useSensorCards();
  const { data: riskZones } = useRiskZones();
  const [simulating, setSimulating] = useState(false);

  // No physical sensor hardware exists for this prototype — the backend
  // runs a background simulation (random-walk rainfall/soil-moisture/
  // temperature/slope) every minute, and this button lets you force an
  // extra tick on demand for a live demo.
  async function handleSimulateNow() {
    setSimulating(true);
    try {
      await sensorsApi.simulate();
    } catch {
      // Swallow — the next poll will just keep showing the last good data.
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Ground Sensor Network"
        title="Sensor Data"
        description="Simulated readings standing in for field sensor clusters across active zones, refreshed automatically every 30s."
        action={
          <button
            onClick={handleSimulateNow}
            disabled={simulating}
            className="flex items-center gap-2 text-[11px] font-mono uppercase px-3 py-2 rounded-lg border border-base-line bg-base-panel2 text-ink-mid hover:text-ink-hi hover:border-signal/40 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={13} className={simulating ? "animate-spin" : ""} />
            {simulating ? "Simulating…" : "Simulate Reading"}
          </button>
        }
      />

      <p className="text-[10px] font-mono text-ink-mid -mt-4">
        {loading ? "Fetching…" : isLive ? "● Live · Simulated sensor feed" : "○ Demo data (backend unreachable)"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sensorCards.map((s) => {
          const Icon = icons[s.key];
          return (
            <div key={s.key} className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-signal/10 border border-signal/25 flex items-center justify-center">
                  <Icon className="text-signal" size={17} />
                </div>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: statusColor[s.status],
                    borderColor: `${statusColor[s.status]}55`,
                    backgroundColor: `${statusColor[s.status]}1A`,
                  }}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-ink-mid">{s.label}</p>
              <p className="data-num text-3xl font-semibold text-ink-hi mt-1">
                {s.value}
                <span className="text-sm text-ink-mid font-normal ml-1">{s.unit}</span>
              </p>
              <div className="mt-2 -mx-1">
                <MiniTrendChart data={s.trend} dataKey={s.dataKey} color={statusColor[s.status]} />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <SectionHeader eyebrow="By Zone" title="Zone-Wise Sensor Snapshot" />
        <div className="glass-panel overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] font-mono uppercase text-ink-mid border-b border-base-line">
                <th className="py-3 px-4 font-medium">Zone</th>
                <th className="py-3 px-4 font-medium">Rainfall</th>
                <th className="py-3 px-4 font-medium">Soil Moisture</th>
                <th className="py-3 px-4 font-medium">Slope</th>
                <th className="py-3 px-4 font-medium">Road Status</th>
              </tr>
            </thead>
            <tbody>
              {riskZones.map((z) => (
                <tr key={z.id} className="border-b border-base-line/60 last:border-0 hover:bg-base-panel2/50">
                  <td className="py-3 px-4 text-ink-hi font-medium">{z.name}</td>
                  <td className="py-3 px-4 data-num text-ink-mid">{z.rainfall} mm</td>
                  <td className="py-3 px-4 data-num text-ink-mid">{z.soilMoisture}%</td>
                  <td className="py-3 px-4 data-num text-ink-mid">{z.slope}°</td>
                  <td className="py-3 px-4 text-ink-mid">{z.roadStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
