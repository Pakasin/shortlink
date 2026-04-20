import { useState, useEffect } from "react";
import { linkService } from "../services/link.service";
import { analyticsService } from "../services/analytics.service";
import { AnalyticsChart } from "../components/AnalyticsChart";
import type { Link, LinkAnalytics } from "shortlink-shared";
import { BarChart3, MousePointer, Globe, TrendingUp, Plus } from "lucide-react"; // ✅ เพิ่ม Plus, ลบ Monitor (unused)

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
};

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, trend,
}: {
  icon: React.ReactNode; label: string; value: string | number; trend?: string;
}) => (
  <div
    className="rounded-2xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02]"
    style={{ ...C.glass, borderRadius: "20px", padding: "20px" }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(59,130,246,0.15)" }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.textDim }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p
          className="text-xl font-extrabold truncate"
          style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold flex-shrink-0" style={{ color: "#22c55e" }}>
            <TrendingUp size={10} />{trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

export const AnalyticsPage: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const linksData = await linkService.getUserLinks();
      setLinks(linksData);
      if (linksData.length > 0) {
        setSelectedLink(linksData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    }
  };

  const fetchAnalytics = async (linkId: number) => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getLinkAnalytics(linkId);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (selectedLink) {
      fetchAnalytics(selectedLink.id);
    } else {
      setIsLoading(false);
    }
  }, [selectedLink]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
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
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: C.primary, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: C.bgGradient }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
        <div
          className="text-center py-16 px-8 rounded-3xl"
          style={{ ...C.glass, maxWidth: "480px" }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <BarChart3 size={36} style={{ color: C.primary }} />
          </div>
          <h2
            className="font-headline text-2xl font-bold mb-3"
            style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
          >
            No Analytics Data
          </h2>
          <p className="text-sm mb-6" style={{ color: C.textMuted }}>
            Create some links first to see their analytics performance.
          </p>
          <a
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{
              background: C.primaryGradient,
              fontFamily: "'Manrope', sans-serif",
              boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
            }}
          >
            <Plus size={16} />
            Create Your First Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: C.bgGradient,
        fontFamily: "'Inter', sans-serif",
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
            background: "rgba(59,130,246,0.2)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-headline text-3xl font-bold mb-2"
            style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
          >
            Analytics
          </h1>
          <p className="text-sm" style={{ color: C.textMuted }}>
            Track your link performance in real-time
          </p>
        </div>

        {/* Link Selector */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.textDim }}>
            Select Link
          </label>
          <select
            value={selectedLink?.id || ""}
            onChange={(e) => {
              const link = links.find((l) => l.id === Number(e.target.value));
              setSelectedLink(link || null);
            }}
            className="rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all max-w-md w-full"
            style={{
              background: C.surface,
              border: `1px solid rgba(255,255,255,0.1)`,
              color: C.text,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {links.map((link) => (
              <option key={link.id} value={link.id} style={{ background: "#1e293b" }}>
                {link.shortCode} → {link.originalUrl.substring(0, 50)}...
              </option>
            ))}
          </select>
        </div>

        {analytics && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={<MousePointer size={20} style={{ color: "#60a5fa" }} />}
                label="Total Clicks"
                value={analytics.totalClicks.toLocaleString()}
                trend="+12.5%"
              />
              <StatCard
                icon={<Globe size={20} style={{ color: "#4ade80" }} />}
                label="Unique Visitors"
                value={analytics.uniqueVisitors.toLocaleString()}
              />
              <StatCard
                icon={<BarChart3 size={20} style={{ color: "#a78bfa" }} />}
                label="Short URL"
                value={selectedLink?.shortCode || "—"}
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "24px", padding: "24px" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: "linear-gradient(to bottom, #60a5fa, #2563eb)" }}
                  />
                  <h3
                    className="font-headline text-lg font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                  >
                    Clicks Over Time
                  </h3>
                  <span
                    className="ml-auto text-xs px-3 py-1 rounded-full"
                    style={{ background: C.surfaceHigh, color: C.textDim }}
                  >
                    Last 7 days
                  </span>
                </div>
                <AnalyticsChart
                  type="line"
                  data={analytics.clicksByDay}
                  xKey="date"
                  yKey="count"
                />
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "24px", padding: "24px" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: "linear-gradient(to bottom, #60a5fa, #2563eb)" }}
                  />
                  <h3
                    className="font-headline text-lg font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                  >
                    Top Referrers
                  </h3>
                  <span
                    className="ml-auto text-xs px-3 py-1 rounded-full"
                    style={{ background: C.surfaceHigh, color: C.textDim }}
                  >
                    All time
                  </span>
                </div>
                <AnalyticsChart
                  type="bar"
                  data={analytics.topReferrers.slice(0, 5)}
                  xKey="referrer"
                  yKey="count"
                />
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "24px", padding: "24px" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: "linear-gradient(to bottom, #60a5fa, #2563eb)" }}
                  />
                  <h3
                    className="font-headline text-lg font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                  >
                    Devices
                  </h3>
                </div>
                <AnalyticsChart
                  type="pie"
                  data={analytics.devices}
                  xKey="device"
                  yKey="count"
                />
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "24px", padding: "24px" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: "linear-gradient(to bottom, #60a5fa, #2563eb)" }}
                  />
                  <h3
                    className="font-headline text-lg font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                  >
                    Browsers
                  </h3>
                </div>
                <AnalyticsChart
                  type="bar"
                  data={analytics.browsers.slice(0, 5)}
                  xKey="browser"
                  yKey="count"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
