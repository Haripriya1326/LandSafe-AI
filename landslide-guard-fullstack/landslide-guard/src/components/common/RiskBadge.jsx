import { FiCheckCircle, FiInfo, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";
import { RISK_LEVELS } from "../../data/mockData";

// Risk is never conveyed by color alone — a shape/icon carries the same
// meaning for colorblind users and in low-light/glare outdoor conditions,
// where field officers and citizens are most likely to be reading this.
const RISK_ICONS = {
  low: FiCheckCircle,
  moderate: FiInfo,
  high: FiAlertTriangle,
  critical: FiAlertOctagon,
};

export default function RiskBadge({ level, size = "md", pulse = false }) {
  const cfg = RISK_LEVELS[level] || RISK_LEVELS.low;
  const Icon = RISK_ICONS[level] || RISK_ICONS.low;
  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };
  const iconSizes = { sm: 10, md: 12, lg: 14 };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold font-mono uppercase tracking-wide border ${sizes[size]}`}
      style={{
        color: cfg.color,
        borderColor: `${cfg.color}55`,
        backgroundColor: `${cfg.color}1A`,
      }}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {pulse && (
          <span
            className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full"
            style={{ backgroundColor: cfg.color }}
            aria-hidden="true"
          />
        )}
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: cfg.color }} />
      </span>
      <Icon size={iconSizes[size]} aria-hidden="true" />
      {cfg.label}
      {level === "critical" && <span className="sr-only">— immediate action recommended</span>}
    </span>
  );
}
