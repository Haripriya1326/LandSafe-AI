// ============================================================
// LANDSLIDE GUARD — MOCK DATA LAYER
// All data below is illustrative/mock data for the SIH demo.
// Structured so each block can be swapped 1:1 for a real API
// response later (e.g. GET /api/zones, GET /api/sensors...).
// ============================================================

export const RISK_LEVELS = {
  low: { label: "Low", color: "#22C55E", text: "text-risk-low", bg: "bg-risk-low" },
  moderate: { label: "Moderate", color: "#EAB308", text: "text-risk-moderate", bg: "bg-risk-moderate" },
  high: { label: "High", color: "#F97316", text: "text-risk-high", bg: "bg-risk-high" },
  critical: { label: "Critical", color: "#EF4444", text: "text-risk-critical", bg: "bg-risk-critical" },
};

export const riskOverview = [
  { level: "critical", label: "Critical Zones", count: 5 },
  { level: "high", label: "High Risk Zones", count: 12 },
  { level: "moderate", label: "Moderate Zones", count: 20 },
  { level: "low", label: "Low Risk Zones", count: 48 },
];

// North Eastern Region reference zones (mock coordinates)
export const riskZones = [
  {
    id: "zone-a",
    name: "Zone A — Sohra Ridge",
    district: "East Khasi Hills, Meghalaya",
    lat: 25.2669,
    lng: 91.7320,
    risk: "high",
    rainfall: 120,
    soilMoisture: 82,
    slope: 35,
    roadStatus: "Partially Blocked",
    population: 120,
  },
  {
    id: "zone-b",
    name: "Zone B — Mawkyrwat Slope",
    district: "South West Khasi Hills, Meghalaya",
    lat: 25.3080,
    lng: 91.2170,
    risk: "critical",
    rainfall: 168,
    soilMoisture: 91,
    slope: 42,
    roadStatus: "Blocked",
    population: 85,
  },
  {
    id: "zone-c",
    name: "Zone C — Kohima Bypass",
    district: "Kohima, Nagaland",
    lat: 25.6751,
    lng: 94.1086,
    risk: "moderate",
    rainfall: 74,
    soilMoisture: 58,
    slope: 22,
    roadStatus: "Open",
    population: 210,
  },
  {
    id: "zone-d",
    name: "Zone D — Aizawl Hillside",
    district: "Aizawl, Mizoram",
    lat: 23.7271,
    lng: 92.7176,
    risk: "high",
    rainfall: 103,
    soilMoisture: 77,
    slope: 31,
    roadStatus: "Partially Blocked",
    population: 340,
  },
  {
    id: "zone-e",
    name: "Zone E — Itanagar Foothills",
    district: "Papum Pare, Arunachal Pradesh",
    lat: 27.0844,
    lng: 93.6053,
    risk: "low",
    rainfall: 38,
    soilMoisture: 41,
    slope: 12,
    roadStatus: "Open",
    population: 415,
  },
  {
    id: "zone-f",
    name: "Zone F — Gangtok Ridge Road",
    district: "East Sikkim, Sikkim",
    lat: 27.3389,
    lng: 88.6065,
    risk: "critical",
    rainfall: 152,
    soilMoisture: 88,
    slope: 39,
    roadStatus: "Blocked",
    population: 96,
  },
  {
    id: "zone-g",
    name: "Zone G — Along Highway",
    district: "West Siang, Arunachal Pradesh",
    lat: 28.1667,
    lng: 94.8000,
    risk: "moderate",
    rainfall: 66,
    soilMoisture: 55,
    slope: 24,
    roadStatus: "Open",
    population: 180,
  },
  {
    id: "zone-h",
    name: "Zone H — Haflong Slopes",
    district: "Dima Hasao, Assam",
    lat: 25.1667,
    lng: 93.0167,
    risk: "high",
    rainfall: 111,
    soilMoisture: 79,
    slope: 33,
    roadStatus: "Partially Blocked",
    population: 265,
  },
];

// Rainfall / sensor trend for small charts (last 7 checkpoints)
export const rainfallTrend = [
  { t: "-6h", mm: 12 }, { t: "-5h", mm: 18 }, { t: "-4h", mm: 22 },
  { t: "-3h", mm: 30 }, { t: "-2h", mm: 41 }, { t: "-1h", mm: 55 }, { t: "Now", mm: 82 },
];

export const soilMoistureTrend = [
  { t: "-6h", pct: 58 }, { t: "-5h", pct: 61 }, { t: "-4h", pct: 65 },
  { t: "-3h", pct: 70 }, { t: "-2h", pct: 75 }, { t: "-1h", pct: 79 }, { t: "Now", pct: 82 },
];

export const temperatureTrend = [
  { t: "-6h", c: 21 }, { t: "-5h", c: 20 }, { t: "-4h", c: 19 },
  { t: "-3h", c: 18 }, { t: "-2h", c: 18 }, { t: "-1h", c: 17 }, { t: "Now", c: 17 },
];

export const slopeStabilityTrend = [
  { t: "-6h", index: 88 }, { t: "-5h", index: 85 }, { t: "-4h", index: 81 },
  { t: "-3h", index: 76 }, { t: "-2h", index: 70 }, { t: "-1h", index: 64 }, { t: "Now", index: 58 },
];

export const sensorCards = [
  { key: "rainfall", label: "Rainfall", value: 82, unit: "mm", trend: rainfallTrend, dataKey: "mm", status: "high" },
  { key: "soil", label: "Soil Moisture", value: 82, unit: "%", trend: soilMoistureTrend, dataKey: "pct", status: "high" },
  { key: "temperature", label: "Temperature", value: 17, unit: "°C", trend: temperatureTrend, dataKey: "c", status: "normal" },
  { key: "slope", label: "Slope Stability Index", value: 58, unit: "/100", trend: slopeStabilityTrend, dataKey: "index", status: "critical" },
];

export const rainfallForecast = [
  { day: "Today", mm: 82 },
  { day: "Tomorrow", mm: 110 },
  { day: "Day 3", mm: 145 },
  { day: "Day 4", mm: 128 },
  { day: "Day 5", mm: 96 },
];

export const weatherSnapshot = {
  condition: "Heavy Rain Expected",
  temp: 17,
  humidity: 88,
  wind: 14,
  visibility: "Low",
};

export const fieldReports = [
  {
    id: "FR-1042",
    title: "Crack detected near Zone A",
    location: "Sohra Ridge, East Khasi Hills",
    type: "Soil Crack",
    severity: "high",
    reportedBy: "Field Officer — R. Lyngdoh",
    time: "18 min ago",
    status: "Under Review",
  },
  {
    id: "FR-1041",
    title: "Road blocked in Zone B",
    location: "Mawkyrwat Slope, SW Khasi Hills",
    type: "Blocked Road",
    severity: "critical",
    reportedBy: "Field Officer — T. Sangma",
    time: "42 min ago",
    status: "Verified",
  },
  {
    id: "FR-1040",
    title: "Slope movement reported in Zone C",
    location: "Kohima Bypass, Kohima",
    type: "Slope Movement",
    severity: "moderate",
    reportedBy: "Citizen Report",
    time: "1 hr 10 min ago",
    status: "Submitted",
  },
  {
    id: "FR-1039",
    title: "Minor debris on approach road",
    location: "Haflong Slopes, Dima Hasao",
    type: "Infrastructure Damage",
    severity: "low",
    reportedBy: "Field Officer — K. Basumatary",
    time: "3 hr ago",
    status: "Verified",
  },
];

export const alerts = [
  {
    id: "AL-501",
    title: "Critical Landslide Warning",
    zone: "Zone B — Mawkyrwat Slope",
    severity: "critical",
    message: "Sustained heavy rainfall and slope saturation have crossed the critical threshold. Immediate evacuation advised for downstream settlements.",
    time: "8 min ago",
  },
  {
    id: "AL-500",
    title: "Heavy Rainfall Warning",
    zone: "Zone F — Gangtok Ridge Road",
    severity: "critical",
    message: "152mm rainfall recorded in the last 24 hours, exceeding the regional threshold of 120mm.",
    time: "31 min ago",
  },
  {
    id: "AL-499",
    title: "Road Blockage Reported",
    zone: "Zone A — Sohra Ridge",
    severity: "high",
    message: "NH-206 partially blocked by debris. Alternate route advised via Mawlai bypass.",
    time: "1 hr ago",
  },
  {
    id: "AL-498",
    title: "Slope Movement Detected",
    zone: "Zone H — Haflong Slopes",
    severity: "moderate",
    message: "Ground sensors recorded a 4mm displacement over the last 6 hours. Monitoring continues.",
    time: "2 hr ago",
  },
];

export const responsePriorities = [
  {
    id: "RP-1",
    zone: "Zone B — Mawkyrwat Slope",
    risk: "critical",
    affected: 85,
    note: "Road blocked, active slope saturation",
    priority: "IMMEDIATE",
  },
  {
    id: "RP-2",
    zone: "Zone F — Gangtok Ridge Road",
    risk: "critical",
    affected: 96,
    note: "Heavy rainfall exceeding threshold",
    priority: "IMMEDIATE",
  },
  {
    id: "RP-3",
    zone: "Zone A — Sohra Ridge",
    risk: "high",
    affected: 120,
    note: "Fresh cracks reported near residential cluster",
    priority: "HIGH",
  },
  {
    id: "RP-4",
    zone: "Zone D — Aizawl Hillside",
    risk: "high",
    affected: 340,
    note: "Elevated soil moisture, roads partially blocked",
    priority: "HIGH",
  },
  {
    id: "RP-5",
    zone: "Zone C — Kohima Bypass",
    risk: "moderate",
    affected: 210,
    note: "Stable for now, continue monitoring",
    priority: "MONITOR",
  },
];

export const nearbyRisksForField = [
  { zone: "Zone A — Sohra Ridge", risk: "high", distance: "1.2 km" },
  { zone: "Zone B — Mawkyrwat Slope", risk: "critical", distance: "4.8 km" },
  { zone: "Zone C — Kohima Bypass", risk: "moderate", distance: "9.1 km" },
];

export const myFieldReports = [
  { id: "FR-1042", title: "Crack detected near Zone A", type: "Soil Crack", time: "18 min ago", status: "Under Review" },
  { id: "FR-1030", title: "Debris on foot trail, Zone H", type: "Infrastructure Damage", time: "Yesterday", status: "Verified" },
  { id: "FR-1021", title: "Minor slope shift, Zone C", type: "Slope Movement", time: "3 days ago", status: "Submitted" },
];

export const citizenHome = {
  area: "Zone A — Sohra Ridge",
  risk: "high",
  message: "Heavy rainfall detected in your area. Monitor official alerts closely.",
  rainfall: 120,
  roadStatus: "Partially Blocked",
};

export const citizenNearbyRisks = [
  { zone: "Zone A — Sohra Ridge", risk: "high", distance: "0.0 km (your area)" },
  { zone: "Zone C — Kohima Bypass", risk: "moderate", distance: "6.4 km" },
  { zone: "Zone E — Itanagar Foothills", risk: "low", distance: "18.2 km" },
];

export const safeZones = [
  { name: "Community Hall — Sohra", distance: "2.4 km", capacity: 300, status: "Available" },
  { name: "Govt. Higher Secondary School", distance: "3.1 km", capacity: 450, status: "Available" },
  { name: "District Relief Camp — Sector 4", distance: "5.6 km", capacity: 600, status: "Filling Up" },
];

export const incidentTypes = [
  "Landslide",
  "Soil Crack",
  "Slope Movement",
  "Blocked Road",
  "Infrastructure Damage",
  "Other",
];

export const terrainConditions = [
  "Stable",
  "Loose / Eroding",
  "Saturated",
  "Visible Cracking",
  "Recently Disturbed",
];

// Simple deterministic mock "AI" risk scoring — frontend simulation only.
export function simulateRiskAnalysis({ rainfall, soilMoisture, slope, terrainCondition }) {
  const r = Number(rainfall) || 0;
  const s = Number(soilMoisture) || 0;
  const sl = Number(slope) || 0;

  let score = 0;
  score += Math.min(r / 200, 1) * 35;
  score += Math.min(s / 100, 1) * 30;
  score += Math.min(sl / 50, 1) * 25;
  if (terrainCondition === "Saturated") score += 6;
  if (terrainCondition === "Visible Cracking") score += 8;
  if (terrainCondition === "Loose / Eroding") score += 5;
  if (terrainCondition === "Recently Disturbed") score += 4;

  score = Math.min(Math.round(score), 98);

  let level = "low";
  if (score >= 75) level = "critical";
  else if (score >= 55) level = "high";
  else if (score >= 30) level = "moderate";

  const factors = [];
  if (r >= 90) factors.push("Heavy rainfall");
  if (s >= 70) factors.push("High soil moisture");
  if (sl >= 30) factors.push("Steep slope gradient");
  if (terrainCondition === "Saturated") factors.push("Saturated terrain");
  if (terrainCondition === "Visible Cracking") factors.push("Visible surface cracking");
  if (terrainCondition === "Loose / Eroding") factors.push("Loose, eroding soil");
  if (factors.length === 0) factors.push("No significant risk factors detected");

  return { score, level, factors };
}
