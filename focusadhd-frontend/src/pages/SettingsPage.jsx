import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/api";
import {
  Loader2, Save, User, Settings as SettingsIcon, Sparkles, Check
} from "lucide-react";

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    preferred_style: "Balanced",
    audio_enabled: false,
    vision_enabled: false,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await fetchWithAuth("/users/me");
        setFormData({
          display_name: data.display_name || "",
          email: data.email || "",
          preferred_style: data.preferred_style || "Balanced",
          audio_enabled: data.audio_enabled || false,
          vision_enabled: data.vision_enabled || false,
        });
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await fetchWithAuth("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          display_name: formData.display_name,
          preferred_style: formData.preferred_style,
          audio_enabled: formData.audio_enabled,
          vision_enabled: formData.vision_enabled,
        }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={36} className="animate-spin" style={{ color: "#2CACAO" }} />
      </div>
    );
  }

  /* reusable toggle */
  const Toggle = ({ name, checked }) => (
    <label className="toggle" style={{ cursor: "pointer" }}>
      <input type="checkbox" name={name} checked={checked} onChange={handleChange} />
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>
    </label>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-up">
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(117,226,224,0.12)", paddingBottom: 20 }}>
        <h1
          className="flex items-center gap-3"
          style={{ fontSize: "1.9rem", fontWeight: 800, color: "#D9F5F0" }}
        >
          <SettingsIcon size={24} style={{ color: "#2CACAO" }} />
          Settings
        </h1>
        <p style={{ color: "rgba(117,226,224,0.5)", fontSize: "0.9rem", marginTop: 4 }}>
          Manage your profile and learning preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile */}
        <div className="glass p-6 space-y-4">
          <h2
            className="flex items-center gap-2"
            style={{ fontSize: "1.1rem", fontWeight: 800, color: "#D9F5F0", marginBottom: 4 }}
          >
            <User size={18} style={{ color: "#75E2E0" }} /> Profile Information
          </h2>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="glass-input"
              style={{ opacity: 0.45, cursor: "not-allowed" }}
            />
            <p style={{ fontSize: "0.72rem", color: "rgba(117,226,224,0.35)", marginTop: 5 }}>
              Email cannot be changed.
            </p>
          </div>

          <div>
            <label className="form-label" htmlFor="display_name">Display Name</label>
            <input
              id="display_name"
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="What should we call you?"
              className="glass-input"
            />
          </div>
        </div>

        {/* Learning preferences */}
        <div className="glass p-6 space-y-5">
          <h2
            className="flex items-center gap-2"
            style={{ fontSize: "1.1rem", fontWeight: 800, color: "#D9F5F0", marginBottom: 4 }}
          >
            <Sparkles size={18} style={{ color: "#75E2E0" }} /> Learning Preferences
          </h2>

          <div>
            <label className="form-label" htmlFor="preferred_style">AI Teaching Style</label>
            <select
              id="preferred_style"
              name="preferred_style"
              value={formData.preferred_style}
              onChange={handleChange}
              className="glass-input"
              style={{ cursor: "pointer" }}
            >
              <option value="Balanced">Balanced (Default)</option>
              <option value="Concise">Concise &amp; Direct (Bullet points)</option>
              <option value="Detailed">Highly Detailed &amp; Academic</option>
              <option value="Story-driven">Story-driven &amp; Metaphorical</option>
            </select>
            <p style={{ fontSize: "0.72rem", color: "rgba(117,226,224,0.35)", marginTop: 5 }}>
              Determines how the AI formats content before adapting to your behaviour.
            </p>
          </div>

          {/* Vision toggle */}
          <div
            className="glass-lt flex items-center justify-between gap-4 p-4 rounded-xl"
            style={{ border: "1px solid rgba(117,226,224,0.12)" }}
          >
            <div>
              <p style={{ fontWeight: 700, color: "#D9F5F0", fontSize: "0.95rem" }}>Attention Monitor</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(117,226,224,0.45)", marginTop: 2 }}>
                Camera-based focus tracking — local processing only.
              </p>
            </div>
            <Toggle name="vision_enabled" checked={formData.vision_enabled} />
          </div>
        </div>

        {/* Save btn */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ minWidth: 160, justifyContent: "center" }}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : success ? (
              <><Check size={17} /> Saved!</>
            ) : (
              <><Save size={17} /> Save Settings</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
