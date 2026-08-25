import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { seed } from "./utils/seed.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { startSensorSimulation } from "./services/simulate.js";

import authRoutes from "./routes/auth.routes.js";
import zonesRoutes from "./routes/zones.routes.js";
import sensorsRoutes from "./routes/sensors.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import prioritiesRoutes from "./routes/priorities.routes.js";
import predictionsRoutes from "./routes/predictions.routes.js";
import weatherRoutes from "./routes/weather.routes.js";

await seed(); // no-op if already seeded

// Simulates a fresh sensor reading (rainfall/soil moisture/temperature/
// slope) for every zone once a minute, standing in for real IoT hardware.
startSensorSimulation();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

// Serve uploaded report photos/videos (e.g. /uploads/reports/xxx.jpg).
// crossOriginResourcePolicy is relaxed here so the Vite dev origin can
// load these images directly (helmet defaults to same-origin only).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"),
  })
);

app.get("/", (req, res) => {
  res.json({
    name: "Landslide Guard API",
    status: "ok",
    stack: [
      "Node.js",
      "Express",
      "JWT",
      "lowdb",
      "FastAPI ml-service (XGBoost, RandomForest, SHAP, GeoPandas, Rasterio)",
      "Open-Meteo (live rainfall/weather)",
      "NASA GIBS/Worldview (satellite imagery)",
      "Simulated sensor network (rainfall/soil moisture/temperature/slope)",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/zones", zonesRoutes);
app.use("/api/sensors", sensorsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/priorities", prioritiesRoutes);
app.use("/api/weather", weatherRoutes); // live Open-Meteo forecast + NASA GIBS/Worldview satellite views
app.use("/api", predictionsRoutes); // /api/predict, /api/history, /api/geo-features, /api/health

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🟢 Landslide Guard API listening on http://localhost:${PORT}`);
});
