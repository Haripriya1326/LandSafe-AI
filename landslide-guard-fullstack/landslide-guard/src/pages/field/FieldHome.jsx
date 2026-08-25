import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { nearbyRisksForField, weatherSnapshot, alerts, riskZones } from "../../data/mockData";
import { FiCloudRain, FiEdit3, FiArrowRight, FiMapPin } from "react-icons/fi";

export default function FieldHome() {
  const activeAlert = alerts[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1.5">Field Unit 4 &middot; East Khasi Hills Sector</p>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-ink-hi">Good morning, Officer.</h1>
        <p className="text-sm text-ink-mid mt-1">Here's the ground situation for your assigned sector today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <FiCloudRain className="text-signal" size={16} />
            <span className="text-[11px] font-mono uppercase text-ink-mid tracking-wide">Current Weather</span>
          </div>
          <p className="text-lg font-semibold text-ink-hi">{weatherSnapshot.condition}</p>
          <div className="flex gap-6 mt-3 text-sm text-ink-mid">
            <span>Temp: <span className="data-num text-ink-hi">{weatherSnapshot.temp}°C</span></span>
            <span>Humidity: <span className="data-num text-ink-hi">{weatherSnapshot.humidity}%</span></span>
            <span>Wind: <span className="data-num text-ink-hi">{weatherSnapshot.wind} km/h</span></span>
          </div>
        </div>
        <Link to="/field/report" className="glass-card p-5 flex flex-col justify-between bg-signal/5 border-signal/30">
          <FiEdit3 className="text-signal" size={20} />
          <div>
            <p className="text-sm font-semibold text-ink-hi mt-3">Report an Issue</p>
            <p className="text-xs text-ink-mid mt-1 flex items-center gap-1">
              Open form <FiArrowRight size={11} />
            </p>
          </div>
        </Link>
      </div>

      <div>
        <SectionHeader
          eyebrow="Assigned Coverage"
          title="Nearby Risk Zones"
          action={
            <Link to="/field/nearby-risks" className="btn-ghost !py-2 !px-4 text-xs flex items-center gap-1.5">
              View All <FiArrowRight size={13} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nearbyRisksForField.map((z) => (
            <div key={z.zone} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <RiskBadge level={z.risk} size="sm" />
                <span className="text-[10px] font-mono text-ink-mid">{z.distance}</span>
              </div>
              <p className="text-sm font-medium text-ink-hi">{z.zone}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Active Alert" title="Current Warning in Your Sector" />
        <div className="glass-card p-5 border-l-4 border-risk-critical">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <p className="text-sm font-semibold text-ink-hi">{activeAlert.title}</p>
            <RiskBadge level={activeAlert.severity} size="sm" />
          </div>
          <p className="text-xs text-ink-mid flex items-center gap-1 mb-2"><FiMapPin size={11} /> {activeAlert.zone}</p>
          <p className="text-sm text-ink-mid leading-relaxed">{activeAlert.message}</p>
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Road Status" title="Access Routes" />
        <div className="glass-panel divide-y divide-base-line">
          {riskZones.slice(0, 4).map((z) => (
            <div key={z.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-ink-hi">{z.name}</span>
              <span className="text-xs font-mono text-ink-mid">{z.roadStatus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
