import { db } from "../config/db.js";

export async function listZones(req, res) {
  const { risk, district } = req.query;
  let zones = db.data.zones;
  if (risk) zones = zones.filter((z) => z.risk === risk);
  if (district) zones = zones.filter((z) => z.district.toLowerCase().includes(district.toLowerCase()));
  res.json({ zones });
}

export async function getZone(req, res) {
  const zone = db.data.zones.find((z) => z.id === req.params.id);
  if (!zone) return res.status(404).json({ error: "Zone not found." });
  res.json({ zone });
}

export async function zonesOverview(req, res) {
  const counts = { critical: 0, high: 0, moderate: 0, low: 0 };
  for (const z of db.data.zones) counts[z.risk] = (counts[z.risk] || 0) + 1;
  res.json({
    overview: [
      { level: "critical", label: "Critical Zones", count: counts.critical },
      { level: "high", label: "High Risk Zones", count: counts.high },
      { level: "moderate", label: "Moderate Zones", count: counts.moderate },
      { level: "low", label: "Low Risk Zones", count: counts.low },
    ],
  });
}

// GeoJSON FeatureCollection — ready to feed straight into react-leaflet / GeoPandas-produced layers.
export async function zonesGeoJson(req, res) {
  res.json({
    type: "FeatureCollection",
    features: db.data.zones.map((z) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [z.lng, z.lat] },
      properties: { ...z },
    })),
  });
}
