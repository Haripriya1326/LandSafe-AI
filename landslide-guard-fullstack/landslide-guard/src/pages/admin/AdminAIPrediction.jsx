import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import RiskBadge from "../../components/common/RiskBadge";
import { riskZones, terrainConditions } from "../../data/mockData";
import { predictionsApi, weatherApi, sensorsApi } from "../../api/client";
import { FiCpu, FiZap, FiAlertCircle, FiAlertTriangle, FiCloudRain } from "react-icons/fi";

// Rough heuristic to pre-select a sensible terrain condition from live
// soil-moisture data — the field stays fully editable afterwards, this
// is just a starting point instead of always defaulting to "Stable".
function terrainFromSoilMoisture(pct) {
  if (pct >= 80) return "Saturated";
  if (pct >= 55) return "Loose / Eroding";
  return "Stable";
}

export default function AdminAIPrediction() {
  const [form, setForm] = useState({
    location: riskZones[0].name,
    zoneId: riskZones[0].id,
    rainfall: 120,
    soilMoisture: 82,
    slope: riskZones[0].slope,
    terrainCondition: "Saturated",
  });
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Pulls today's live rainfall (Open-Meteo) and the latest simulated
  // soil-moisture sensor reading for the selected zone, and fills the
  // form with them instead of the user having to drag the sliders by
  // hand. Slope comes from the zone's fixed terrain data (it doesn't
  // change day to day); terrain condition is a starting guess from the
  // soil-moisture reading, still editable afterwards.
  async function useTodaysLiveData() {
    setLoadingLive(true);
    setLiveError(null);
    try {
      const [weather, sensors] = await Promise.all([
        weatherApi.forecast(form.zoneId),
        sensorsApi.cards(form.zoneId),
      ]);
      const todayRainfall = weather.rainfallForecast?.[0]?.mm;
      const soilCard = sensors.cards?.find((c) => c.key === "soil");
      const zone = riskZones.find((z) => z.id === form.zoneId);

      if (todayRainfall == null || !soilCard) {
        throw new Error("Live weather/sensor data unavailable for this zone.");
      }

      setForm((f) => ({
        ...f,
        rainfall: todayRainfall,
        soilMoisture: soilCard.value,
        slope: zone?.slope ?? f.slope,
        terrainCondition: terrainFromSoilMoisture(soilCard.value),
      }));
    } catch (err) {
      setLiveError(err.message || "Couldn't fetch live data.");
    } finally {
      setLoadingLive(false);
    }
  }

  async function analyze() {
    setAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      // Calls the Node API, which proxies to the FastAPI ml-service
      // (XGBoost primary model + Random Forest baseline + SHAP explainability).
      const { prediction } = await predictionsApi.predict({
        zoneId: form.zoneId,
        rainfall: form.rainfall,
        soilMoisture: form.soilMoisture,
        slope: form.slope,
        terrainCondition: form.terrainCondition,
      });
      setResult({
        score: prediction.result.risk_score,
        level: prediction.result.risk_level,
        factors: prediction.result.shap_explanation.map(
          (f) => `${f.factor} (${f.contribution > 0 ? "+" : ""}${f.contribution})`
        ),
        votes: prediction.result.model_votes,
        summary: prediction.result.summary,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="XGBoost + SHAP"
        title="AI Risk Prediction"
        description="Scored live by the FastAPI ml-service — XGBoost as the primary model, Random Forest as a comparison baseline, with SHAP-based explainability for each prediction."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        {/* Form */}
        <div className="glass-panel p-5 md:p-6 space-y-4">
          <Field label="Location">
            <select
              value={form.zoneId}
              onChange={(e) => {
                const zone = riskZones.find((z) => z.id === e.target.value);
                setForm((f) => ({ ...f, zoneId: zone.id, location: zone.name, slope: zone.slope }));
              }}
              className="input-field"
            >
              {riskZones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </Field>

          <button
            type="button"
            onClick={useTodaysLiveData}
            disabled={loadingLive}
            className="w-full flex items-center justify-center gap-2 text-[11px] font-mono uppercase px-3 py-2.5 rounded-lg border border-signal/30 bg-signal/10 text-signal hover:bg-signal/15 transition-colors disabled:opacity-50"
          >
            <FiCloudRain size={13} className={loadingLive ? "animate-pulse" : ""} />
            {loadingLive ? "Fetching Today's Data…" : "Use Today's Live Weather + Sensor Data"}
          </button>
          {liveError && <p className="text-xs text-risk-critical -mt-2">{liveError}</p>}

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

          {error && !analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <FiAlertTriangle className="text-risk-critical mb-3" size={30} />
              <p className="text-sm text-ink-mid max-w-[280px]">
                Couldn't reach the ML service: {error}
              </p>
              <p className="text-xs text-ink-low mt-2 max-w-[280px]">
                Make sure the FastAPI ml-service is running (see ml-service/README.md).
              </p>
            </div>
          )}

          {!result && !analyzing && !error && (
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

              {result.votes && (
                <div className="mt-5 pt-5 border-t border-base-line">
                  <p className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-3">Model Comparison</p>
                  <ul className="space-y-1.5">
                    {result.votes.map((v) => (
                      <li key={v.model} className="flex items-center justify-between text-sm">
                        <span className="text-ink-mid">{v.model}</span>
                        <span className="text-ink-hi font-mono">{v.risk_score}/100 · {v.risk_level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
