import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRiskMapPage from "./pages/admin/AdminRiskMapPage";
import AdminSensorData from "./pages/admin/AdminSensorData";
import AdminWeather from "./pages/admin/AdminWeather";
import AdminAIPrediction from "./pages/admin/AdminAIPrediction";
import AdminFieldReports from "./pages/admin/AdminFieldReports";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminResponsePriority from "./pages/admin/AdminResponsePriority";

import FieldLayout from "./pages/field/FieldLayout";
import FieldHome from "./pages/field/FieldHome";
import FieldNearbyRisks from "./pages/field/FieldNearbyRisks";
import FieldRiskMapPage from "./pages/field/FieldRiskMapPage";
import FieldReportIssue from "./pages/field/FieldReportIssue";
import FieldMyReports from "./pages/field/FieldMyReports";

import CitizenLayout from "./pages/citizen/CitizenLayout";
import CitizenHome from "./pages/citizen/CitizenHome";
import CitizenNearbyRisks from "./pages/citizen/CitizenNearbyRisks";
import CitizenAlerts from "./pages/citizen/CitizenAlerts";
import CitizenSafeZones from "./pages/citizen/CitizenSafeZones";
import CitizenReport from "./pages/citizen/CitizenReport";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="risk-map" element={<AdminRiskMapPage />} />
              <Route path="sensors" element={<AdminSensorData />} />
              <Route path="weather" element={<AdminWeather />} />
              <Route path="ai-prediction" element={<AdminAIPrediction />} />
              <Route path="field-reports" element={<AdminFieldReports />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="response-priority" element={<AdminResponsePriority />} />
            </Route>

            <Route path="/field" element={<ProtectedRoute><FieldLayout /></ProtectedRoute>}>
              <Route index element={<FieldHome />} />
              <Route path="nearby-risks" element={<FieldNearbyRisks />} />
              <Route path="risk-map" element={<FieldRiskMapPage />} />
              <Route path="report" element={<FieldReportIssue />} />
              <Route path="my-reports" element={<FieldMyReports />} />
            </Route>

            <Route path="/citizen" element={<ProtectedRoute><CitizenLayout /></ProtectedRoute>}>
              <Route index element={<CitizenHome />} />
              <Route path="nearby-risks" element={<CitizenNearbyRisks />} />
              <Route path="alerts" element={<CitizenAlerts />} />
              <Route path="safe-zones" element={<CitizenSafeZones />} />
              <Route path="report" element={<CitizenReport />} />
            </Route>

            <Route path="*" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
