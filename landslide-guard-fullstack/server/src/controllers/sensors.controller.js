import { nanoid } from "nanoid";
import { db, withDb } from "../config/db.js";
import { simulateZone, simulateAllZones } from "../services/simulate.js";

// Builds a synthetic-but-consistent trailing trend for a given zone's
// latest reading, in the shape the frontend charts already expect.
function buildTrend(latestValue, unitKey) {
  const steps = 6;
  const trend = [];
  for (let i = steps; i >= 1; i--) {
    const decay = 1 - i * 0.11;
    trend.push({ t: `-${i}h`, [unitKey]: Math.max(0, Math.round(latestValue * decay)) });
  }
  trend.push({ t: "Now", [unitKey]: latestValue });
  return trend;
}

export async function listSensorCards(req, res) {
  const { zoneId } = req.query;
  const reading = zoneId
    ? db.data.sensorReadings.find((s) => s.zoneId === zoneId)
    : db.data.sensorReadings[0];

  if (!reading) return res.status(404).json({ error: "No sensor data for this zone." });

  const cards = [
    { key: "rainfall", label: "Rainfall", value: reading.rainfallMm, unit: "mm", dataKey: "mm", trend: buildTrend(reading.rainfallMm, "mm"), status: reading.rainfallMm > 100 ? "high" : "normal" },
    { key: "soil", label: "Soil Moisture", value: reading.soilMoisturePct, unit: "%", dataKey: "pct", trend: buildTrend(reading.soilMoisturePct, "pct"), status: reading.soilMoisturePct > 75 ? "high" : "normal" },
    { key: "temperature", label: "Temperature", value: reading.temperatureC, unit: "°C", dataKey: "c", trend: buildTrend(reading.temperatureC, "c"), status: "normal" },
    { key: "slope", label: "Slope Stability Index", value: Math.round(reading.slopeStabilityIndex), unit: "/100", dataKey: "index", trend: buildTrend(Math.round(reading.slopeStabilityIndex), "index"), status: reading.slopeStabilityIndex < 65 ? "critical" : "normal" },
  ];
  res.json({ zoneId: reading.zoneId, recordedAt: reading.recordedAt, cards });
}

export async function ingestReading(req, res) {
  const { zoneId, rainfallMm, soilMoisturePct, temperatureC, slopeStabilityIndex } = req.body;
  if (!zoneId) return res.status(400).json({ error: "zoneId is required." });

  const reading = {
    id: nanoid(8),
    zoneId,
    rainfallMm: Number(rainfallMm) || 0,
    soilMoisturePct: Number(soilMoisturePct) || 0,
    temperatureC: Number(temperatureC) || 0,
    slopeStabilityIndex: Number(slopeStabilityIndex) || 0,
    recordedAt: new Date().toISOString(),
  };
  await withDb((data) => data.sensorReadings.unshift(reading));
  res.status(201).json({ reading });
}

// Generates a new simulated reading (rainfall/soil-moisture/temperature/
// slope) for one zone, or every zone if none is specified. The server
// also runs this automatically in the background (see index.js), so
// this endpoint is mainly for demoing an on-demand "sensor tick".
export async function simulateReading(req, res) {
  const { zoneId } = req.body;

  if (zoneId) {
    const reading = await simulateZone(zoneId);
    if (!reading) return res.status(404).json({ error: "Zone not found." });
    return res.status(201).json({ reading });
  }

  const readings = await simulateAllZones();
  res.status(201).json({ readings });
}
