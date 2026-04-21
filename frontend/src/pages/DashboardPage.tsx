import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LinksList } from "../components/LinksList";
import { EditLinkModal } from "../components/EditLinkModal";
import { linkService } from "../services/link.service";
import { analyticsService } from "../services/analytics.service";
import type { Link as LinkType } from "shortlink-shared";
import toast, { Toaster } from "react-hot-toast";
import { Link2, MousePointerClick, Plus, BarChart2, TrendingUp } from "lucide-react";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, sub, trend }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; trend?: string;
}) => (
  <div className="rounded-2xl p-6 flex items-start gap-4 transition-transform hover:scale-[1.02] bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-500/15">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend && <span className="flex items-center gap-0.5 text-xs font-semibold text-green-500"><TrendingUp size={10} />{trend}</span>}
          <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
        </div>
      )}
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loading, t } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [summary, setSummary] = useState({ totalLinks: 0, totalClicks: 0 });
  const [, setIsLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let linksData: LinkType[] = [];
      let sessionId: string | undefined;
      if (isAuthenticated) { linksData = await linkService.getUserLinks(); }
      else { sessionId = localStorage.getItem("anonymous_session") ?? undefined; if (sessionId) linksData = await linkService.getAnonymousLinks(sessionId); }
      const summaryData = isAuthenticated ? await analyticsService.getUserSummary() : sessionId ? await analyticsService.getUserSummary(sessionId) : { totalLinks: 0, totalClicks: 0 };
      setLinks(linksData); setSummary(summaryData);
    } catch (error) { console.error("Failed to fetch data:", error); }
    finally { setIsLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      await linkService.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setSummary((prev) => ({ ...prev, totalLinks: Math.max(0, prev.totalLinks - 1) }));
      toast.success(t.links.linkDeleted);
    } catch { toast.error(t.links.failedDelete); }
  };

  const handleUpdate = async (id: number, updates: { url?: string; customAlias?: string; isActive?: boolean }) => {
    await linkService.updateLink(id, updates);
    toast.success(t.links.linkUpdated);
    await fetchData();
  };

  const handleToggleActive = async (link: LinkType) => {
    try {
      await linkService.updateLink(link.id, { isActive: !link.isActive });
      setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, isActive: !l.isActive } : l));
      toast.success(link.isActive ? t.links.linkDisabled : t.links.linkEnabled);
    } catch { toast.error(t.links.failedToggle); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2 text-slate-900 dark:text-white">{t.dashboard.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.dashboard.welcomeBack} <span className="font-semibold text-blue-500">{user?.name || user?.email?.split("@")[0] || "User"}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Link2 size={22} className="text-blue-500" />} label={t.dashboard.totalLinks} value={summary.totalLinks} sub={t.common.allTime} />
          <StatCard icon={<MousePointerClick size={22} className="text-blue-400" />} label={t.dashboard.totalClicks} value={summary.totalClicks} sub={t.dashboard.acrossAllLinks} trend={summary.totalClicks > 0 ? "+12.5%" : undefined} />
          <StatCard icon={<BarChart2 size={22} className="text-purple-400" />} label={t.dashboard.avgClicks} value={summary.totalLinks ? (summary.totalClicks / summary.totalLinks).toFixed(1) : "0"} sub={t.common.perLink} />
        </div>

        <div className="rounded-3xl overflow-hidden bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
          <div className="px-6 py-5 flex justify-between items-center border-b border-slate-200 dark:border-white/[0.08]">
            <h2 className="font-heading font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
              {t.links.yourLinks}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">{links.length}</span>
            </h2>
            <Link to="/create" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-heading font-bold text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
              <Plus size={16} />{t.links.createNew}
            </Link>
          </div>
          <div className="p-3">
            <LinksList links={links} showActions={true} onDelete={handleDelete} onEdit={(link) => setEditingLink(link)} onToggleActive={handleToggleActive} emptyMessage={t.links.noLinksYet} />
          </div>
        </div>

        <EditLinkModal isOpen={editingLink !== null} link={editingLink} onClose={() => setEditingLink(null)} onUpdate={handleUpdate} />
        <Toaster position="bottom-right" toastOptions={{ style: { background: "rgba(30,41,59,0.95)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "14px" }, success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } }, error: { iconTheme: { primary: "#f87171", secondary: "#fff" } } }} />
      </div>
    </div>
  );
};
