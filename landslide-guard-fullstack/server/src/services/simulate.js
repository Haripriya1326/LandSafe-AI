import { nanoid } from "nanoid";
import { db, withDb } from "../config/db.js";

// ------------------------------------------------------------------
// There is no real IoT sensor hardware behind this prototype, so
// rainfall/soil-moisture/temperature/slope readings are simulated:
// each tick nudges the previous reading with a small random walk
// (clamped to sane ranges) instead of jumping to a fresh random
// value, so charts still look like a continuous sensor feed rather
// than noise.
// ------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function jitter(value, amount) {
  return value + (Math.random() * 2 - 1) * amount;
}

/**
 * Produces the next simulated reading for a zone, drifting from its
 * previous reading (or the zone's seeded baseline if there is none
 * yet).
 */
export function simulateNextReading(zone, prevReading) {
  const base = prevReading || {
    rainfallMm: zone.rainfall,
    soilMoisturePct: zone.soilMoisture,
    temperatureC: 17,
    slopeStabilityIndex: Math.max(5, 100 - zone.slope * 1.6),
  };

  // Rainfall drifts randomly, with a mild pull back toward the zone's
  // seeded baseline so it doesn't wander off indefinitely.
  const rainfallMm = clamp(
    Math.round(jitter(base.rainfallMm * 0.85 + zone.rainfall * 0.15, 8)),
    0,
    250
  );

  // Soil moisture responds to rainfall: more rain nudges it up, dry
  // spells let it drain down slowly.
  const rainInfluence = (rainfallMm - 60) * 0.03;
  const soilMoisturePct = clamp(
    Math.round(jitter(base.soilMoisturePct + rainInfluence, 2)),
    5,
    100
  );

  // Temperature does a small diurnal-ish wobble.
  const temperatureC = clamp(Math.round(jitter(base.temperatureC, 1.2) * 10) / 10, 5, 40);

  // Slope stability index falls as soil moisture/rainfall rise, and
  // slowly recovers otherwise — this is what drives the "critical"
  // status badge on the sensor cards.
  const saturationPenalty = Math.max(0, soilMoisturePct - 70) * 0.4 + Math.max(0, rainfallMm - 100) * 0.1;
  const slopeStabilityIndex = clamp(
    Math.round(jitter(base.slopeStabilityIndex - saturationPenalty * 0.2 + 0.6, 2)),
    5,
    100
  );

  return {
    id: nanoid(8),
    zoneId: zone.id,
    rainfallMm,
    soilMoisturePct,
    temperatureC,
    slopeStabilityIndex,
    recordedAt: new Date().toISOString(),
    simulated: true,
  };
}

/** Simulates and persists one new reading for a single zone. */
export async function simulateZone(zoneId) {
  const zone = db.data.zones.find((z) => z.id === zoneId);
  if (!zone) return null;
  const prev = db.data.sensorReadings.find((s) => s.zoneId === zoneId);
  const reading = simulateNextReading(zone, prev);
  await withDb((data) => {
    const idx = data.sensorReadings.findIndex((s) => s.zoneId === zoneId);
    if (idx >= 0) data.sensorReadings[idx] = reading;
    else data.sensorReadings.unshift(reading);
  });
  return reading;
}

/** Simulates and persists one new reading for every zone. */
export async function simulateAllZones() {
  const readings = [];
  for (const zone of db.data.zones) {
    const prev = db.data.sensorReadings.find((s) => s.zoneId === zone.id);
    readings.push(simulateNextReading(zone, prev));
  }
  await withDb((data) => {
    for (const reading of readings) {
      const idx = data.sensorReadings.findIndex((s) => s.zoneId === reading.zoneId);
      if (idx >= 0) data.sensorReadings[idx] = reading;
      else data.sensorReadings.unshift(reading);
    }
  });
  return readings;
}

let intervalHandle = null;

/**
 * Starts a background loop that simulates a fresh sensor reading for
 * every zone every `intervalMs`, so the dashboard has a live-looking
 * feed even with no physical sensors attached. Safe to call once at
 * server boot.
 */
export function startSensorSimulation(intervalMs = 60_000) {
  if (intervalHandle) return intervalHandle;
  intervalHandle = setInterval(() => {
    simulateAllZones().catch((err) => console.error("Sensor simulation tick failed:", err.message));
  }, intervalMs);
  intervalHandle.unref?.();
  return intervalHandle;
}
