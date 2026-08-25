import { db } from "../config/db.js";
import { getForecast } from "../services/weatherClient.js";
import { buildSatelliteViews } from "../services/nasaClient.js";

// Resolves { lat, lng, zone? } from either a zoneId or explicit lat/lng
// query params, so every endpoint below can be called either way.
function resolveLocation(req) {
  const { zoneId, lat, lng } = req.query;
  if (zoneId) {
    const zone = db.data.zones.find((z) => z.id === zoneId);
    if (!zone) return { error: "Zone not found." };
    return { lat: zone.lat, lng: zone.lng, zone };
  }
  if (lat && lng) return { lat: Number(lat), lng: Number(lng), zone: null };
  return { error: "Provide either zoneId or lat & lng." };
}

// Live current-conditions snapshot + 5-day rainfall/weather outlook
// from Open-Meteo (real data, no API key required).
export async function getWeather(req, res, next) {
  try {
    const { lat, lng, zone, error } = resolveLocation(req);
    if (error) return res.status(400).json({ error });

    const forecast = await getForecast(lat, lng);

    res.json({
      zoneId: zone?.id || null,
      zoneName: zone?.name || null,
      coordinates: { lat, lng },
      snapshot: {
        condition: forecast.current.condition,
        temp: forecast.current.tempC,
        humidity: forecast.current.humidity,
        wind: forecast.current.windKmh,
        visibility: forecast.current.condition.includes("Fog") ? "Low" : forecast.daily[0].mm > 90 ? "Reduced" : "Good",
      },
      rainfallForecast: forecast.daily.map((d) => ({ day: d.day, mm: d.mm })),
      daily: forecast.daily,
      fetchedAt: forecast.fetchedAt,
      source: forecast.source,
    });
  } catch (err) {
    next(err);
  }
}

// NASA GIBS/Worldview satellite imagery for the same location — a
// true-color snapshot plus a precipitation-overlay variant, and a
// deep link into the real Worldview app for the full interactive view.
export async function getSatellite(req, res, next) {
  try {
    const { lat, lng, zone, error } = resolveLocation(req);
    if (error) return res.status(400).json({ error });

    const views = buildSatelliteViews({ lat, lng, date: req.query.date });
    res.json({
      zoneId: zone?.id || null,
      zoneName: zone?.name || null,
      coordinates: { lat, lng },
      ...views,
    });
  } catch (err) {
    next(err);
  }
}
