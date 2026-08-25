import os

import joblib
import numpy as np
import pandas as pd
import shap
from xgboost import XGBRegressor

from .schemas import ModelVote, RiskFeatures, RiskPrediction, ShapFactor
from .train_model import FEATURE_NAMES, MODELS_DIR, TERRAIN_LIST, train

_xgb_model = None
_rf_model = None
_explainer = None

READABLE_FACTOR_NAMES = {
    "rainfall": "Rainfall",
    "soil_moisture": "Soil moisture",
    "slope": "Slope gradient",
    "terrain_encoded": "Terrain condition",
    "historical_events": "Historical landslide events",
}


def _models_exist():
    return os.path.exists(os.path.join(MODELS_DIR, "xgb_model.json")) and os.path.exists(
        os.path.join(MODELS_DIR, "rf_model.joblib")
    )


def load_models():
    """Loads trained models into memory, training them first if this is a fresh checkout."""
    global _xgb_model, _rf_model, _explainer

    if not _models_exist():
        print("No trained models found — training now (one-off, ~10-20s)...")
        train()

    xgb = XGBRegressor()
    xgb.load_model(os.path.join(MODELS_DIR, "xgb_model.json"))
    rf = joblib.load(os.path.join(MODELS_DIR, "rf_model.joblib"))

    _xgb_model = xgb
    _rf_model = rf
    _explainer = shap.TreeExplainer(xgb)
    return _xgb_model, _rf_model, _explainer


def _score_to_level(score: float) -> str:
    if score >= 75:
        return "critical"
    if score >= 55:
        return "high"
    if score >= 30:
        return "moderate"
    return "low"


def _encode(features: RiskFeatures) -> pd.DataFrame:
    terrain_encoded = TERRAIN_LIST.index(features.terrain_condition)
    row = {
        "rainfall": features.rainfall,
        "soil_moisture": features.soil_moisture,
        "slope": features.slope,
        "terrain_encoded": terrain_encoded,
        "historical_events": features.historical_events,
    }
    return pd.DataFrame([row], columns=FEATURE_NAMES)


def predict(features: RiskFeatures) -> RiskPrediction:
    if _xgb_model is None:
        load_models()

    X = _encode(features)

    xgb_score = float(np.clip(_xgb_model.predict(X)[0], 0, 100))
    rf_score = float(np.clip(_rf_model.predict(X)[0], 0, 100))

    # Primary reported score comes from XGBoost; RF is shown as an
    # independent baseline so a judge can see the two models agree
    # (or where they diverge).
    final_score = round(xgb_score, 1)
    final_level = _score_to_level(final_score)

    shap_values = _explainer.shap_values(X)[0]
    factors = [
        ShapFactor(factor=READABLE_FACTOR_NAMES[name], contribution=round(float(val), 2))
        for name, val in zip(FEATURE_NAMES, shap_values)
    ]
    factors.sort(key=lambda f: abs(f.contribution), reverse=True)

    top_positive = [f.factor for f in factors if f.contribution > 0][:3]
    summary = (
        f"Predicted {final_level.upper()} risk ({final_score:.0f}/100). "
        f"Main contributing factors: {', '.join(top_positive) if top_positive else 'none significant'}."
    )

    return RiskPrediction(
        risk_score=final_score,
        risk_level=final_level,
        model_used="xgboost",
        model_votes=[
            ModelVote(model="XGBoost", risk_score=round(xgb_score, 1), risk_level=_score_to_level(xgb_score)),
            ModelVote(model="RandomForest", risk_score=round(rf_score, 1), risk_level=_score_to_level(rf_score)),
        ],
        shap_explanation=factors,
        summary=summary,
    )
