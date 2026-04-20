import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LinksList } from "../components/LinksList";
import { linkService } from "../services/link.service";
import { analyticsService } from "../services/analytics.service";
import type { Link as LinkType } from "shortlink-shared";
import {
  Link2, MousePointerClick, Plus,
  BarChart2, Loader2, TrendingUp,
} from "lucide-react";

// ─── Design Tokens (Dark Theme - LandingPage Style) ─────────────────
const C = {
  bg: "#0f172a",
  bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)",
  glass: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  surface: "rgba(255,255,255,0.06)",
  surfaceHigh: "rgba(255,255,255,0.1)",
  error: "#f87171",
};

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, sub, trend,
}: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; trend?: string;
}) => (
  <div
    className="rounded-2xl p-6 flex items-start gap-4 transition-transform hover:scale-[1.02]"
    style={{
      ...C.glass,
      borderRadius: "20px",
      padding: "24px",
    }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(59,130,246,0.15)" }}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.textDim }}>
        {label}
      </p>
      <p
        className="text-2xl font-extrabold"
        style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#22c55e" }}>
              <TrendingUp size={10} />{trend}
            </span>
          )}
          <span className="text-xs" style={{ color: C.textMuted }}>{sub}</span>
        </div>
      )}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────
export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [summary, setSummary] = useState({ totalLinks: 0, totalClicks: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let linksData: LinkType[] = [];
      let sessionId: string | undefined;

      if (isAuthenticated) {
        linksData = await linkService.getUserLinks();
      } else {
        sessionId = localStorage.getItem("anonymous_session") ?? undefined;
        if (sessionId) {
          linksData = await linkService.getAnonymousLinks(sessionId);
        }
      }

      const summaryData =
        isAuthenticated
          ? await analyticsService.getUserSummary()
          : sessionId
            ? await analyticsService.getUserSummary(sessionId)
            : { totalLinks: 0, totalClicks: 0 };

      setLinks(linksData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await linkService.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setSummary((prev) => ({
        ...prev,
        totalLinks: Math.max(0, prev.totalLinks - 1),
      }));
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  // ─── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bgGradient }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
          @keyframes gradientShift {
            0%,100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .gradient-bg {
            background: linear-gradient(-45deg, #0f172a, #1e293b, #1e3a8a, #312e81);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
          }
        `}</style>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: C.primary, borderTopColor: "transparent" }}
          />
          <p className="text-sm font-medium" style={{ color: C.textMuted, fontFamily: "'Inter', sans-serif" }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bgGradient,
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #0f172a, #1e293b, #1e3a8a, #312e81);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .float-blob { animation: float 8s ease-in-out infinite; }
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none gradient-bg">
        <div
          className="float-blob absolute rounded-full blur-[120px] opacity-20"
          style={{
            top: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            background: "rgba(59,130,246,0.25)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-extrabold tracking-tight mb-2"
            style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
          >
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: C.textMuted }}>
            Welcome back,{" "}
            <span className="font-semibold" style={{ color: C.primary }}>
              {user?.name || user?.email?.split("@")[0] || "User"}
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Link2 size={22} style={{ color: C.primary }} />}
            label="Total Links"
            value={summary.totalLinks}
            sub="All time"
          />
          <StatCard
            icon={<MousePointerClick size={22} style={{ color: "#60a5fa" }} />}
            label="Total Clicks"
            value={summary.totalClicks}
            sub="Across all links"
            trend={summary.totalClicks > 0 ? "+12.5%" : undefined}
          />
          <StatCard
            icon={<BarChart2 size={22} style={{ color: "#a78bfa" }} />}
            label="Avg. Clicks"
            value={
              summary.totalLinks
                ? (summary.totalClicks / summary.totalLinks).toFixed(1)
                : "0"
            }
            sub="Per link"
          />
        </div>

        {/* Links Section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            ...C.glass,
            borderRadius: "24px",
          }}
        >
          {/* Section Header */}
          <div
            className="px-6 py-5 flex justify-between items-center border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h2
              className="font-bold text-base flex items-center gap-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
            >
              Your Links
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: C.surfaceHigh, color: C.textMuted }}
              >
                {links.length}
              </span>
            </h2>

            <Link
              to="/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{
                background: C.primaryGradient,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
              }}
            >
              <Plus size={16} />
              Create New
            </Link>
          </div>

          {/* LinksList */}
          <div className="p-3">
            <LinksList
              links={links}
              showActions={true}
              onDelete={handleDelete}
              emptyMessage="You haven't created any links yet. Click 'Create New' to get started!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
