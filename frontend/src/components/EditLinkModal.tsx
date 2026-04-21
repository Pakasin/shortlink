import { useState, useEffect } from "react";
import type { Link as LinkType } from "shortlink-shared";
import { useTranslation } from "../contexts/AuthContext";
import { X, Loader2, Eye, EyeOff } from "lucide-react";

interface EditLinkModalProps {
  isOpen: boolean; link: LinkType | null; onClose: () => void;
  onUpdate: (id: number, updates: { url?: string; customAlias?: string; isActive?: boolean }) => Promise<void>;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, link, onClose, onUpdate }) => {
  const t = useTranslation();
  const [url, setUrl] = useState(""); const [customAlias, setCustomAlias] = useState("");
  const [isActive, setIsActive] = useState(true); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState("");

  useEffect(() => { if (link) { setUrl(link.originalUrl); setCustomAlias(link.customAlias ?? ""); setIsActive(link.isActive); setError(""); } }, [link]);

  if (!isOpen || !link) return null;

  const hasChanges = url !== link.originalUrl || customAlias !== (link.customAlias ?? "") || isActive !== link.isActive;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!hasChanges) { setError(t.common.noChanges); return; }
    const updates: { url?: string; customAlias?: string; isActive?: boolean } = {};
    if (url !== link.originalUrl) updates.url = url;
    if (customAlias !== (link.customAlias ?? "")) updates.customAlias = customAlias || undefined;
    if (isActive !== link.isActive) updates.isActive = isActive;
    setIsLoading(true);
    try { await onUpdate(link.id, updates); onClose(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : t.modal.failedToUpdate); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[0.08]">
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">{t.modal.editLink}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-slate-400 dark:text-slate-500">{t.modal.shortCode}</label>
            <div className="px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400">{link.shortCode}</div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-slate-400 dark:text-slate-500">{t.modal.destinationUrl}</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-slate-400 dark:text-slate-500">{t.modal.customAlias}</label>
            <input type="text" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-link"
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.modal.activeStatus}</label>
              <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">{isActive ? t.modal.activeDesc : t.modal.disabledDesc}</p>
            </div>
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all ${isActive ? "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/25" : "bg-red-50 dark:bg-red-500/15 text-red-500 border-red-200 dark:border-red-500/25"}`}>
              {isActive ? <Eye size={16} /> : <EyeOff size={16} />}{isActive ? t.common.active : t.common.disabled}
            </button>
          </div>
          {error && <div className="px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/10 transition-all">{t.common.cancel}</button>
            <button type="submit" disabled={isLoading || !hasChanges}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              {isLoading ? (<><Loader2 size={16} className="animate-spin" />{t.common.saving}</>) : t.common.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
