import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Settings, LogOut, Menu, X, Zap } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Settings",   to: "/settings",  icon: Settings },
  ];

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ background: "#000" }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          flex flex-col
          w-60
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "rgba(2,77,96,0.15)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(117,226,224,0.15)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6" style={{ borderBottom: "1px solid rgba(117,226,224,0.1)" }}>
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: "linear-gradient(135deg,#024D60,#2CACAO)" }}
          >
            <Zap size={18} style={{ color: "#D9F5F0" }} />
          </div>
          <span style={{ color: "#D9F5F0", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.02em" }}>
            FocusADHD
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User bottom */}
        <div
          className="p-4 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(117,226,224,0.1)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{
              background: "linear-gradient(135deg,#1C4EA7,#2CACAO)",
              color: "#D9F5F0",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#D9F5F0" }}>
              {displayName}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="flex-shrink-0 p-1.5 rounded-lg transition-all"
            style={{ color: "rgba(117,226,224,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef5350")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(117,226,224,0.6)")}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* ── Mobile topbar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(117,226,224,0.12)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "linear-gradient(135deg,#024D60,#2CACAO)" }}
          >
            <Zap size={15} style={{ color: "#D9F5F0" }} />
          </div>
          <span style={{ color: "#D9F5F0", fontWeight: 800, fontSize: "1rem" }}>FocusADHD</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ color: "#75E2E0" }}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Main content ── */}
      <main
        id="main-content"
        className="flex-1 lg:ml-60 min-h-screen pt-14 lg:pt-0 focus:outline-none"
        tabIndex={-1}
      >
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
