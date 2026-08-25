import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import { FiHome, FiAlertTriangle, FiBell, FiShield, FiEdit3 } from "react-icons/fi";

const navItems = [
  { to: "/citizen", label: "Home", icon: FiHome, end: true },
  { to: "/citizen/nearby-risks", label: "Nearby Risks", icon: FiAlertTriangle },
  { to: "/citizen/alerts", label: "Alerts", icon: FiBell },
  { to: "/citizen/safe-zones", label: "Safe Zones", icon: FiShield },
  { to: "/citizen/report", label: "Report Issue", icon: FiEdit3 },
];

export default function CitizenLayout() {
  return (
    <DashboardLayout roleLabel="Resident — Sohra Ridge Area" roleTag="CITIZEN" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
}
