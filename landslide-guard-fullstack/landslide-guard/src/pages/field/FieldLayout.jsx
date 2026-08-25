import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import { FiHome, FiAlertTriangle, FiMap, FiEdit3, FiClipboard } from "react-icons/fi";

const navItems = [
  { to: "/field", label: "Home", icon: FiHome, end: true },
  { to: "/field/nearby-risks", label: "Nearby Risks", icon: FiAlertTriangle },
  { to: "/field/risk-map", label: "Risk Map", icon: FiMap },
  { to: "/field/report", label: "Report Issue", icon: FiEdit3 },
  { to: "/field/my-reports", label: "My Reports", icon: FiClipboard },
];

export default function FieldLayout() {
  return (
    <DashboardLayout roleLabel="R. Lyngdoh — Field Unit 4" roleTag="FIELD OFFICER" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
}
