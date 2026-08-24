import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { useToast } from "../../components/common/ToastContext";
import { responsePriorities } from "../../data/mockData";
import { FiUsers, FiEye, FiUserCheck, FiCheckCircle } from "react-icons/fi";

const priorityStyle = {
  IMMEDIATE: "text-risk-critical border-risk-critical/40 bg-risk-critical/10",
  HIGH: "text-risk-high border-risk-high/40 bg-risk-high/10",
  MONITOR: "text-signal border-signal/40 bg-signal/10",
};

export default function AdminResponsePriority() {
  const [items, setItems] = useState(
    responsePriorities.map((r) => ({ ...r, assigned: false, resolved: false }))
  );
  const { showToast } = useToast();

  function assign(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, assigned: true } : i)));
    showToast("Response team assigned to zone.", "info");
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
        description="Zones ranked by urgency for emergency response deployment."
      />

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
                  <FiUserCheck size={13} /> {r.assigned ? "Assigned" : "Assign Response"}
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
