import { nanoid } from "nanoid";
import { db, withDb } from "../config/db.js";

export async function listReports(req, res) {
  const { zoneId, status, reportedBy } = req.query;
  let reports = [...db.data.fieldReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (zoneId) reports = reports.filter((r) => r.zoneId === zoneId);
  if (status) reports = reports.filter((r) => r.status === status);
  if (reportedBy) reports = reports.filter((r) => r.reportedBy === reportedBy);
  res.json({ reports });
}

export async function createReport(req, res) {
  // multipart/form-data (when photos/videos are attached) puts every
  // field on req.body as a string, same as JSON — so this reads the
  // same either way. Attachments land on req.files via multer.
  const { zoneId, title, location, type, severity, reportedBy, description } = req.body;
  if (!title || !type) return res.status(400).json({ error: "title and type are required." });

  const images = (req.files || []).map((f) => `/uploads/reports/${f.filename}`);

  const report = {
    id: `FR-${nanoid(6).toUpperCase()}`,
    zoneId: zoneId || null,
    title,
    location: location || "Unknown location",
    type,
    severity: severity || "moderate",
    reportedBy: reportedBy || req.user?.email || "Citizen Report",
    description: description || "",
    images,
    status: "Submitted",
    createdAt: new Date().toISOString(),
  };
  await withDb((data) => data.fieldReports.unshift(report));
  res.status(201).json({ report });
}

export async function updateReportStatus(req, res) {
  const { status } = req.body;
  if (!["Submitted", "Under Review", "Verified", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const report = db.data.fieldReports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: "Report not found." });

  await withDb(() => { report.status = status; });
  res.json({ report });
}
