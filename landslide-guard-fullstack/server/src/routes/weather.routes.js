import { Router } from "express";
import * as ctrl from "../controllers/weather.controller.js";

const router = Router();

// GET /api/weather?zoneId=zone-a  (or ?lat=..&lng=..)
router.get("/", ctrl.getWeather);

// GET /api/weather/satellite?zoneId=zone-a[&date=YYYY-MM-DD]
router.get("/satellite", ctrl.getSatellite);

export default router;
