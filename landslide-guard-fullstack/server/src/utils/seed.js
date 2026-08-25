import { nanoid } from "nanoid";
import { db } from "../config/db.js";

const riskZones = [
  { id: "zone-a", name: "Zone A — Sohra Ridge", district: "East Khasi Hills, Meghalaya", lat: 25.2669, lng: 91.7320, risk: "high", rainfall: 120, soilMoisture: 82, slope: 35, roadStatus: "Partially Blocked", population: 120 },
  { id: "zone-b", name: "Zone B — Mawkyrwat Slope", district: "South West Khasi Hills, Meghalaya", lat: 25.3080, lng: 91.2170, risk: "critical", rainfall: 168, soilMoisture: 91, slope: 42, roadStatus: "Blocked", population: 85 },
  { id: "zone-c", name: "Zone C — Kohima Bypass", district: "Kohima, Nagaland", lat: 25.6751, lng: 94.1086, risk: "moderate", rainfall: 74, soilMoisture: 58, slope: 22, roadStatus: "Open", population: 210 },
  { id: "zone-d", name: "Zone D — Aizawl Hillside", district: "Aizawl, Mizoram", lat: 23.7271, lng: 92.7176, risk: "high", rainfall: 103, soilMoisture: 77, slope: 31, roadStatus: "Partially Blocked", population: 340 },
  { id: "zone-e", name: "Zone E — Itanagar Foothills", district: "Papum Pare, Arunachal Pradesh", lat: 27.0844, lng: 93.6053, risk: "low", rainfall: 38, soilMoisture: 41, slope: 12, roadStatus: "Open", population: 415 },
  { id: "zone-f", name: "Zone F — Gangtok Ridge Road", district: "East Sikkim, Sikkim", lat: 27.3389, lng: 88.6065, risk: "critical", rainfall: 152, soilMoisture: 88, slope: 39, roadStatus: "Blocked", population: 96 },
  { id: "zone-g", name: "Zone G — Along Highway", district: "West Siang, Arunachal Pradesh", lat: 28.1667, lng: 94.8000, risk: "moderate", rainfall: 66, soilMoisture: 55, slope: 24, roadStatus: "Open", population: 180 },
  { id: "zone-h", name: "Zone H — Haflong Slopes", district: "Dima Hasao, Assam", lat: 25.1667, lng: 93.0167, risk: "high", rainfall: 111, soilMoisture: 79, slope: 33, roadStatus: "Partially Blocked", population: 265 },
];

const sensorReadings = riskZones.map((z) => ({
  id: nanoid(8),
  zoneId: z.id,
  rainfallMm: z.rainfall,
  soilMoisturePct: z.soilMoisture,
  temperatureC: 17,
  slopeStabilityIndex: Math.max(5, 100 - z.slope * 1.6),
  recordedAt: new Date().toISOString(),
}));

const fieldReports = [
  { id: "FR-1042", zoneId: "zone-a", title: "Crack detected near Zone A", location: "Sohra Ridge, East Khasi Hills", type: "Soil Crack", severity: "high", reportedBy: "Field Officer — R. Lyngdoh", status: "Under Review", createdAt: minsAgo(18) },
  { id: "FR-1041", zoneId: "zone-b", title: "Road blocked in Zone B", location: "Mawkyrwat Slope, SW Khasi Hills", type: "Blocked Road", severity: "critical", reportedBy: "Field Officer — T. Sangma", status: "Verified", createdAt: minsAgo(42) },
  { id: "FR-1040", zoneId: "zone-c", title: "Slope movement reported in Zone C", location: "Kohima Bypass, Kohima", type: "Slope Movement", severity: "moderate", reportedBy: "Citizen Report", status: "Submitted", createdAt: minsAgo(70) },
  { id: "FR-1039", zoneId: "zone-h", title: "Minor debris on approach road", location: "Haflong Slopes, Dima Hasao", type: "Infrastructure Damage", severity: "low", reportedBy: "Field Officer — K. Basumatary", status: "Verified", createdAt: hoursAgo(3) },
];

const alerts = [
  { id: "AL-501", zoneId: "zone-b", title: "Critical Landslide Warning", severity: "critical", message: "Sustained heavy rainfall and slope saturation have crossed the critical threshold. Immediate evacuation advised for downstream settlements.", createdAt: minsAgo(8) },
  { id: "AL-500", zoneId: "zone-f", title: "Heavy Rainfall Warning", severity: "critical", message: "152mm rainfall recorded in the last 24 hours, exceeding the regional threshold of 120mm.", createdAt: minsAgo(31) },
  { id: "AL-499", zoneId: "zone-a", title: "Road Blockage Reported", severity: "high", message: "NH-206 partially blocked by debris. Alternate route advised via Mawlai bypass.", createdAt: hoursAgo(1) },
  { id: "AL-498", zoneId: "zone-h", title: "Slope Movement Detected", severity: "moderate", message: "Ground sensors recorded a 4mm displacement over the last 6 hours. Monitoring continues.", createdAt: hoursAgo(2) },
];

function minsAgo(m) { return new Date(Date.now() - m * 60000).toISOString(); }
function hoursAgo(h) { return new Date(Date.now() - h * 3600000).toISOString(); }

export async function seed({ force = false } = {}) {
  if (db.data.zones.length && !force) {
    console.log("DB already seeded — skipping (pass --force to reseed).");
    return;
  }
  db.data.zones = riskZones;
  db.data.sensorReadings = sensorReadings;
  db.data.fieldReports = fieldReports;
  db.data.alerts = alerts;
  await db.write();
  console.log(`Seeded ${riskZones.length} zones, ${sensorReadings.length} sensor readings, ${fieldReports.length} field reports, ${alerts.length} alerts.`);
}

// Allow `npm run seed` to run this directly.
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  await seed({ force: process.argv.includes("--force") });
  process.exit(0);
}
