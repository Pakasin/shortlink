import { useState } from "react";
import { Link } from "react-router-dom";
import type { Link as LinkType } from "shortlink-shared";
import { useTranslation } from "../contexts/AuthContext";
import { ExternalLink, Copy, Trash2, Check, BarChart3, MousePointer, Link2, Pencil, Eye, EyeOff, Loader2 } from "lucide-react";

interface LinksListProps {
  links: LinkType[]; showActions?: boolean; onDelete?: (id: number) => void;
  onEdit?: (link: LinkType) => void; onToggleActive?: (link: LinkType) => Promise<void>; emptyMessage?: string;
}

export const LinksList: React.FC<LinksListProps> = ({ links, showActions = false, onDelete, onEdit, onToggleActive, emptyMessage }) => {
  const t = useTranslation();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleCopy = async (link: LinkType) => { const url = link.shortUrl ?? ""; if (!url) return; await navigator.clipboard.writeText(url); setCopiedId(link.id); setTimeout(() => setCopiedId(null), 2000); };
  const handleDelete = (id: number) => { if (window.confirm(t.links.deleteConfirm)) onDelete?.(id); };
  const handleToggleActive = async (link: LinkType) => { if (!onToggleActive || togglingId === link.id) return; setTogglingId(link.id); try { await onToggleActive(link); } finally { setTogglingId(null); } };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-500">
        <Link2 size={40} className="opacity-25" />
        <p className="text-sm font-medium text-center max-w-xs">{emptyMessage || t.links.noLinks}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const shortUrl = link.shortUrl ?? "";
        const clicks = link.clicks ?? 0;
        const createdAt = link.createdAt ? new Date(link.createdAt).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }) : "—";
        return (
          <div key={link.id} className={`rounded-xl p-4 transition-all bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.06] ${link.isActive === false ? "opacity-55" : ""}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-heading font-bold text-base text-blue-500 hover:underline">
                  {link.shortCode}<ExternalLink size={13} />
                </a>
                <p className="text-sm truncate mt-0.5 text-slate-500 dark:text-slate-400" title={link.originalUrl}>→ {link.originalUrl}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"><MousePointer size={12} />{clicks.toLocaleString()} {t.links.clicks}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-600">{createdAt}</span>
                  {link.customAlias && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-500">{t.common.custom}</span>}
                  {link.isAnonymous && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">{t.common.guest}</span>}
                  {link.isActive === false && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500">{t.common.disabled}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleCopy(link)} disabled={!shortUrl} title={t.links.copyShortLink}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-40">
                  {copiedId === link.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                {showActions && (<>
                  <Link to={`/analytics?link=${link.id}`} title={t.links.viewAnalytics} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors block"><BarChart3 size={18} /></Link>
                  <button onClick={() => handleToggleActive(link)} disabled={togglingId === link.id} title={link.isActive ? t.links.disableLink : t.links.enableLink}
                    className={`p-2 rounded-lg text-slate-400 dark:text-slate-500 transition-colors disabled:opacity-40 ${link.isActive ? "hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500" : "hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-500"}`}>
                    {togglingId === link.id ? <Loader2 size={18} className="animate-spin" /> : link.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button onClick={() => onEdit?.(link)} title={t.links.editLink} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500 transition-colors"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(link.id)} title={t.links.deleteLink} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </>)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
