import { Link } from "react-router-dom";
import RiskBadge from "../../components/common/RiskBadge";
import { citizenHome, alerts } from "../../data/mockData";
import { FiCloudRain, FiAlertTriangle, FiArrowRight, FiEdit3 } from "react-icons/fi";

export default function CitizenHome() {
  const nearbyAlert = alerts[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="eyebrow mb-1.5">Your Area</p>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-ink-hi">{citizenHome.area}</h1>
      </div>

      <div className="glass-panel p-6 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2">Current Risk Level</p>
            <RiskBadge level={citizenHome.risk} size="lg" pulse />
          </div>
          <FiAlertTriangle className="text-risk-high opacity-30" size={40} />
        </div>
        <p className="text-sm text-ink-hi mt-4 leading-relaxed">{citizenHome.message}</p>
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-base-line">
          <div className="flex items-center gap-2">
            <FiCloudRain className="text-signal" size={18} />
            <div>
              <p className="data-num text-lg font-semibold text-ink-hi">{citizenHome.rainfall} mm</p>
              <p className="text-[10px] text-ink-mid uppercase font-mono">Rainfall Today</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-hi">{citizenHome.roadStatus}</p>
            <p className="text-[10px] text-ink-mid uppercase font-mono">Road Status</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 border-l-4 border-risk-critical">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-ink-hi">{nearbyAlert.title}</p>
          <RiskBadge level={nearbyAlert.severity} size="sm" />
        </div>
        <p className="text-sm text-ink-mid leading-relaxed">{nearbyAlert.message}</p>
        <Link to="/citizen/alerts" className="text-xs font-medium text-signal mt-3 flex items-center gap-1.5">
          View all alerts <FiArrowRight size={12} />
        </Link>
      </div>

      <Link to="/citizen/report" className="glass-card p-5 flex items-center justify-between bg-signal/5 border-signal/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-signal/15 border border-signal/30 flex items-center justify-center">
            <FiEdit3 className="text-signal" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-hi">Seen something concerning?</p>
            <p className="text-xs text-ink-mid">Report a landslide, crack or blocked road</p>
          </div>
        </div>
        <FiArrowRight className="text-signal" size={18} />
      </Link>
    </div>
  );
}
