import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        navigate("/verify-email", { state: { email } });
      } else {
        setErrorMsg(error.message);
      }
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <>
      <h2
        style={{
          fontSize: "1.5rem", fontWeight: 800,
          color: "#D9F5F0", textAlign: "center", marginBottom: 24,
        }}
      >
        Sign in to your account
      </h2>

      {errorMsg && (
        <div
          className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(239,83,80,0.12)",
            border: "1px solid rgba(239,83,80,0.3)",
            color: "#ef9090",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="form-label" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            required
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: "0.8rem", color: "#75E2E0" }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              className="glass-input pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(117,226,224,0.5)", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2" style={{ marginTop: 12 }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center" style={{ fontSize: "0.88rem", color: "rgba(117,226,224,0.55)" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#75E2E0", fontWeight: 700 }}>
          Sign up
        </Link>
      </p>
    </>
  );
}
