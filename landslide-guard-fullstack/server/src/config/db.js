import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ------------------------------------------------------------------
// Embedded JSON database (lowdb) for the SIH prototype.
//
// This keeps the demo zero-config: no external DB server to install.
// The data shape below is deliberately identical to what a real
// PostgreSQL + PostGIS schema would hold (see /server/README.md for
// the production migration notes), so swapping this file for a real
// `pg` pool later does not require changing any route/controller code
// beyond the model layer.
// ------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "..", "data", "db.json");

const defaultData = {
  users: [],
  zones: [],
  sensorReadings: [],
  fieldReports: [],
  alerts: [],
  predictions: [],
};

export const db = await JSONFilePreset(dbFile, defaultData);

export async function withDb(fn) {
  const result = await fn(db.data);
  await db.write();
  return result;
}
