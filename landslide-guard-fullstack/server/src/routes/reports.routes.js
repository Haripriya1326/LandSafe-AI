import { Router } from "express";
import * as ctrl from "../controllers/reports.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadReportMedia } from "../middleware/upload.js";

const router = Router();

router.get("/", ctrl.listReports);
router.post("/", uploadReportMedia.array("images"), ctrl.createReport);
router.patch("/:id/status", requireAuth, requireRole("admin", "field"), ctrl.updateReportStatus);

export default router;
