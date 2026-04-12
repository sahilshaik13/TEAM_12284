import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader2, Zap } from "lucide-react";

export function ProtectedRoute() {
  const { session, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg,#024D60,#2CACAO)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(44,172,173,0.4)",
          }}
        >
          <Zap size={24} style={{ color: "#D9F5F0" }} />
        </div>
        <Loader2 size={22} className="animate-spin" style={{ color: "#2CACAO" }} />
        <p style={{ color: "rgba(117,226,224,0.5)", fontSize: "0.88rem", letterSpacing: "0.05em" }}>
          Loading workspace…
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
