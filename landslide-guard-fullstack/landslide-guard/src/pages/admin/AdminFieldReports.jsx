import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { useFieldReports } from "../../api/hooks";
import { timeAgo } from "../../utils/timeAgo";
import { mediaUrl } from "../../api/client";
import { FiMapPin, FiClock, FiUser, FiImage } from "react-icons/fi";

const statusStyle = {
  Submitted: "text-signal border-signal/40 bg-signal/10",
  "Under Review": "text-risk-moderate border-risk-moderate/40 bg-risk-moderate/10",
  Verified: "text-risk-low border-risk-low/40 bg-risk-low/10",
};

export default function AdminFieldReports() {
  const [statusFilter, setStatusFilter] = useState("All");
  const { data: fieldReports } = useFieldReports();
  const statuses = ["All", "Submitted", "Under Review", "Verified"];
  const filtered = statusFilter === "All" ? fieldReports : fieldReports.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Ground Intelligence"
        title="Field Reports"
        description="Incidents reported by field officers and citizens across monitored zones."
        action={
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-mono px-3 py-1.5 rounded-full border transition-colors ${
                  statusFilter === s
                    ? "bg-signal/15 border-signal/50 text-signal"
                    : "border-base-line text-ink-mid hover:border-base-line2"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="glass-card p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
            {r.images?.[0] ? (
              <img
                src={mediaUrl(r.images[0])}
                alt=""
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-base-line"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg shrink-0 border border-base-line bg-base-panel2 flex items-center justify-center">
                <FiImage className="text-ink-low" size={18} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[10px] font-mono text-ink-low">{r.id}</span>
                <RiskBadge level={r.severity} size="sm" />
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-base-line text-ink-mid">
                  {r.type}
                </span>
              </div>
              <p className="text-sm font-semibold text-ink-hi">{r.title}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-ink-mid">
                <span className="flex items-center gap-1"><FiMapPin size={12} /> {r.location}</span>
                <span className="flex items-center gap-1"><FiUser size={12} /> {r.reportedBy}</span>
                <span className="flex items-center gap-1"><FiClock size={12} /> {r.time || timeAgo(r.createdAt)}</span>
              </div>
            </div>
            <span className={`shrink-0 text-[11px] font-mono uppercase px-3 py-1.5 rounded-full border ${statusStyle[r.status]}`}>
              {r.status}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-ink-mid py-10">No reports match this filter.</p>
        )}
      </div>
    </div>
  );
}
