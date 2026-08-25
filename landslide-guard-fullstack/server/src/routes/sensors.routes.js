import { Router } from "express";
import * as ctrl from "../controllers/sensors.controller.js";

const router = Router();

router.get("/", ctrl.listSensorCards);
router.post("/ingest", ctrl.ingestReading);
router.post("/simulate", ctrl.simulateReading);

export default router;
