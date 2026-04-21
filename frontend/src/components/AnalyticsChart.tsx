import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../contexts/AuthContext";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  color: "#f1f5f9",
  fontSize: 13,
};

const tickStyle = { fontSize: 11, fill: "#475569" };
const gridStroke = "rgba(255,255,255,0.06)";

// ── Custom Tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "#94a3b8" }}>
        {label}
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {payload.map((p: any, i: any) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: 12 }}>{p.name}:</span>
            <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Empty State ─────────────────────────────────────────────
const EmptyState = () => {
  const t = useTranslation();
  return (
    <div style={{
      height: 250, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 10,
      color: "#334155", fontSize: 13,
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 16l4-4 4 4 4-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {t.analytics.noDataAvailable}
    </div>
  );
};

// ── Line Chart ──────────────────────────────────────────────
const LinkLineChart = ({ data, xKey, yKey }: any) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
      <XAxis
        dataKey={xKey}
        tick={tickStyle}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => {
          const d = new Date(v);
          return isNaN(d.getTime()) ? v : `${d.getMonth() + 1}/${d.getDate()}`;
        }}
      />
      <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
      <Line
        type="monotone"
        dataKey={yKey}
        stroke="url(#lineGrad)"
        strokeWidth={2.5}
        dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
        activeDot={{ r: 6, fill: "#60a5fa", strokeWidth: 0 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ── Bar Chart ───────────────────────────────────────────────
const LinkBarChart = ({ data, xKey, yKey }: any) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
      <XAxis dataKey={xKey} tick={tickStyle} axisLine={false} tickLine={false} />
      <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
      <Bar dataKey={yKey} fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={48} />
    </BarChart>
  </ResponsiveContainer>
);

// ── Pie Chart ───────────────────────────────────────────────
const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#94a3b8" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

const LinkPieChart = ({ data, xKey, yKey }: any) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={<CustomPieLabel />}
        outerRadius={80}
        innerRadius={40}
        dataKey={yKey}
        nameKey={xKey}
        paddingAngle={3}
      >
        {data.map((_: any, i: any) => (
          <Cell
            key={`cell-${i}`}
            fill={COLORS[i % COLORS.length]}
            stroke="rgba(15,23,42,0.8)"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);

// ── Main Export ─────────────────────────────────────────────
export const AnalyticsChart = ({ type, data, xKey, yKey }: any) => {
  if (!data || data.length === 0) return <EmptyState />;
  if (type === "line") return <LinkLineChart data={data} xKey={xKey} yKey={yKey} />;
  if (type === "bar")  return <LinkBarChart  data={data} xKey={xKey} yKey={yKey} />;
  if (type === "pie")  return <LinkPieChart  data={data} xKey={xKey} yKey={yKey} />;
  return null;
};

// ── Preview ─────────────────────────────────────────────────
const mockLine = [
  { date: "2026-04-14", clicks: 120 }, { date: "2026-04-15", clicks: 245 },
  { date: "2026-04-16", clicks: 189 }, { date: "2026-04-17", clicks: 310 },
  { date: "2026-04-18", clicks: 278 }, { date: "2026-04-19", clicks: 420 },
  { date: "2026-04-20", clicks: 390 },
];
const mockBar = [
  { country: "TH", clicks: 420 }, { country: "US", clicks: 310 },
  { country: "JP", clicks: 220 }, { country: "SG", clicks: 180 },
  { country: "GB", clicks: 95 },
];
const mockPie = [
  { source: "Direct", count: 420 }, { source: "Social", count: 280 },
  { source: "Search", count: 180 }, { source: "Referral", count: 120 },
];

export default function Preview() {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "32px 24px", fontFamily: "'Inter',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <h1 style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 24, color: "white", marginBottom: 8 }}>
          Analytics Charts
          <span style={{ fontSize: 13, fontWeight: 500, color: "#475569", marginLeft: 12 }}>Dark Theme Preview</span>
        </h1>

        {/* Line */}
        <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 6, height: 20, borderRadius: 3, background: "linear-gradient(to bottom,#60a5fa,#2563eb)" }} />
            <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>Clicks Over Time</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: 999 }}>Last 7 days</span>
          </div>
          <AnalyticsChart type="line" data={mockLine} xKey="date" yKey="clicks" />
        </div>

        {/* Bar */}
        <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 6, height: 20, borderRadius: 3, background: "linear-gradient(to bottom,#60a5fa,#2563eb)" }} />
            <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>Clicks by Country</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: 999 }}>All time</span>
          </div>
          <AnalyticsChart type="bar" data={mockBar} xKey="country" yKey="clicks" />
        </div>

        {/* Pie */}
        <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 6, height: 20, borderRadius: 3, background: "linear-gradient(to bottom,#60a5fa,#2563eb)" }} />
            <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>Traffic Sources</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: 999 }}>Last 30 days</span>
          </div>
          <AnalyticsChart type="pie" data={mockPie} xKey="source" yKey="count" />
        </div>
      </div>
    </div>
  );
}
