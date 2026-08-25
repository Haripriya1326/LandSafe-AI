import SectionHeader from "../../components/common/SectionHeader";
import { safeZones } from "../../data/mockData";
import { FiShield, FiUsers, FiNavigation } from "react-icons/fi";

const statusStyle = {
  Available: "text-risk-low border-risk-low/40 bg-risk-low/10",
  "Filling Up": "text-risk-moderate border-risk-moderate/40 bg-risk-moderate/10",
  Full: "text-risk-critical border-risk-critical/40 bg-risk-critical/10",
};

export default function CitizenSafeZones() {
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader
        eyebrow="If You Need To Evacuate"
        title="Nearest Safe Zones"
        description="Designated relief points near your location."
      />
      <div className="space-y-3">
        {safeZones.map((s) => (
          <div key={s.name} className="glass-card p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-risk-low/10 border border-risk-low/30 flex items-center justify-center shrink-0">
              <FiShield className="text-risk-low" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-ink-hi">{s.name}</p>
                <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${statusStyle[s.status]}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-ink-mid">
                <span className="flex items-center gap-1"><FiNavigation size={12} /> {s.distance} away</span>
                <span className="flex items-center gap-1"><FiUsers size={12} /> Capacity: {s.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
