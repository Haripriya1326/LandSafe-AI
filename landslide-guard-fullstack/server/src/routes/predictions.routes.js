import { Router } from "express";
import * as ctrl from "../controllers/predictions.controller.js";

const router = Router();

router.post("/predict", ctrl.predict);
router.get("/history", ctrl.history);
router.get("/geo-features", ctrl.geoFeatures);
router.get("/health", ctrl.health);

export default router;
