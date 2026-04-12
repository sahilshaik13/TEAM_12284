import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");
    if (password.length < 8) return setErrorMsg("Password must be at least 8 characters.");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/verify-email", { state: { email } });
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
        Create your account
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="form-label" htmlFor="reg-name">Display Name</label>
          <input
            id="reg-name" type="text" required
            className="glass-input"
            value={name} onChange={(e) => setName(e.target.value)} disabled={loading}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="reg-email">Email address</label>
          <input
            id="reg-email" type="email" required
            className="glass-input"
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="reg-password">Password</label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"} required
              className="glass-input pr-12"
              value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(117,226,224,0.5)", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"} required
            className="glass-input"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="btn-primary w-full justify-center"
          style={{ marginTop: 8 }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center" style={{ fontSize: "0.88rem", color: "rgba(117,226,224,0.55)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#75E2E0", fontWeight: 700 }}>
          Sign in
        </Link>
      </p>
    </>
  );
}
