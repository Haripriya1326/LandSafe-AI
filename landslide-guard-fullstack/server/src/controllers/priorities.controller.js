import { db } from "../config/db.js";

const RISK_WEIGHT = { critical: 100, high: 70, moderate: 40, low: 10 };
const ROAD_WEIGHT = { "Blocked": 20, "Partially Blocked": 10, "Open": 0 };

// Latest simulated sensor reading for a zone, falling back to its
// seeded baseline rainfall/soil-moisture if no reading exists yet
// (e.g. right after a fresh --force reseed, before the first
// simulation tick has run).
function liveConditionsFor(zone) {
  const reading = db.data.sensorReadings.find((s) => s.zoneId === zone.id);
  return {
    rainfall: reading ? reading.rainfallMm : zone.rainfall,
    soilMoisture: reading ? reading.soilMoisturePct : zone.soilMoisture,
    recordedAt: reading?.recordedAt || null,
  };
}

function notesFor(zone, conditions) {
  const notes = [];
  if (conditions.rainfall > 130) notes.push("Heavy rainfall exceeding threshold");
  if (conditions.soilMoisture > 85) notes.push("Active slope saturation");
  if (zone.roadStatus === "Blocked") notes.push("Road blocked, access restricted");
  else if (zone.roadStatus === "Partially Blocked") notes.push("Road partially blocked");
  if (notes.length === 0) notes.push("Stable for now, continue monitoring");
  return notes.join("; ");
}

function priorityLabel(score) {
  if (score >= 130) return "IMMEDIATE";
  if (score >= 90) return "HIGH";
  return "MONITOR";
}

export async function listPriorities(req, res) {
  const ranked = db.data.zones
    .map((zone) => {
      const conditions = liveConditionsFor(zone);

      // Live rainfall/soil-moisture readings nudge the score too, not
      // just the descriptive note — a zone whose sensors have drifted
      // into "heavy rainfall" or "active saturation" territory since
      // it was seeded should rank higher, even if its static risk
      // label hasn't been recomputed yet.
      const conditionBoost = (conditions.rainfall > 130 ? 15 : 0) + (conditions.soilMoisture > 85 ? 15 : 0);

      const score =
        RISK_WEIGHT[zone.risk] +
        (ROAD_WEIGHT[zone.roadStatus] || 0) +
        Math.min(zone.population / 20, 15) +
        conditionBoost;

      return {
        id: `RP-${zone.id}`,
        zone: zone.name,
        zoneId: zone.id,
        risk: zone.risk,
        affected: zone.population,
        rainfall: conditions.rainfall,
        soilMoisture: conditions.soilMoisture,
        note: notesFor(zone, conditions),
        priority: priorityLabel(score),
        score: Math.round(score),
      };
    })
    .sort((a, b) => b.score - a.score);

  res.json({ priorities: ranked });
}
