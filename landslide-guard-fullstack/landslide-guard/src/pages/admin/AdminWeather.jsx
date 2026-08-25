import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SectionHeader from "../../components/common/SectionHeader";
import { useRiskZones, useWeather, useSatellite } from "../../api/hooks";
import { FiCloudRain, FiThermometer, FiWind, FiEye, FiAlertTriangle, FiGlobe, FiExternalLink, FiLayers } from "react-icons/fi";

function barColor(mm) {
  if (mm >= 130) return "#EF4444";
  if (mm >= 90) return "#F97316";
  if (mm >= 50) return "#EAB308";
  return "#22C55E";
}

export default function AdminWeather() {
  const { data: riskZones } = useRiskZones();
  const [zoneId, setZoneId] = useState("zone-a");
  const [showPrecip, setShowPrecip] = useState(false);

  const { data: weather, isLive: weatherLive, loading: weatherLoading } = useWeather(zoneId);
  const { data: satellite, isLive: satelliteLive, loading: satelliteLoading } = useSatellite(zoneId);

  const selectedZone = riskZones.find((z) => z.id === zoneId);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Meteorological Feed"
        title="Weather Forecast"
        description="Live 5-day rainfall outlook (Open-Meteo) and NASA satellite imagery for the selected zone."
        action={
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="bg-base-panel2 border border-base-line rounded-lg px-3 py-2 text-sm text-ink-hi outline-none focus:border-signal/60"
          >
            {riskZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SnapshotCard icon={FiCloudRain} label="Condition" value={weather.snapshot.condition} />
        <SnapshotCard icon={FiThermometer} label="Temperature" value={`${weather.snapshot.temp}°C`} />
        <SnapshotCard icon={FiWind} label="Wind Speed" value={`${weather.snapshot.wind} km/h`} />
        <SnapshotCard icon={FiEye} label="Visibility" value={weather.snapshot.visibility} />
      </div>

      <div className="glass-panel p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-mono text-ink-mid uppercase tracking-wide">Rainfall Forecast (mm)</p>
          <p className="text-[10px] font-mono text-ink-mid">
            {weatherLoading ? "Fetching…" : weatherLive ? "● Live · Open-Meteo" : "○ Demo data (backend unreachable)"}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weather.rainfallForecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3358" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#9FB2D4", fontSize: 12 }} axisLine={{ stroke: "#1E3358" }} tickLine={false} />
            <YAxis tick={{ fill: "#9FB2D4", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0E1830", border: "1px solid #25406E", borderRadius: 10, fontSize: 13 }}
              labelStyle={{ color: "#EAF0FA" }}
              cursor={{ fill: "rgba(45,212,232,0.06)" }}
            />
            <Bar dataKey="mm" radius={[6, 6, 0, 0]}>
              {weather.rainfallForecast.map((d, i) => (
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

      <div className="glass-panel p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FiGlobe className="text-signal" size={16} />
            <p className="text-[11px] font-mono text-ink-mid uppercase tracking-wide">
              NASA Satellite Imagery {selectedZone ? `— ${selectedZone.name}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrecip((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase px-2.5 py-1.5 rounded-lg border border-base-line bg-base-panel2 text-ink-mid hover:text-ink-hi hover:border-signal/40 transition-colors"
            >
              <FiLayers size={13} />
              {showPrecip ? "Precipitation Overlay" : "True Color"}
            </button>
            {satellite?.worldviewUrl && (
              <a
                href={satellite.worldviewUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase px-2.5 py-1.5 rounded-lg border border-signal/30 bg-signal/10 text-signal hover:bg-signal/15 transition-colors"
              >
                Open in Worldview <FiExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {satelliteLoading ? (
          <div className="h-64 flex items-center justify-center text-sm text-ink-mid">Loading satellite imagery…</div>
        ) : satelliteLive && satellite ? (
          <div>
            <div className="rounded-xl overflow-hidden border border-base-line bg-base-panel2">
              <img
                src={showPrecip ? satellite.precipitationOverlayUrl : satellite.trueColorUrl}
                alt={`NASA satellite view of ${selectedZone?.name || "selected zone"}`}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
            <p className="text-[11px] text-ink-mid mt-2 font-mono">
              MODIS Terra Corrected Reflectance{showPrecip ? " + IMERG Precipitation Rate" : ""} · Imagery date {satellite.date} ·
              via NASA GIBS
            </p>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-ink-mid text-center px-6">
            Satellite imagery unavailable right now — the backend proxy to NASA GIBS/Worldview may be unreachable.
          </div>
        )}
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
