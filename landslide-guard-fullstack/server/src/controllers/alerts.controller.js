import { nanoid } from "nanoid";
import { db, withDb } from "../config/db.js";

function withZoneName(alert) {
  const zone = db.data.zones.find((z) => z.id === alert.zoneId);
  return { ...alert, zone: zone ? zone.name : alert.zoneId };
}

export async function listAlerts(req, res) {
  const { severity, zoneId } = req.query;
  let alerts = [...db.data.alerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (severity) alerts = alerts.filter((a) => a.severity === severity);
  if (zoneId) alerts = alerts.filter((a) => a.zoneId === zoneId);
  res.json({ alerts: alerts.map(withZoneName) });
}

export async function createAlert(req, res) {
  const { zoneId, title, severity, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: "title and message are required." });

  const alert = {
    id: `AL-${nanoid(6).toUpperCase()}`,
    zoneId: zoneId || null,
    title,
    severity: severity || "moderate",
    message,
    createdAt: new Date().toISOString(),
  };
  await withDb((data) => data.alerts.unshift(alert));
  res.status(201).json({ alert });
}
