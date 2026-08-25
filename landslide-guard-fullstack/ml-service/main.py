from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import geo, model
from app.schemas import GeoFeatureRequest, RiskFeatures, RiskPrediction, ZoneGeoFeature

app = FastAPI(
    title="Landslide Guard ML Service",
    description=(
        "Landslide risk prediction (XGBoost primary model, Random Forest baseline, "
        "SHAP explainability) plus GeoPandas/Rasterio geospatial feature extraction."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tightened at the Node API layer; this service sits behind it
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup():
    model.load_models()


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": model._xgb_model is not None}


@app.post("/predict", response_model=RiskPrediction)
def predict(features: RiskFeatures):
    try:
        return model.predict(features)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}") from e


@app.post("/zones/geo-features", response_model=list[ZoneGeoFeature])
def zone_geo_features(req: GeoFeatureRequest):
    try:
        return geo.extract_many(req.zone_ids)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Geo feature extraction failed: {e}") from e
