import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

// ------------------------------------------------------------------
// Handles photo/video attachments on field & citizen reports.
//
// Deliberately has NO `limits.fileSize` — field officers upload
// straight from a phone camera in areas with patchy connectivity,
// and rejecting a report over an arbitrary KB/MB cap defeats the
// purpose of ground reporting. Disk space is the only real ceiling,
// so this is intentionally left uncapped rather than set "high".
// ------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "reports");

fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ROOT),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${nanoid(8)}${ext}`);
  },
});

const ALLOWED_MIME = /^(image\/|video\/)/;

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.test(file.mimetype)) {
    return cb(new Error("Only image or video files are allowed."));
  }
  cb(null, true);
}

// No `limits` key => no file size restriction.
export const uploadReportMedia = multer({ storage, fileFilter });
