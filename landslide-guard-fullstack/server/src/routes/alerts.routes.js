import { Router } from "express";
import * as ctrl from "../controllers/alerts.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", ctrl.listAlerts);
router.post("/", requireAuth, requireRole("admin"), ctrl.createAlert);

export default router;
