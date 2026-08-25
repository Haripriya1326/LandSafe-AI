// ------------------------------------------------------------------
// NASA GIBS (Global Imagery Browse Services) / Worldview.
//
// No API key required. GIBS' "Snapshots" REST endpoint renders a flat
// image for a bounding box + date + layer, which is exactly what
// Worldview itself uses under the hood — so an <img src=...> pointed
// at it gives a genuine NASA Worldview-style satellite view without
// needing to embed the full Worldview app. We also return a deep link
// to the real worldview.earthdata.nasa.gov site, centered on the same
// spot, for "open full view".
//
// Docs: https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers
// ------------------------------------------------------------------

const SNAPSHOT_BASE = "https://wvs.earthdata.nasa.gov/api/v1/snapshot";
const WORLDVIEW_BASE = "https://worldview.earthdata.nasa.gov";

// GIBS imagery has a short processing lag — true-color MODIS/VIIRS
// layers for "today" often aren't published yet, so default to
// yesterday (UTC) unless the caller passes an explicit date.
function defaultImageryDate() {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// ~1.1 degrees of lat/lng padding is roughly a 120km x 120km window
// around the zone, which is enough context to see the surrounding
// terrain/cloud cover without shrinking the zone to a speck.
function bboxAround(lat, lng, paddingDeg = 1.1) {
  const south = Number(lat) - paddingDeg;
  const north = Number(lat) + paddingDeg;
  const west = Number(lng) - paddingDeg;
  const east = Number(lng) + paddingDeg;
  return { south, north, west, east };
}

export function buildSatelliteViews({ lat, lng, date } = {}) {
  const imageryDate = date || defaultImageryDate();
  const { south, north, west, east } = bboxAround(lat, lng);
  const bboxParam = `${south},${west},${north},${east}`;

  const trueColor = new URLSearchParams({
    REQUEST: "GetSnapshot",
    TIME: imageryDate,
    BBOX: bboxParam,
    CRS: "EPSG:4326",
    LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor,Coastlines",
    FORMAT: "image/jpeg",
    WIDTH: 640,
    HEIGHT: 640,
  });

  const precipitationOverlay = new URLSearchParams({
    REQUEST: "GetSnapshot",
    TIME: imageryDate,
    BBOX: bboxParam,
    CRS: "EPSG:4326",
    LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor,IMERG_Precipitation_Rate,Coastlines",
    FORMAT: "image/jpeg",
    WIDTH: 640,
    HEIGHT: 640,
  });

  const worldviewParams = new URLSearchParams({
    v: `${west},${south},${east},${north}`,
    t: imageryDate,
    l: "MODIS_Terra_CorrectedReflectance_TrueColor,IMERG_Precipitation_Rate,Coastlines",
  });

  return {
    date: imageryDate,
    bbox: { south, north, west, east },
    trueColorUrl: `${SNAPSHOT_BASE}?${trueColor.toString()}`,
    precipitationOverlayUrl: `${SNAPSHOT_BASE}?${precipitationOverlay.toString()}`,
    worldviewUrl: `${WORLDVIEW_BASE}/?${worldviewParams.toString()}`,
  };
}
