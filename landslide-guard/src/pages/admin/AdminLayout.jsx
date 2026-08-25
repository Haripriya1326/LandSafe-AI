import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import {
  FiGrid, FiMap, FiActivity, FiCloudRain, FiCpu, FiClipboard, FiBell, FiAlertOctagon,
} from "react-icons/fi";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/risk-map", label: "Risk Map", icon: FiMap },
  { to: "/admin/sensors", label: "Sensor Data", icon: FiActivity },
  { to: "/admin/weather", label: "Weather", icon: FiCloudRain },
  { to: "/admin/ai-prediction", label: "AI Prediction", icon: FiCpu },
  { to: "/admin/field-reports", label: "Field Reports", icon: FiClipboard },
  { to: "/admin/alerts", label: "Alerts", icon: FiBell },
  { to: "/admin/response-priority", label: "Response Priority", icon: FiAlertOctagon },
];

export default function AdminLayout() {
  return (
    <DashboardLayout roleLabel="Regional Control Room" roleTag="ADMIN" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
}
