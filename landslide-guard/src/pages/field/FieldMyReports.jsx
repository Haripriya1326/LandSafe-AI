import SectionHeader from "../../components/common/SectionHeader";
import { myFieldReports } from "../../data/mockData";
import { FiClock } from "react-icons/fi";

const statusStyle = {
  Submitted: "text-signal border-signal/40 bg-signal/10",
  "Under Review": "text-risk-moderate border-risk-moderate/40 bg-risk-moderate/10",
  Verified: "text-risk-low border-risk-low/40 bg-risk-low/10",
};

export default function FieldMyReports() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Submission History"
        title="My Reports"
        description="Track the status of incidents you've reported."
      />
      <div className="space-y-3">
        {myFieldReports.map((r) => (
          <div key={r.id} className="glass-card p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-ink-low">{r.id}</p>
              <p className="text-sm font-semibold text-ink-hi truncate">{r.title}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-ink-mid">
                <span>{r.type}</span>
                <span className="flex items-center gap-1"><FiClock size={11} /> {r.time}</span>
              </div>
            </div>
            <span className={`shrink-0 text-[11px] font-mono uppercase px-3 py-1.5 rounded-full border ${statusStyle[r.status]}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
