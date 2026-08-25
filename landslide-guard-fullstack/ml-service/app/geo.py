import os

import geopandas as gpd
import numpy as np
import rasterio
from shapely.geometry import Point

from .generate_geo_data import make_dem, make_villages
from .schemas import ZoneGeoFeature

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
DEM_PATH = os.path.join(DATA_DIR, "dem.tif")
VILLAGES_PATH = os.path.join(DATA_DIR, "villages.geojson")

# Zone reference points — mirrors server/src/utils/seed.js so the two
# services agree on where each zone is without needing a shared DB call.
ZONES = {
    "zone-a": {"name": "Zone A — Sohra Ridge", "lat": 25.2669, "lng": 91.7320},
    "zone-b": {"name": "Zone B — Mawkyrwat Slope", "lat": 25.3080, "lng": 91.2170},
    "zone-c": {"name": "Zone C — Kohima Bypass", "lat": 25.6751, "lng": 94.1086},
    "zone-d": {"name": "Zone D — Aizawl Hillside", "lat": 23.7271, "lng": 92.7176},
    "zone-e": {"name": "Zone E — Itanagar Foothills", "lat": 27.0844, "lng": 93.6053},
    "zone-f": {"name": "Zone F — Gangtok Ridge Road", "lat": 27.3389, "lng": 88.6065},
    "zone-g": {"name": "Zone G — Along Highway", "lat": 28.1667, "lng": 94.8000},
    "zone-h": {"name": "Zone H — Haflong Slopes", "lat": 25.1667, "lng": 93.0167},
}

_villages_gdf = None


def _ensure_data():
    if not (os.path.exists(DEM_PATH) and os.path.exists(VILLAGES_PATH)):
        print("Geo demo data missing — generating synthetic DEM + villages layer...")
        make_dem()
        make_villages()


def _load_villages():
    global _villages_gdf
    if _villages_gdf is None:
        _ensure_data()
        _villages_gdf = gpd.read_file(VILLAGES_PATH)
        # Project to a metric CRS (Web Mercator) so distance math is in meters.
        _villages_gdf = _villages_gdf.to_crs(epsg=3857)
    return _villages_gdf


def extract_zone_features(zone_id: str, window_px: int = 6) -> ZoneGeoFeature:
    """
    For a given zone:
      * reads a small window of the DEM around the zone's coordinates (rasterio)
      * computes mean/max elevation and a derived slope from the elevation gradient
      * uses GeoPandas to count villages within a 15km buffer and find the nearest one
    """
    _ensure_data()
    zone = ZONES.get(zone_id)
    if zone is None:
        raise ValueError(f"Unknown zone_id: {zone_id}")

    with rasterio.open(DEM_PATH) as dem:
        row, col = dem.index(zone["lng"], zone["lat"])
        r0, r1 = max(0, row - window_px), min(dem.height, row + window_px)
        c0, c1 = max(0, col - window_px), min(dem.width, col + window_px)
        window = dem.read(1, window=((r0, r1), (c0, c1)))

        mean_elev = float(np.mean(window))
        max_elev = float(np.max(window))

        # Derived slope from the elevation gradient across the window,
        # converted from a rise/run ratio (in raster cell units) to degrees.
        gy, gx = np.gradient(window)
        cellsize_deg = dem.transform.a  # degrees per pixel (approx, EPSG:4326)
        cellsize_m = max(cellsize_deg * 111_000, 1e-6)
        slope_rad = np.arctan(np.sqrt(gx**2 + gy**2) / cellsize_m)
        derived_slope = float(np.degrees(np.mean(slope_rad)))

    villages = _load_villages()
    zone_point = gpd.GeoSeries([Point(zone["lng"], zone["lat"])], crs="EPSG:4326").to_crs(epsg=3857).iloc[0]
    distances_km = villages.geometry.distance(zone_point) / 1000.0

    nearby = int((distances_km <= 15).sum())
    nearest = float(distances_km.min()) if len(distances_km) else None

    return ZoneGeoFeature(
        zone_id=zone_id,
        name=zone["name"],
        mean_elevation_m=round(mean_elev, 1),
        max_elevation_m=round(max_elev, 1),
        derived_slope_deg=round(derived_slope, 1),
        nearby_villages=nearby,
        nearest_village_km=round(nearest, 2) if nearest is not None else None,
    )


def extract_many(zone_ids: list[str]) -> list[ZoneGeoFeature]:
    return [extract_zone_features(zid) for zid in zone_ids if zid in ZONES]
