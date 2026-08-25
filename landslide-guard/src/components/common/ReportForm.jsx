import { useRef, useState } from "react";
import { FiUploadCloud, FiMapPin, FiCheckCircle, FiX, FiCrosshair, FiAlertTriangle } from "react-icons/fi";
import { incidentTypes } from "../../data/mockData";
import { useToast } from "./ToastContext";

const severities = ["Low", "Moderate", "High", "Critical"];

export default function ReportForm({ successMessage = "Report submitted successfully.", onSubmitted }) {
  const [incidentType, setIncidentType] = useState(incidentTypes[0]);
  const [severity, setSeverity] = useState("Moderate");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  function handleFiles(list) {
    const arr = Array.from(list).map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }));
    setFiles((prev) => [...prev, ...arr]);
  }

  function useCurrentLocation() {
    setLocating(true);
    setTimeout(() => {
      setLocation("25.2669° N, 91.7320° E — Sohra Ridge, East Khasi Hills");
      setLocating(false);
    }, 1100);
  }

  function submit(e) {
    e.preventDefault();
    // A report with no description and no captured location gives response
    // teams almost nothing to act on — worth one extra step to catch that
    // before it's treated as "logged and notified."
    if (!description.trim() && !location) {
      setError("Add a description or capture a location so responders have something to act on.");
      return;
    }
    setError("");
    setSubmitted(true);
    showToast(successMessage, "success");
    if (onSubmitted) onSubmitted();
  }

  function reset() {
    setSubmitted(false);
    setError("");
    setIncidentType(incidentTypes[0]);
    setSeverity("Moderate");
    setDescription("");
    setFiles([]);
    setLocation("");
  }

  if (submitted) {
    return (
      <div className="glass-panel p-8 md:p-10 flex flex-col items-center text-center animate-fade-up">
        <div className="w-14 h-14 rounded-full bg-risk-low/10 border border-risk-low/40 flex items-center justify-center mb-4">
          <FiCheckCircle className="text-risk-low" size={28} />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink-hi">{successMessage}</h3>
        <p className="text-sm text-ink-mid mt-2 max-w-sm">
          Your report has been logged with reference ID{" "}
          <span className="text-signal font-mono">#RPT-{Math.floor(1000 + Math.random() * 9000)}</span>. Response
          teams have been notified.
        </p>
        <button onClick={reset} className="btn-primary mt-6">Submit Another Report</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-panel p-5 md:p-6 space-y-5">
      <div>
        <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">Incident Type</label>
        <div className="flex flex-wrap gap-2">
          {incidentTypes.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setIncidentType(t)}
              className={`text-xs px-3.5 py-2 rounded-lg border transition-colors ${
                incidentType === t
                  ? "bg-signal/15 border-signal/50 text-signal"
                  : "border-base-line text-ink-mid hover:border-base-line2"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">Severity</label>
        <div className="flex flex-wrap gap-2">
          {severities.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSeverity(s)}
              className={`text-xs px-3.5 py-2 rounded-lg border transition-colors ${
                severity === s
                  ? "bg-signal/15 border-signal/50 text-signal"
                  : "border-base-line text-ink-mid hover:border-base-line2"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">Photo / Video</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-base-line hover:border-signal/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
        >
          <FiUploadCloud className="mx-auto text-ink-mid mb-2" size={24} />
          <p className="text-sm text-ink-mid">
            <span className="text-signal font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-[11px] text-ink-low mt-1">PNG, JPG, MP4 up to 25MB</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-xs bg-base-panel2 rounded-lg px-3 py-2">
                <span className="text-ink-hi truncate">{f.name} <span className="text-ink-mid">({f.size})</span></span>
                <button
                  type="button"
                  onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${f.name}`}
                >
                  <FiX className="text-ink-mid hover:text-risk-critical" size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">Location</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 bg-base-panel2 border border-base-line rounded-lg px-3.5 py-2.5">
            <FiMapPin className="text-ink-mid shrink-0" size={15} />
            <span className="text-sm text-ink-mid truncate">{location || "No location captured yet"}</span>
          </div>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="btn-ghost !py-2.5 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            <FiCrosshair className={locating ? "animate-spin" : ""} size={15} />
            {locating ? "Locating…" : "USE CURRENT LOCATION"}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe what you observed — extent of damage, visible cracks, water flow, affected structures, etc."
          className="w-full bg-base-panel2 border border-base-line focus:border-signal rounded-lg px-3.5 py-3 text-sm text-ink-hi outline-none resize-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-risk-critical flex items-center gap-1.5 -mt-1">
          <FiAlertTriangle size={13} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full">SUBMIT REPORT</button>
    </form>
  );
}
