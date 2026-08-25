"""
Generates a small synthetic DEM (GeoTIFF, read via rasterio) and a villages
vector layer (GeoJSON, read via geopandas) covering the same North-East
India bounding box used by the zone mock data in the frontend.

There's no licensed satellite/DEM source bundled with this prototype, so
elevation is a smooth synthetic terrain (Perlin-ish via layered sine waves)
seeded so it's deterministic across runs. Swap `data/dem.tif` for a real
SRTM/Bhoomi DEM clip and `data/villages.geojson` for a real settlements
layer in production — `geo.py` doesn't need to change.

Run:
    python -m app.generate_geo_data
"""

import os

import geopandas as gpd
import numpy as np
import rasterio
from rasterio.transform import from_bounds
from shapely.geometry import Point

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Rough bounding box covering the NE-India zones used in mock/seed data.
BOUNDS = {"min_lon": 88.0, "min_lat": 23.0, "max_lon": 95.5, "max_lat": 28.5}
WIDTH, HEIGHT = 400, 400


def make_dem():
    rng = np.random.default_rng(7)
    x = np.linspace(0, 8 * np.pi, WIDTH)
    y = np.linspace(0, 8 * np.pi, HEIGHT)
    xx, yy = np.meshgrid(x, y)

    elevation = (
        800
        + 500 * np.sin(xx * 0.6) * np.cos(yy * 0.4)
        + 300 * np.sin(xx * 1.3 + 1.0)
        + 200 * np.cos(yy * 1.7 + 0.5)
        + rng.normal(0, 40, (HEIGHT, WIDTH))
    )
    elevation = np.clip(elevation, 50, 2800).astype("float32")

    transform = from_bounds(
        BOUNDS["min_lon"], BOUNDS["min_lat"], BOUNDS["max_lon"], BOUNDS["max_lat"], WIDTH, HEIGHT
    )
    out_path = os.path.join(DATA_DIR, "dem.tif")
    with rasterio.open(
        out_path,
        "w",
        driver="GTiff",
        height=HEIGHT,
        width=WIDTH,
        count=1,
        dtype="float32",
        crs="EPSG:4326",
        transform=transform,
    ) as dst:
        dst.write(elevation, 1)
    print(f"Wrote DEM raster: {out_path}")


def make_villages():
    rng = np.random.default_rng(11)
    n = 120
    lons = rng.uniform(BOUNDS["min_lon"], BOUNDS["max_lon"], n)
    lats = rng.uniform(BOUNDS["min_lat"], BOUNDS["max_lat"], n)
    names = [f"Village {i+1}" for i in range(n)]
    population = rng.integers(50, 2000, n)

    gdf = gpd.GeoDataFrame(
        {"name": names, "population": population},
        geometry=[Point(lon, lat) for lon, lat in zip(lons, lats)],
        crs="EPSG:4326",
    )
    out_path = os.path.join(DATA_DIR, "villages.geojson")
    gdf.to_file(out_path, driver="GeoJSON")
    print(f"Wrote villages vector layer: {out_path} ({n} villages)")


if __name__ == "__main__":
    make_dem()
    make_villages()
