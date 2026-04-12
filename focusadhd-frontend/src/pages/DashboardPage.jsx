import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../services/api";
import { useAuthStore } from "../store/authStore";
import {
  Loader2, Plus, BookOpen, Clock, Activity,
  Calendar, TrendingUp, ChevronRight, Sparkles
} from "lucide-react";

const AFFIRMATIONS = [
  "One focused step at a time — you've got this.",
  "Focus is a muscle. You're building it right now.",
  "Your potential is limitless.",
  "Mistakes are proof that you are trying.",
  "Take a deep breath and keep going.",
  "You are capable of amazing things.",
  "Destiny can only be changed in the present.",
  "Progress, not perfection.",
  "Every expert was once a beginner.",
];

const getStateBadgeClass = (state) => {
  switch (state?.toLowerCase()) {
    case "focused":    return "state-badge state-focused";
    case "drifting":   return "state-badge state-drifting";
    case "overloaded": return "state-badge state-overloaded";
    case "completed":  return "state-badge state-completed";
    default:           return "state-badge state-default";
  }
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [topic, setTopic] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [affIdx, setAffIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWithAuth("/users/me/dashboard");
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setFetching(false);
      }
    }
    load();

    const t = setInterval(() => setAffIdx((p) => (p + 1) % AFFIRMATIONS.length), 12000);
    return () => clearInterval(t);
  }, []);

  const startSession = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoadingAction(true);
    try {
      const data = await fetchWithAuth("/sessions", {
        method: "POST",
        body: JSON.stringify({ topic: topic.trim() }),
      });
      localStorage.setItem(`session_start_${data.session_id}`, String(Date.now()));
      navigate(`/learn/${data.session_id}?topic=${encodeURIComponent(topic.trim())}`);
    } catch (err) {
      alert("Failed to start session. " + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const formatFocusTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const formatRelDate = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff}d ago`;
  };

  const displayName = (() => {
    const meta = user?.user_metadata;
    const name = meta?.display_name || meta?.full_name || meta?.name;
    if (name && name !== "Student") return name.split(" ")[0];
    const bn = dashboardData?.display_name;
    if (!bn || bn === "Student" || bn === "Learner") return "there";
    return bn.includes("@") ? bn.split("@")[0] : bn;
  })();

  return (
    <div className="space-y-6 fade-up">

      {/* ── Welcome row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {fetching ? (
            <div className="skeleton h-9 w-52 mb-2" />
          ) : (
            <h1 style={{ fontSize: "2.1rem", fontWeight: 800, color: "#D9F5F0", lineHeight: 1.15 }}>
              Hey, {displayName} 👋
            </h1>
          )}
          <p style={{ color: "rgba(117,226,224,0.65)", fontSize: "1rem", marginTop: 4 }}>
            Ready to explore something new?
          </p>
        </div>

        {/* Affirmation chip */}
        {!fetching && (
          <div
            className="glass-lt flex items-center gap-2 px-4 py-2 rounded-xl max-w-xs"
            style={{ border: "1px solid rgba(117,226,224,0.2)" }}
          >
            <Sparkles size={15} style={{ color: "#75E2E0", flexShrink: 0 }} />
            <p style={{ fontSize: "0.82rem", color: "rgba(217,245,240,0.75)", lineHeight: 1.4 }}>
              {AFFIRMATIONS[affIdx]}
            </p>
          </div>
        )}
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Sessions",
            value: fetching ? null : (dashboardData?.kpis?.total_sessions ?? 0),
            icon: BookOpen,
            color: "#2CACAO",
          },
          {
            label: "Focus Time",
            value: fetching ? null : formatFocusTime(dashboardData?.kpis?.focus_seconds ?? 0),
            icon: Clock,
            color: "#75E2E0",
          },
          {
            label: "Avg Engagement",
            value: fetching ? null : `${dashboardData?.kpis?.avg_engagement ?? 0}%`,
            icon: TrendingUp,
            color: "#1C4EA7",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass p-5 flex items-center gap-4">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
              style={{ background: `${color}22`, border: `1px solid ${color}44` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(117,226,224,0.55)" }}>
                {label}
              </p>
              {fetching ? (
                <div className="skeleton h-8 w-16 mt-1" />
              ) : (
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "#D9F5F0", lineHeight: 1 }}>
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main + Sidebar grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Start session + recent sessions */}
        <div className="lg:col-span-2 space-y-5">

          {/* Start session */}
          <div className="glass p-6">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#D9F5F0", marginBottom: 4 }}>
              Start a New Session
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(117,226,224,0.55)", marginBottom: 18 }}>
              Enter any topic, concept, or paste a question to begin a focused AI session.
            </p>

            <form onSubmit={startSession} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. What is Machine Learning?"
                className="glass-input flex-1"
                autoFocus
              />
              <button
                type="submit"
                disabled={!topic.trim() || loadingAction}
                className="btn-primary whitespace-nowrap"
              >
                {loadingAction ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={17} /> Start Learning
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent sessions */}
          <div className="glass overflow-hidden">
            <div
              className="px-6 py-4 flex items-center gap-2"
              style={{ borderBottom: "1px solid rgba(117,226,224,0.1)" }}
            >
              <Activity size={17} style={{ color: "#2CACAO" }} />
              <h3 style={{ fontWeight: 800, color: "#D9F5F0", fontSize: "1rem" }}>
                Recent Sessions
              </h3>
            </div>

            <div className="divide-y" style={{ "--tw-divide-opacity": 1 }}>
              {fetching ? (
                <div className="p-10 flex justify-center">
                  <Loader2 size={28} className="animate-spin" style={{ color: "#2CACAO" }} />
                </div>
              ) : !dashboardData?.recent_sessions?.length ? (
                <div className="p-12 text-center">
                  <BookOpen size={36} style={{ color: "rgba(44,172,173,0.3)", margin: "0 auto 12px" }} />
                  <p style={{ color: "rgba(117,226,224,0.45)", fontSize: "0.9rem" }}>
                    Your sessions will appear here once you start learning.
                  </p>
                </div>
              ) : (
                dashboardData.recent_sessions.map((s) => (
                  <div
                    key={s.id}
                    className="session-row"
                    onClick={() =>
                      navigate(`/learn/${s.id}?topic=${encodeURIComponent(s.topic)}`)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold truncate"
                        style={{ color: "#D9F5F0", fontSize: "0.95rem" }}
                      >
                        {s.topic}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: "0.78rem", color: "rgba(117,226,224,0.5)" }}>
                          <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                          {formatRelDate(s.created_at)}
                        </span>
                        <span className={getStateBadgeClass(s.dominant_state)}>
                          {s.dominant_state}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={17}
                      style={{ color: "rgba(117,226,224,0.3)", flexShrink: 0 }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Affirmation card */}
        <div className="space-y-5">
          <div
            className="glass p-6 min-h-[200px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(145deg, rgba(2,77,96,0.3) 0%, rgba(28,78,167,0.2) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} style={{ color: "#75E2E0" }} />
              <span
                style={{
                  fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "rgba(117,226,224,0.6)",
                }}
              >
                Daily Affirmation
              </span>
            </div>

            <p
              style={{
                fontSize: "1.25rem", fontWeight: 700,
                color: "#D9F5F0", lineHeight: 1.5, flex: 1,
              }}
            >
              "{AFFIRMATIONS[affIdx]}"
            </p>

            {/* Dots indicator */}
            <div className="flex gap-1.5 mt-5">
              {AFFIRMATIONS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setAffIdx(i)}
                  style={{
                    width: i === affIdx ? 20 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === affIdx ? "#2CACAO" : "rgba(117,226,224,0.2)",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
