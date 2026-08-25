import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiTriangle } from "react-icons/fi";
import { PiMountainsDuotone } from "react-icons/pi";

export default function DashboardLayout({ roleLabel, roleTag, navItems, children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeBtnRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Close on Escape and return focus to the button that opened the drawer —
  // without this, keyboard users get trapped or lose their place entirely.
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      menuBtnRef.current?.focus();
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-base-deep flex">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-base-line bg-base-panel/60 backdrop-blur-sm sticky top-0 h-screen" aria-label="Main navigation">
        <SidebarContent roleLabel={roleLabel} roleTag={roleTag} navItems={navItems} navigate={navigate} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Main navigation">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-base-panel border-r border-base-line flex flex-col animate-fade-up">
            <div className="flex justify-end p-3">
              <button ref={closeBtnRef} onClick={() => setOpen(false)} aria-label="Close navigation menu" className="p-2 text-ink-mid hover:text-ink-hi">
                <FiX size={20} />
              </button>
            </div>
            <SidebarContent
              roleLabel={roleLabel}
              roleTag={roleTag}
              navItems={navItems}
              navigate={navigate}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 border-b border-base-line bg-base-deep/85 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button ref={menuBtnRef} onClick={() => setOpen(true)} aria-label="Open navigation menu" className="lg:hidden p-2 -ml-2 text-ink-mid hover:text-ink-hi">
              <FiMenu size={22} />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <PiMountainsDuotone className="text-signal" size={20} aria-hidden="true" />
              <span className="font-display font-semibold text-sm tracking-wide">LANDSLIDE GUARD</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-xs font-mono text-ink-mid border border-base-line rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" aria-hidden="true" />
              LIVE MONITORING
            </span>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-ink-mid hover:text-ink-hi border border-base-line hover:border-base-line2 rounded-lg px-3 py-2 transition-colors"
            >
              <FiLogOut size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Switch Role</span>
            </Link>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 md:px-6 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ roleLabel, roleTag, navItems, navigate, onNavigate }) {
  return (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-base-line">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 border border-signal/30 flex items-center justify-center">
            <PiMountainsDuotone className="text-signal" size={20} />
          </div>
          <div>
            <p className="font-display font-semibold text-sm leading-tight tracking-wide">LANDSLIDE GUARD</p>
            <p className="text-[10px] font-mono text-ink-mid tracking-wider">EARLY WARNING SYSTEM</p>
          </div>
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <span className="eyebrow !text-[10px] bg-signal/10 border border-signal/30 rounded-full px-2.5 py-1">
            {roleTag}
          </span>
        </div>
        <p className="text-sm text-ink-hi font-medium mt-2">{roleLabel}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-base-line">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-ink-mid hover:text-ink-hi border border-base-line hover:border-base-line2 rounded-lg py-2.5 transition-colors"
        >
          <FiLogOut size={14} /> Exit to Role Selection
        </button>
        <p className="text-[10px] font-mono text-ink-low text-center mt-3 flex items-center justify-center gap-1">
          <FiTriangle size={9} /> SIH DEMO — FRONTEND ONLY
        </p>
      </div>
    </>
  );
}
