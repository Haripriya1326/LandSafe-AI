# LANDSLIDE GUARD

AI-powered landslide early-warning & monitoring platform — SIH hackathon frontend prototype.
**Frontend only.** No backend, no database, no auth, no real AI/ML, no API keys. All data is mock data in `src/data/mockData.js`.

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router (HashRouter)
- Leaflet + React-Leaflet (OpenStreetMap GIS map)
- Recharts (charts)
- React Icons

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:
```bash
npm run build
npm run preview
```

## Structure

```
src/
  components/
    common/       # RiskBadge, RiskMap, ReportForm, DashboardLayout, Toast, etc. (shared across roles)
  data/
    mockData.js   # ALL mock data lives here — swap for real API calls later
  pages/
    Landing.jsx   # Role selection landing page
    admin/        # Admin Dashboard, Risk Map, Sensor Data, Weather, AI Prediction,
                  # Field Reports, Alert Center, Response Priority
    field/        # Field Officer Home, Nearby Risks, Risk Map, Report Issue, My Reports
    citizen/      # Citizen Home, Nearby Risks, Alerts, Safe Zones, Report Issue
  App.jsx         # All routes
  main.jsx        # Entry point
  index.css       # Tailwind + design tokens + contour-line signature texture
```

## Notes
- The "AI Risk Prediction" module is a deterministic frontend simulation (`simulateRiskAnalysis` in `mockData.js`) — no real model is called, per hackathon requirements.
- GPS "Use Current Location" and photo/video upload are UI simulations (no backend upload).
- All navigation, filtering, map popups, and form submissions work entirely client-side with React state.
