import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Zap } from "lucide-react";

export function AuthLayout() {
  const session = useAuthStore((state) => state.session);
  if (session) return <Navigate to="/dashboard" replace />;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#000" }}
    >
      {/* Ambient background blobs */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 15% 20%, rgba(28,78,167,0.3) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 85% 80%, rgba(44,172,173,0.25) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md fade-up">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,#024D60,#2CACAO)",
              boxShadow: "0 0 30px rgba(44,172,173,0.35)",
            }}
          >
            <Zap size={26} style={{ color: "#D9F5F0" }} />
          </div>
          <h1
            style={{
              fontSize: "2rem", fontWeight: 800,
              color: "#D9F5F0", letterSpacing: "0.01em",
            }}
          >
            FocusADHD
          </h1>
          <p style={{ color: "rgba(117,226,224,0.65)", fontSize: "0.93rem", marginTop: 4 }}>
            Learn at your own pace
          </p>
        </div>

        {/* Glass card */}
        <div className="glass p-8">
          <Outlet />
        </div>

        {/* Disclaimer */}
        <p
          className="mt-6 text-center"
          style={{ fontSize: "0.72rem", color: "rgba(117,226,224,0.4)", lineHeight: 1.6 }}
        >
          <strong style={{ color: "rgba(117,226,224,0.55)" }}>Disclaimer:</strong>{" "}
          This tool is for educational support only. Not a medical diagnostic tool
          or a replacement for professional advice.
        </p>
      </div>
    </div>
  );
}
