import { nanoid } from "nanoid";
import { db, withDb } from "../config/db.js";
import { getRiskPrediction, getZoneGeoFeatures, mlServiceHealth } from "../services/mlClient.js";

export async function predict(req, res, next) {
  try {
    const { zoneId, rainfall, soilMoisture, slope, terrainCondition, historicalEvents } = req.body;

    if (rainfall == null || soilMoisture == null || slope == null) {
      return res.status(400).json({ error: "rainfall, soilMoisture and slope are required." });
    }

    const zone = zoneId ? db.data.zones.find((z) => z.id === zoneId) : null;

    // Calls the FastAPI ml-service, which runs XGBoost (primary model),
    // Random Forest (baseline/comparison) and returns SHAP-based
    // explainability for the prediction.
    const result = await getRiskPrediction({
      rainfall: Number(rainfall),
      soil_moisture: Number(soilMoisture),
      slope: Number(slope),
      terrain_condition: terrainCondition || "Stable",
      historical_events: Number(historicalEvents) || (zone ? 1 : 0),
    });

    const prediction = {
      id: nanoid(10),
      zoneId: zoneId || null,
      input: { rainfall, soilMoisture, slope, terrainCondition, historicalEvents },
      result,
      createdAt: new Date().toISOString(),
    };
    await withDb((data) => data.predictions.unshift(prediction));

    res.json({ prediction });
  } catch (err) {
    next(err);
  }
}

export async function history(req, res) {
  const { zoneId, limit = 20 } = req.query;
  let predictions = db.data.predictions;
  if (zoneId) predictions = predictions.filter((p) => p.zoneId === zoneId);
  res.json({ predictions: predictions.slice(0, Number(limit)) });
}

// GeoPandas + Rasterio powered zone feature extraction (elevation, derived
// slope, vector attributes) — proxied straight from the ML service.
export async function geoFeatures(req, res, next) {
  try {
    const zoneIds = (req.query.zoneIds || "").split(",").filter(Boolean);
    const targetIds = zoneIds.length ? zoneIds : db.data.zones.map((z) => z.id);
    const result = await getZoneGeoFeatures(targetIds);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function health(req, res) {
  const ml = await mlServiceHealth();
  res.json({ node: "ok", mlService: ml });
}
