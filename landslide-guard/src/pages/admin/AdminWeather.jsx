import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SectionHeader from "../../components/common/SectionHeader";
import { rainfallForecast, weatherSnapshot } from "../../data/mockData";
import { FiCloudRain, FiThermometer, FiWind, FiEye, FiAlertTriangle } from "react-icons/fi";

function barColor(mm) {
  if (mm >= 130) return "#EF4444";
  if (mm >= 90) return "#F97316";
  if (mm >= 50) return "#EAB308";
  return "#22C55E";
}

export default function AdminWeather() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Meteorological Feed"
        title="Weather Forecast"
        description="5-day rainfall outlook and current conditions across monitored districts."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SnapshotCard icon={FiCloudRain} label="Condition" value={weatherSnapshot.condition} />
        <SnapshotCard icon={FiThermometer} label="Temperature" value={`${weatherSnapshot.temp}°C`} />
        <SnapshotCard icon={FiWind} label="Wind Speed" value={`${weatherSnapshot.wind} km/h`} />
        <SnapshotCard icon={FiEye} label="Visibility" value={weatherSnapshot.visibility} />
      </div>

      <div className="glass-panel p-5 md:p-6">
        <p className="text-[11px] font-mono text-ink-mid uppercase tracking-wide mb-4">Rainfall Forecast (mm)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rainfallForecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3358" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#9FB2D4", fontSize: 12 }} axisLine={{ stroke: "#1E3358" }} tickLine={false} />
            <YAxis tick={{ fill: "#9FB2D4", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0E1830", border: "1px solid #25406E", borderRadius: 10, fontSize: 13 }}
              labelStyle={{ color: "#EAF0FA" }}
              cursor={{ fill: "rgba(45,212,232,0.06)" }}
            />
            <Bar dataKey="mm" radius={[6, 6, 0, 0]}>
              {rainfallForecast.map((d, i) => (
                <Cell key={i} fill={barColor(d.mm)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-5 flex items-start gap-3 bg-risk-high/10 border border-risk-high/30 rounded-xl p-4">
          <FiAlertTriangle className="text-risk-high shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-ink-hi">
            Increasing rainfall may increase landslide risk. Zones with existing high soil moisture should be
            monitored closely over the next 72 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

function SnapshotCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-signal/10 border border-signal/25 flex items-center justify-center shrink-0">
        <Icon className="text-signal" size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono text-ink-mid uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-ink-hi truncate">{value}</p>
      </div>
    </div>
  );
}
