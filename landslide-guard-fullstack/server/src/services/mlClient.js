import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 8000,
});

/**
 * Calls the FastAPI ML service's /predict endpoint (XGBoost primary model,
 * Random Forest baseline, SHAP explainability).
 */
export async function getRiskPrediction(features) {
  try {
    const { data } = await client.post("/predict", features);
    return data;
  } catch (err) {
    const wrapped = new Error(
      `ML service unreachable or errored (${ML_SERVICE_URL}/predict): ${err.message}`
    );
    wrapped.status = 502;
    wrapped.publicMessage =
      "The AI risk-prediction service is unavailable. Make sure the FastAPI ml-service is running (see ml-service/README.md).";
    throw wrapped;
  }
}

/** Calls the FastAPI ML service's /zones/geo-features endpoint (GeoPandas + Rasterio). */
export async function getZoneGeoFeatures(zoneIds) {
  try {
    const { data } = await client.post("/zones/geo-features", { zone_ids: zoneIds });
    return data;
  } catch (err) {
    const wrapped = new Error(`ML service geo-features call failed: ${err.message}`);
    wrapped.status = 502;
    wrapped.publicMessage = "The GIS feature-extraction service is unavailable.";
    throw wrapped;
  }
}

export async function mlServiceHealth() {
  try {
    const { data } = await client.get("/health", { timeout: 3000 });
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
