from typing import Literal, Optional
from pydantic import BaseModel, Field


class RiskFeatures(BaseModel):
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm (last 24h)")
    soil_moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    slope: float = Field(..., ge=0, le=90, description="Terrain slope in degrees")
    terrain_condition: Literal[
        "Stable", "Loose / Eroding", "Saturated", "Visible Cracking", "Recently Disturbed"
    ] = "Stable"
    historical_events: int = Field(0, ge=0, le=50, description="Past landslide events recorded nearby")


class ShapFactor(BaseModel):
    factor: str
    contribution: float  # signed SHAP value, positive = increases risk


class ModelVote(BaseModel):
    model: str
    risk_score: float
    risk_level: str


class RiskPrediction(BaseModel):
    risk_score: float
    risk_level: Literal["low", "moderate", "high", "critical"]
    model_used: str = "xgboost"
    model_votes: list[ModelVote]
    shap_explanation: list[ShapFactor]
    summary: str


class GeoFeatureRequest(BaseModel):
    zone_ids: list[str]


class ZoneGeoFeature(BaseModel):
    zone_id: str
    name: Optional[str] = None
    mean_elevation_m: float
    max_elevation_m: float
    derived_slope_deg: float
    nearby_villages: int
    nearest_village_km: Optional[float] = None
