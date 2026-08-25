"""
Trains the landslide risk models used by the FastAPI service.

There is no public real-time labelled landslide-risk dataset bundled with
this SIH prototype, so this script generates a synthetic-but-domain-informed
dataset: risk score is a function of rainfall, soil moisture, slope,
terrain condition and historical event count, with Gaussian noise added so
the models learn a genuinely non-trivial (non-linear, interaction-heavy)
mapping rather than memorizing a formula.

Run:
    python -m app.train_model

Produces (in ml-service/models/):
    xgb_model.json         - primary XGBoost regressor
    rf_model.joblib         - Random Forest baseline/comparison regressor
    feature_meta.joblib     - feature names + terrain encoding used at inference
"""

import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

TERRAIN_BONUS = {
    "Stable": 0,
    "Loose / Eroding": 5,
    "Saturated": 6,
    "Visible Cracking": 8,
    "Recently Disturbed": 4,
}
TERRAIN_LIST = list(TERRAIN_BONUS.keys())
FEATURE_NAMES = ["rainfall", "soil_moisture", "slope", "terrain_encoded", "historical_events"]


def synthesize_dataset(n=6000, seed=42):
    rng = np.random.default_rng(seed)
    rainfall = rng.uniform(0, 300, n)
    soil_moisture = rng.uniform(0, 100, n)
    slope = rng.uniform(0, 60, n)
    terrain = rng.choice(TERRAIN_LIST, n)
    historical_events = rng.poisson(1.2, n)

    terrain_encoded = np.array([TERRAIN_LIST.index(t) for t in terrain])
    terrain_bonus = np.array([TERRAIN_BONUS[t] for t in terrain])

    base = (
        np.minimum(rainfall / 200, 1) * 35
        + np.minimum(soil_moisture / 100, 1) * 30
        + np.minimum(slope / 50, 1) * 25
        + terrain_bonus
        + np.minimum(historical_events, 8) * 1.5
    )
    # A mild interaction term: saturated soil + steep slope compounds risk.
    interaction = (soil_moisture / 100) * (slope / 60) * 8
    noise = rng.normal(0, 4, n)

    score = np.clip(base + interaction + noise, 0, 98)

    df = pd.DataFrame(
        {
            "rainfall": rainfall,
            "soil_moisture": soil_moisture,
            "slope": slope,
            "terrain_encoded": terrain_encoded,
            "historical_events": historical_events,
            "risk_score": score,
        }
    )
    return df


def train():
    df = synthesize_dataset()
    X = df[FEATURE_NAMES]
    y = df["risk_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    xgb = XGBRegressor(
        n_estimators=250,
        max_depth=4,
        learning_rate=0.06,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        objective="reg:squarederror",
        # Explicit (non-auto-computed) base_score avoids a known shap<->xgboost
        # JSON serialization bug where an auto-computed base_score is dumped
        # in scientific-notation array form (e.g. "[6.1E1]") that shap's
        # TreeExplainer can't parse back into a float.
        base_score=0.5,
    )
    xgb.fit(X_train, y_train)

    rf = RandomForestRegressor(n_estimators=300, max_depth=8, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)

    for name, model in [("XGBoost", xgb), ("RandomForest", rf)]:
        preds = model.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        print(f"{name}: MAE={mae:.2f}  R2={r2:.3f}")

    xgb.save_model(os.path.join(MODELS_DIR, "xgb_model.json"))
    joblib.dump(rf, os.path.join(MODELS_DIR, "rf_model.joblib"))
    joblib.dump(
        {"feature_names": FEATURE_NAMES, "terrain_list": TERRAIN_LIST},
        os.path.join(MODELS_DIR, "feature_meta.joblib"),
    )
    print(f"Saved models to {MODELS_DIR}")


if __name__ == "__main__":
    train()
