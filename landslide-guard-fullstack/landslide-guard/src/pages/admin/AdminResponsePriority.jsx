import { useEffect, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { useToast } from "../../components/common/ToastContext";
import { useResponsePriorities } from "../../api/hooks";
import { FiUsers, FiEye, FiUserCheck, FiCheckCircle, FiCloudRain, FiDroplet } from "react-icons/fi";

const priorityStyle = {
  IMMEDIATE: "text-risk-critical border-risk-critical/40 bg-risk-critical/10",
  HIGH: "text-risk-high border-risk-high/40 bg-risk-high/10",
  MONITOR: "text-signal border-signal/40 bg-signal/10",
};

// Field officer roster on duty for this shift. In production this would
// come from a real roster/on-call API — for the prototype we rotate
// through a fixed pool of officer names so "Assign Response" has a
// concrete person attached to it instead of just flipping a boolean.
const ON_DUTY_OFFICERS = [
  "R. Lyngdoh",
  "T. Sangma",
  "K. Basumatary",
  "P. Marak",
  "D. Nongrum",
  "S. Zeliang",
];

function nextAvailableOfficer(items) {
  const busy = new Set(items.filter((i) => i.assigned && i.officer).map((i) => i.officer));
  return ON_DUTY_OFFICERS.find((o) => !busy.has(o)) || ON_DUTY_OFFICERS[0];
}

export default function AdminResponsePriority() {
  const { data: responsePriorities, isLive, loading } = useResponsePriorities();
  const [items, setItems] = useState([]);
  const { showToast } = useToast();

  // Sync local assign/resolve UI state whenever live priorities load/refresh.
  useEffect(() => {
    setItems((prev) =>
      responsePriorities.map((r) => {
        const existing = prev.find((p) => p.id === r.id);
        return {
          ...r,
          assigned: existing?.assigned ?? false,
          resolved: existing?.resolved ?? false,
          officer: existing?.officer ?? null,
        };
      })
    );
  }, [responsePriorities]);

  function assign(id) {
    setItems((prev) => {
      const officer = nextAvailableOfficer(prev);
      showToast(`${officer} assigned to respond.`, "info");
      return prev.map((i) => (i.id === id ? { ...i, assigned: true, officer } : i));
    });
  }

  function resolve(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, resolved: true } : i)));
    showToast("Zone marked as resolved.", "success");
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Emergency Coordination"
        title="Response Priority"
        description="Zones ranked by urgency, scored from live risk level, road status and the simulated sensor feed."
      />

      <p className="text-[10px] font-mono text-ink-mid -mt-4">
        {loading ? "Fetching…" : isLive ? "● Live · Ranked from simulated sensor feed" : "○ Demo data (backend unreachable)"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((r) => (
          <div key={r.id} className="glass-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level={r.risk} size="sm" />
              <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${priorityStyle[r.priority]}`}>
                {r.priority}
              </span>
            </div>
            <h3 className="font-display font-semibold text-ink-hi">{r.zone}</h3>
            <p className="text-xs text-ink-mid mt-2 flex items-center gap-1.5">
              <FiUsers size={12} /> {r.affected} people affected
            </p>
            {r.rainfall != null && r.soilMoisture != null && (
              <p className="text-xs text-ink-mid mt-1.5 flex items-center gap-3">
                <span className="flex items-center gap-1"><FiCloudRain size={12} /> {r.rainfall} mm</span>
                <span className="flex items-center gap-1"><FiDroplet size={12} /> {r.soilMoisture}% soil</span>
              </p>
            )}
            <p className="text-sm text-ink-mid mt-2 flex-1">{r.note}</p>

            <div className="mt-4 pt-4 border-t border-base-line flex flex-wrap gap-2">
              <button className="btn-ghost !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                <FiEye size={13} /> View Details
              </button>
              {!r.resolved && (
                <button
                  onClick={() => assign(r.id)}
                  disabled={r.assigned}
                  className={`text-xs !py-1.5 !px-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                    r.assigned
                      ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
                      : "btn-primary"
                  }`}
                >
                  <FiUserCheck size={13} /> {r.assigned ? `Assigned · ${r.officer}` : "Assign Response"}
                </button>
              )}
              {!r.resolved && (
                <button
                  onClick={() => resolve(r.id)}
                  className="text-xs !py-1.5 !px-3 rounded-lg border border-risk-low/40 text-risk-low hover:bg-risk-low/10 flex items-center gap-1.5 transition-colors"
                >
                  <FiCheckCircle size={13} /> Mark Resolved
                </button>
              )}
              {r.resolved && (
                <span className="text-xs !py-1.5 !px-3 rounded-lg border border-risk-low/40 text-risk-low bg-risk-low/10 flex items-center gap-1.5">
                  <FiCheckCircle size={13} /> Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
