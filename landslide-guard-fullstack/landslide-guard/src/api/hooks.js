import { useEffect, useState, useCallback } from "react";
import { zonesApi, sensorsApi, reportsApi, alertsApi, prioritiesApi, weatherApi } from "./client";
import * as mock from "../data/mockData";

// Fetches from the live backend; if the backend/ML service isn't running,
// falls back to the original mock data so the UI never breaks in a demo.
// Pass `refreshMs` to keep polling (e.g. for the simulated sensor feed) —
// omit it for one-shot fetches.
function useLiveData(fetchFn, fallback, deps = [], refreshMs = 0) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    (cancelledRef) => {
      fetchFn()
        .then((res) => {
          if (cancelledRef.current) return;
          setData(res);
          setIsLive(true);
          setError(null);
        })
        .catch((err) => {
          if (cancelledRef.current) return;
          setData(fallback);
          setIsLive(false);
          setError(err.message || "Request failed.");
        })
        .finally(() => {
          if (!cancelledRef.current) setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    const cancelledRef = { current: false };
    setLoading(true);
    run(cancelledRef);

    let interval;
    if (refreshMs > 0) {
      interval = setInterval(() => run(cancelledRef), refreshMs);
    }
    return () => {
      cancelledRef.current = true;
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, refreshMs]);

  return { data, loading, isLive, error };
}

export function useRiskOverview() {
  return useLiveData(async () => (await zonesApi.overview()).overview, mock.riskOverview);
}

export function useRiskZones() {
  return useLiveData(async () => (await zonesApi.list()).zones, mock.riskZones);
}

export function useAlerts() {
  return useLiveData(async () => (await alertsApi.list()).alerts, mock.alerts);
}

export function useFieldReports(params = {}) {
  return useLiveData(
    async () => (await reportsApi.list(params)).reports,
    mock.fieldReports,
    [JSON.stringify(params)]
  );
}

export function useResponsePriorities() {
  // Scores are now driven by the live simulated sensor feed, so poll
  // to pick up each background simulation tick.
  return useLiveData(async () => (await prioritiesApi.list()).priorities, mock.responsePriorities, [], 30_000);
}

export function useSensorCards(zoneId) {
  // Polls every 30s so the cards reflect the backend's simulated
  // sensor feed (rainfall/soil moisture/temperature/slope) ticking
  // over in near-real-time, similar to live IoT hardware.
  return useLiveData(
    async () => (await sensorsApi.cards(zoneId)).cards,
    mock.sensorCards,
    [zoneId],
    30_000
  );
}

// Live current-conditions + 5-day rainfall outlook for a zone, from
// Open-Meteo. Falls back to the bundled mock snapshot/forecast if the
// backend or Open-Meteo is unreachable.
export function useWeather(zoneId) {
  const fallback = {
    zoneId: zoneId || null,
    snapshot: mock.weatherSnapshot,
    rainfallForecast: mock.rainfallForecast,
    daily: null,
    source: "mock",
  };
  return useLiveData(
    async () => weatherApi.forecast(zoneId),
    fallback,
    [zoneId],
    5 * 60_000 // refresh every 5 minutes
  );
}

// NASA GIBS/Worldview satellite imagery (true-color + precipitation
// overlay) for a zone. No mock fallback exists for imagery — if it
// fails, `isLive` stays false and callers should hide the panel.
export function useSatellite(zoneId, date) {
  return useLiveData(
    async () => weatherApi.satellite(zoneId, date),
    null,
    [zoneId, date]
  );
}
