import { useNavigate } from "react-router-dom";
import { PiMountainsDuotone } from "react-icons/pi";
import { FiShield, FiUsers, FiActivity, FiArrowRight, FiLogOut } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const roles = [
  {
    key: "admin",
    title: "Admin",
    tag: "Command Center",
    tagline: "Monitor, Analyse & Manage",
    description:
      "Full regional oversight — risk maps, sensor networks, AI predictions, field reports and emergency response coordination.",
    icon: FiShield,
    to: "/admin",
    stat: { label: "Zones Monitored", value: "85" },
  },
  {
    key: "field",
    title: "Field Officer",
    tag: "Ground Operations",
    tagline: "Observe, Report & Update",
    description:
      "On-ground condition checks, incident reporting with photo/GPS capture, and real-time visibility into nearby risk zones.",
    icon: HiOutlineOfficeBuilding,
    to: "/field",
    stat: { label: "Active Officers", value: "142" },
  },
  {
    key: "citizen",
    title: "Citizen",
    tag: "Community Access",
    tagline: "Stay Safe, Receive Alerts & Report",
    description:
      "Local risk status, early warning alerts, nearest safe zones, and a simple way to report incidents in your area.",
    icon: FiUsers,
    to: "/citizen",
    stat: { label: "Residents Reached", value: "24K+" },
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-base-deep flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 border border-signal/30 flex items-center justify-center">
            <PiMountainsDuotone className="text-signal" size={20} aria-hidden="true" />
          </div>
          <span className="font-display font-semibold tracking-wide text-sm">LANDSLIDE GUARD</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-ink-mid border border-base-line rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" aria-hidden="true" />
            SYSTEM ONLINE
          </span>
          {user && (
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-mid hover:text-ink-hi border border-base-line hover:border-base-line2 rounded-lg px-3 py-2 transition-colors"
            >
              <FiLogOut size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="contour-field flex-1 flex flex-col items-center justify-center text-center px-6 py-14 md:py-20">
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-up">
          <p className="eyebrow mb-4">North Eastern Region &middot; Disaster Management Platform</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight text-ink-hi">
            LANDSLIDE <span className="text-signal">GUARD</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-ink-mid font-medium">
            {user ? `Welcome back, ${user.name}` : "AI-Powered Landslide Early Warning & Monitoring Platform"}
          </p>
          <p className="mt-3 text-sm md:text-[15px] text-ink-mid/90 max-w-xl mx-auto leading-relaxed">
            Monitor vulnerable areas, identify landslide risks, receive early warnings and support faster
            emergency response — across the terrain-sensitive districts of the North East.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-ink-mid flex-wrap">
            <span className="flex items-center gap-1.5"><FiActivity size={13} className="text-signal" /> Live sensor feed</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-risk-critical" /> 5 critical zones active</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-risk-high" /> 12 high risk zones</span>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="px-6 md:px-10 pb-16 md:pb-24 -mt-2">
        <p className="text-center eyebrow mb-6">Select Your Role To Continue</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {roles.map((role, i) => (
            <button
              key={role.key}
              onClick={() => navigate(role.to)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group glass-card text-left p-6 flex flex-col animate-fade-up"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-signal/10 border border-signal/25 flex items-center justify-center group-hover:bg-signal/20 group-hover:border-signal/50 transition-colors">
                  <role.icon className="text-signal" size={22} />
                </div>
                <span className="eyebrow !text-[10px]">{role.tag}</span>
              </div>

              <h3 className="font-display text-xl font-semibold text-ink-hi">{role.title}</h3>
              <p className="text-signal text-sm font-medium mt-0.5">{role.tagline}</p>
              <p className="text-sm text-ink-mid mt-3 leading-relaxed flex-1">{role.description}</p>

              <div className="mt-5 pt-4 border-t border-base-line flex items-center justify-between">
                <div>
                  <p className="data-num text-lg font-semibold text-ink-hi">{role.stat.value}</p>
                  <p className="text-[10px] font-mono text-ink-mid uppercase tracking-wide">{role.stat.label}</p>
                </div>
                <span className="w-9 h-9 rounded-full border border-base-line2 flex items-center justify-center text-ink-mid group-hover:text-signal group-hover:border-signal/50 group-hover:translate-x-0.5 transition-all">
                  <FiArrowRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="text-center pb-6">
        <p className="text-[11px] font-mono text-ink-low">Smart India Hackathon &middot; Frontend Prototype &middot; Mock Data Only</p>
      </footer>
    </div>
  );
}
