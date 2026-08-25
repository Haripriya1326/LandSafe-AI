import { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { FiCrosshair, FiHome, FiMaximize, FiMinimize, FiSearch, FiX } from "react-icons/fi";
import { RISK_LEVELS, riskZones } from "../../data/mockData";
import RiskBadge from "./RiskBadge";
import { useToast } from "./ToastContext";

// Critical/high zones get a visibly larger, heavier-outlined marker so
// severity reads from map scale at a glance — not from color alone, which
// is easy to misjudge on a small screen, in glare, or for colorblind users.
const MARKER_STYLE = {
  low: { radius: 8, weight: 1.5 },
  moderate: { radius: 9, weight: 2 },
  high: { radius: 12, weight: 2.5 },
  critical: { radius: 15, weight: 3 },
};

// India's bounding box — the map fits this exactly on load and can't be
// panned meaningfully past it, so this only ever shows India, never a
// zoomed-out world view.
const INDIA_BOUNDS = [
  [6.0, 68.0],   // SW
  [37.6, 97.5],  // NE
];

function withinIndia(lat, lng) {
  return lat >= 6.0 && lat <= 37.6 && lng >= 68.0 && lng <= 97.5;
}

export default function RiskMap({ height = "480px", onSelectZone, zones = riskZones }) {
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const containerRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const { showToast } = useToast();

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return zones.filter((z) => z.name.toLowerCase().includes(q) || z.district.toLowerCase().includes(q)).slice(0, 6);
  }, [query, zones]);

  function recenter() {
    mapRef.current?.flyToBounds(INDIA_BOUNDS, { padding: [16, 16], duration: 0.6 });
  }

  function locateMe() {
    if (!navigator.geolocation) {
      showToast("Location isn't available in this browser.", "info");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        if (!withinIndia(latitude, longitude)) {
          showToast("Your location is outside the monitored India region.", "info");
          return;
        }
        mapRef.current?.flyTo([latitude, longitude], 9, { duration: 0.8 });
      },
      () => {
        setLocating(false);
        showToast("Couldn't access your location. Check browser permissions.", "warning");
      }
    );
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => {});
    }
  }

  function jumpToZone(z) {
    onSelectZone && onSelectZone(z);
    mapRef.current?.flyTo([z.lat, z.lng], 10, { duration: 0.8 });
    markerRefs.current[z.id]?.openPopup();
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <div style={{ height: fullscreen ? "100vh" : height }} className="rounded-2xl overflow-hidden border border-base-line">
        <MapContainer
          ref={mapRef}
          bounds={INDIA_BOUNDS}
          boundsOptions={{ padding: [16, 16] }}
          minZoom={4}
          maxBounds={[[-5, 50], [48, 115]]}
          maxBoundsViscosity={0.8}
          worldCopyJump={false}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />
          {zones.map((z) => (
            <CircleMarker
              key={z.id}
              ref={(el) => { if (el) markerRefs.current[z.id] = el; }}
              center={[z.lat, z.lng]}
              radius={MARKER_STYLE[z.risk]?.radius ?? 11}
              pathOptions={{
                color: RISK_LEVELS[z.risk].color,
                fillColor: RISK_LEVELS[z.risk].color,
                fillOpacity: 0.55,
                weight: MARKER_STYLE[z.risk]?.weight ?? 2,
              }}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(z),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                {z.name}
              </Tooltip>
              <Popup>
                <div className="space-y-1.5 min-w-[190px]">
                  <p className="font-display font-semibold text-sm text-ink-hi">{z.name}</p>
                  <p className="text-[11px] text-ink-mid -mt-1">{z.district}</p>
                  <div className="pt-1">
                    <RiskBadge level={z.risk} size="sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono text-ink-mid pt-1.5 border-t border-base-line">
                    <span>Rainfall</span><span className="text-ink-hi text-right">{z.rainfall} mm</span>
                    <span>Soil Moisture</span><span className="text-ink-hi text-right">{z.soilMoisture}%</span>
                    <span>Slope</span><span className="text-ink-hi text-right">{z.slope}&deg;</span>
                    <span>Road</span><span className="text-ink-hi text-right">{z.roadStatus}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Fast-access toolbar */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5">
          {searchOpen && (
            <div className="relative animate-fade-up">
              <div className="flex items-center gap-2 glass-panel !rounded-lg pl-3 pr-2 py-1.5 w-52 sm:w-64">
                <FiSearch size={14} className="text-ink-mid shrink-0" aria-hidden="true" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to zone or district…"
                  aria-label="Search zones"
                  className="w-full bg-transparent text-xs text-ink-hi placeholder:text-ink-low outline-none"
                />
                <button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search" className="text-ink-mid hover:text-ink-hi shrink-0">
                  <FiX size={14} />
                </button>
              </div>
              {matches.length > 0 && (
                <div className="absolute top-full mt-1.5 right-0 w-full glass-panel !rounded-lg overflow-hidden">
                  {matches.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => jumpToZone(z)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-base-panel2 transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="truncate">
                        <span className="text-ink-hi">{z.name}</span>
                        <span className="text-ink-mid"> — {z.district}</span>
                      </span>
                      <RiskBadge level={z.risk} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {!searchOpen && (
            <button onClick={() => setSearchOpen(true)} aria-label="Search zones" title="Search zones" className="icon-btn">
              <FiSearch size={15} />
            </button>
          )}
          <button onClick={locateMe} disabled={locating} aria-label="Locate me" title="Locate me" className="icon-btn">
            <FiCrosshair size={15} className={locating ? "animate-spin" : ""} />
          </button>
          <button onClick={recenter} aria-label="Recenter on India" title="Recenter on India" className="icon-btn">
            <FiHome size={15} />
          </button>
          <button onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} title={fullscreen ? "Exit fullscreen" : "Fullscreen"} className="icon-btn">
            {fullscreen ? <FiMinimize size={15} /> : <FiMaximize size={15} />}
          </button>
        </div>
      </div>

      {/* Legend — dot size scales with severity to mirror the map markers,
          so the size/color combination (not color alone) carries meaning. */}
      <div
        className="absolute bottom-4 left-4 z-[400] glass-panel !rounded-xl px-3.5 py-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-mono"
        role="list"
        aria-label="Risk level legend"
      >
        {Object.entries(RISK_LEVELS).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-ink-mid" role="listitem">
            <span
              className="rounded-full shrink-0"
              style={{
                backgroundColor: cfg.color,
                width: (MARKER_STYLE[key]?.radius ?? 11) * 0.9,
                height: (MARKER_STYLE[key]?.radius ?? 11) * 0.9,
              }}
              aria-hidden="true"
            />
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}
