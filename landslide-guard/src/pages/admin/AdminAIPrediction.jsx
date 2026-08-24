import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { riskZones, terrainConditions, simulateRiskAnalysis } from "../../data/mockData";
import { FiCpu, FiZap, FiAlertCircle } from "react-icons/fi";

export default function AdminAIPrediction() {
  const [form, setForm] = useState({
    location: riskZones[0].name,
    rainfall: 120,
    soilMoisture: 82,
    slope: 35,
    terrainCondition: "Saturated",
  });
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function analyze() {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateRiskAnalysis(form));
      setAnalyzing(false);
    }, 900);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Simulation Engine"
        title="AI Risk Prediction"
        description="Frontend simulation only — inputs are scored with a deterministic mock model for demo purposes (no real ML model is called)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        {/* Form */}
        <div className="glass-panel p-5 md:p-6 space-y-4">
          <Field label="Location">
            <select
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="input-field"
            >
              {riskZones.map((z) => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
          </Field>

          <Field label={`Rainfall — ${form.rainfall} mm`}>
            <input
              type="range" min="0" max="220" value={form.rainfall}
              onChange={(e) => update("rainfall", Number(e.target.value))}
              className="slider"
            />
          </Field>

          <Field label={`Soil Moisture — ${form.soilMoisture}%`}>
            <input
              type="range" min="0" max="100" value={form.soilMoisture}
              onChange={(e) => update("soilMoisture", Number(e.target.value))}
              className="slider"
            />
          </Field>

          <Field label={`Slope — ${form.slope}°`}>
            <input
              type="range" min="0" max="50" value={form.slope}
              onChange={(e) => update("slope", Number(e.target.value))}
              className="slider"
            />
          </Field>

          <Field label="Terrain Condition">
            <select
              value={form.terrainCondition}
              onChange={(e) => update("terrainCondition", e.target.value)}
              className="input-field"
            >
              {terrainConditions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <button onClick={analyze} disabled={analyzing} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {analyzing ? <FiZap className="animate-pulse" size={16} /> : <FiCpu size={16} />}
            {analyzing ? "ANALYZING…" : "ANALYZE RISK"}
          </button>
        </div>

        {/* Result */}
        <div className="glass-panel p-5 md:p-6 flex flex-col">
          <p className="text-[11px] font-mono text-ink-mid uppercase tracking-wide mb-4">Prediction Result</p>

          {!result && !analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <FiCpu className="text-ink-low mb-3" size={30} />
              <p className="text-sm text-ink-mid max-w-[220px]">
                Set input parameters and run the analysis to generate a risk prediction.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div className="w-10 h-10 rounded-full border-2 border-signal/30 border-t-signal animate-spin mb-4" />
              <p className="text-sm text-ink-mid">Running risk model on {form.location}…</p>
            </div>
          )}

          {result && !analyzing && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between">
                <RiskBadge level={result.level} size="lg" pulse />
                <span className="text-xs font-mono text-ink-mid">{form.location}</span>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <p className="data-num text-5xl font-bold text-ink-hi">{result.score}%</p>
                <p className="text-sm text-ink-mid mb-1.5">Risk Probability</p>
              </div>
              <div className="w-full h-2 rounded-full bg-base-panel2 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${result.score}%`,
                    backgroundColor: { low: "#22C55E", moderate: "#EAB308", high: "#F97316", critical: "#EF4444" }[result.level],
                  }}
                />
              </div>

              <div className="mt-6 pt-5 border-t border-base-line">
                <p className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-3">Risk Factors</p>
                <ul className="space-y-2">
                  {result.factors.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink-hi">
                      <FiAlertCircle className="text-signal shrink-0" size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: #0E1830;
          border: 1px solid #1E3358;
          border-radius: 0.6rem;
          padding: 0.6rem 0.85rem;
          font-size: 0.875rem;
          color: #EAF0FA;
          outline: none;
        }
        .input-field:focus { border-color: #2DD4E8; }
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: #1E3358;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #2DD4E8;
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(45,212,232,0.15);
        }
        .slider::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%; border: none;
          background: #2DD4E8; cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
