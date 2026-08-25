import axios from "axios";

// ------------------------------------------------------------------
// Open-Meteo (https://open-meteo.com) — free, no API key required.
// Used for real current conditions + 5-day rainfall/weather outlook
// for a zone's coordinates. Results are cached briefly in-memory so
// the admin dashboard can poll without hammering the public API.
// ------------------------------------------------------------------

const client = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 8000,
});

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map(); // key -> { at, data }

// WMO weather interpretation codes -> short human label.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
const WMO_CONDITIONS = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Freezing Drizzle",
  57: "Freezing Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Freezing Rain",
  71: "Slight Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Thunderstorm with Heavy Hail",
};

export function weatherCodeToCondition(code) {
  return WMO_CONDITIONS[code] || "Unknown";
}

function cacheKey(lat, lng) {
  // Round to ~1km so nearby requests share a cache entry.
  return `${Number(lat).toFixed(2)},${Number(lng).toFixed(2)}`;
}

/**
 * Fetches current conditions + 5-day daily forecast (incl. rainfall)
 * from Open-Meteo for the given coordinates.
 */
export async function getForecast(lat, lng) {
  const key = cacheKey(lat, lng);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  try {
    const { data } = await client.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "weather_code",
          "wind_speed_10m",
          "soil_moisture_0_to_1cm",
        ].join(","),
        daily: [
          "precipitation_sum",
          "precipitation_probability_max",
          "temperature_2m_max",
          "temperature_2m_min",
          "weather_code",
        ].join(","),
        timezone: "auto",
        forecast_days: 5,
      },
    });

    const result = {
      source: "open-meteo",
      fetchedAt: new Date().toISOString(),
      current: {
        tempC: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        windKmh: Math.round(data.current.wind_speed_10m),
        precipitationMm: data.current.precipitation,
        soilMoistureSurface: data.current.soil_moisture_0_to_1cm,
        weatherCode: data.current.weather_code,
        condition: weatherCodeToCondition(data.current.weather_code),
      },
      daily: data.daily.time.map((date, i) => ({
        date,
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `Day ${i + 1}`,
        mm: Math.round(data.daily.precipitation_sum[i]),
        rainChancePct: data.daily.precipitation_probability_max?.[i] ?? null,
        tempMaxC: Math.round(data.daily.temperature_2m_max[i]),
        tempMinC: Math.round(data.daily.temperature_2m_min[i]),
        condition: weatherCodeToCondition(data.daily.weather_code[i]),
      })),
    };

    cache.set(key, { at: Date.now(), data: result });
    return result;
  } catch (err) {
    const wrapped = new Error(`Open-Meteo request failed: ${err.message}`);
    wrapped.status = 502;
    wrapped.publicMessage = "The live weather service (Open-Meteo) is unavailable right now.";
    throw wrapped;
  }
}
