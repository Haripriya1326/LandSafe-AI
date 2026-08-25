// ------------------------------------------------------------------
// Thin fetch wrapper for the Landslide Guard backend (Node/Express,
// which itself proxies AI predictions to the FastAPI ml-service).
//
// Set VITE_API_URL in a .env file to point at a non-default backend,
// e.g. VITE_API_URL=https://api.your-deployment.com
// ------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "landslide-guard-token";

// Report images are stored on the API server and returned as
// server-relative paths (e.g. "/uploads/reports/xxx.jpg") — this turns
// one into a fully-qualified URL the <img> tag can load directly.
export function mediaUrl(relativePath) {
  if (!relativePath) return null;
  if (/^https?:\/\//.test(relativePath)) return relativePath;
  return `${BASE_URL}${relativePath}`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  // FormData (used for report submissions with photo/video attachments)
  // must NOT get a JSON Content-Type or a stringified body — the browser
  // sets its own multipart boundary header when it sees a FormData body.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

// ---- Auth ----
export const authApi = {
  signup: (payload) => request("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  oauth: (provider) => request(`/api/auth/oauth/${provider}`, { method: "POST" }),
  me: () => request("/api/auth/me", { auth: true }),
};

// ---- Zones ----
export const zonesApi = {
  list: (params = {}) => request(`/api/zones?${new URLSearchParams(params)}`),
  overview: () => request("/api/zones/overview"),
  geojson: () => request("/api/zones/geojson"),
  get: (id) => request(`/api/zones/${id}`),
};

// ---- Sensors ----
export const sensorsApi = {
  cards: (zoneId) => request(`/api/sensors${zoneId ? `?zoneId=${zoneId}` : ""}`),
  ingest: (payload) => request("/api/sensors/ingest", { method: "POST", body: payload }),
  simulate: (zoneId) => request("/api/sensors/simulate", { method: "POST", body: zoneId ? { zoneId } : {} }),
};

// ---- Weather (live Open-Meteo forecast + NASA GIBS/Worldview satellite imagery) ----
export const weatherApi = {
  forecast: (zoneId) => request(`/api/weather?zoneId=${zoneId}`),
  satellite: (zoneId, date) =>
    request(`/api/weather/satellite?zoneId=${zoneId}${date ? `&date=${date}` : ""}`),
};

// ---- Reports ----
export const reportsApi = {
  list: (params = {}) => request(`/api/reports?${new URLSearchParams(params)}`),
  create: (payload) => request("/api/reports", { method: "POST", body: payload }),
  updateStatus: (id, status) =>
    request(`/api/reports/${id}/status`, { method: "PATCH", body: { status }, auth: true }),
};

// ---- Alerts ----
export const alertsApi = {
  list: (params = {}) => request(`/api/alerts?${new URLSearchParams(params)}`),
  create: (payload) => request("/api/alerts", { method: "POST", body: payload, auth: true }),
};

// ---- Response priorities ----
export const prioritiesApi = {
  list: () => request("/api/priorities"),
};

// ---- AI predictions (XGBoost + Random Forest + SHAP via ml-service) ----
export const predictionsApi = {
  predict: (payload) => request("/api/predict", { method: "POST", body: payload }),
  history: (params = {}) => request(`/api/history?${new URLSearchParams(params)}`),
  geoFeatures: (zoneIds = []) => request(`/api/geo-features?zoneIds=${zoneIds.join(",")}`),
  health: () => request("/api/health"),
};
