import { useState } from "react";
import { linkService } from "../services/link.service";
import { QRGenerator } from "../components/QRGenerator";
import { useTranslation } from "../contexts/AuthContext";
import { Link2, Copy, CheckCheck, Loader2, Shield, Sparkles, QrCode } from "lucide-react";

const PALETTE = [
  { hex: "#3b82f6", label: "Blue" }, { hex: "#8b5cf6", label: "Purple" },
  { hex: "#22c55e", label: "Green" }, { hex: "#ef4444", label: "Red" },
];

export const CreateLinkPage: React.FC = () => {
  const t = useTranslation();
  const PlaceholderQR = () => (
    <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border-2 border-dashed border-slate-300 dark:border-white/15">
      <QrCode size={44} className="text-slate-300 dark:text-slate-600 opacity-30" />
      <p className="text-[9px] font-bold text-center uppercase tracking-widest px-2 text-slate-400 dark:text-slate-600">{t.links.qrPreview}</p>
    </div>
  );

  const [url, setUrl] = useState(""); const [alias, setAlias] = useState(""); const [title, setTitle] = useState("");
  const [genQR, setGenQR] = useState(true); const [qrColor, setQrColor] = useState("#3b82f6");
  const [logoMode, setLogoMode] = useState<"center" | "none">("center");
  const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState(""); const [copied, setCopied] = useState(false);
  const [createdLink, setCreatedLink] = useState<{ id: number; shortUrl: string; shortCode: string; originalUrl: string } | null>(null);

  const baseUrl = window.location.origin;
  const previewCode = alias.trim() || "my-alias";
  const previewUrl = `${baseUrl}/${previewCode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!url.trim()) return; setError(""); setIsLoading(true);
    try {
      const link = await linkService.createLink({ url: url.trim(), ...(alias.trim() ? { customAlias: alias.trim() } : {}) });
      setCreatedLink({ id: link.id, shortUrl: link.shortUrl || `${baseUrl}/${link.shortCode}`, shortCode: link.shortCode, originalUrl: link.originalUrl || url.trim() });
    } catch (err: any) { setError(err.response?.data?.error ?? err.message ?? "Failed to create link"); }
    finally { setIsLoading(false); }
  };

  const handleCopy = () => { if (!createdLink) return; navigator.clipboard.writeText(createdLink.shortUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors">
      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-3 text-slate-900 dark:text-white">{t.links.createTitle}</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">{t.links.createSubtitle}</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {error && <div className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-500/10 text-red-500">⚠ {error}</div>}

              {/* Destination URL */}
              <div className="rounded-2xl p-6 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-slate-400 dark:text-slate-500">{t.links.destinationUrl}</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.links.urlPlaceholder} type="url" required
                  className="w-full rounded-xl p-5 text-[15px] outline-none bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>

              {/* Alias + Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl p-5 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-3 text-slate-400 dark:text-slate-500">{t.links.customAlias} <span className="normal-case font-normal">{t.links.customAliasOptional}</span></label>
                  <div className="flex items-center rounded-lg bg-slate-50 dark:bg-white/[0.04]">
                    <span className="text-sm font-medium border-r border-slate-200 dark:border-white/10 px-3 mr-3 whitespace-nowrap text-slate-400 dark:text-slate-500">{baseUrl}/</span>
                    <input value={alias} onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="my-alias"
                      className="bg-transparent border-none p-0 w-full font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                  </div>
                </div>
                <div className="rounded-xl p-5 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-3 text-slate-400 dark:text-slate-500">{t.links.linkTitle} <span className="normal-case font-normal">{t.links.linkTitlePrivate}</span></label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.links.linkTitlePlaceholder}
                    className="w-full rounded-lg p-3 font-medium outline-none bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 transition-all" />
                </div>
              </div>

              {/* QR Code Options */}
              <div className="rounded-2xl p-6 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">{t.links.generateQR}</h3>
                    <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">{t.links.generateQRDesc}</p>
                  </div>
                  <button type="button" onClick={() => setGenQR((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${genQR ? "bg-blue-500" : "bg-slate-200 dark:bg-white/[0.06]"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${genQR ? "translate-x-[1.35rem]" : "translate-x-[0.125rem]"}`} />
                  </button>
                </div>
                {genQR && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{t.links.brandColor}</label>
                      <div className="flex gap-3 items-center">
                        {PALETTE.map((c) => (
                          <button key={c.hex} type="button" title={c.label} onClick={() => setQrColor(c.hex)}
                            className="w-10 h-10 rounded-full transition-all hover:scale-110"
                            style={{ backgroundColor: c.hex, boxShadow: qrColor === c.hex ? `0 0 0 3px white, 0 0 0 5px ${c.hex}` : "none" }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{t.links.logoPlacement}</label>
                      <div className="flex gap-3">
                        {(["center", "none"] as const).map((opt) => (
                          <button key={opt} type="button" onClick={() => setLogoMode(opt)}
                            className={`flex-1 p-3 rounded-lg text-center border-2 transition-all text-xs font-bold ${logoMode === opt ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-500" : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"}`}>
                            {opt === "center" ? t.links.centerLogo : t.links.noLogo}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500"><Shield size={16} /><span className="text-xs font-medium">{t.common.secureEncrypted}</span></div>
                <button type="submit" disabled={isLoading || !url.trim()}
                  className="text-white px-8 py-3.5 rounded-xl font-heading font-bold text-base bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/35 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <QrCode size={20} />}
                  {isLoading ? t.links.creating : t.links.createLinkAndQR}
                </button>
              </div>
            </div>

            {/* Preview Side */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-5">
                <div className="rounded-2xl p-6 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
                  <h3 className="text-center font-bold text-xs uppercase tracking-widest mb-6 text-slate-400 dark:text-slate-500">{t.links.realTimePreview}</h3>
                  <div className="rounded-xl p-5 flex flex-col items-center gap-5 bg-slate-50 dark:bg-white/[0.04]">
                    <div className="p-3 rounded-xl bg-white dark:bg-white/95">
                      {createdLink ? <QRGenerator url={createdLink.shortUrl} linkId={createdLink.id} /> : <PlaceholderQR />}
                    </div>
                    <div className="text-center w-full">
                      <div className="font-display font-bold text-lg mb-1 truncate text-blue-500">{createdLink ? createdLink.shortUrl : previewUrl}</div>
                      <div className="text-[10px] truncate max-w-[200px] mx-auto text-slate-400 dark:text-slate-600">{url || "https://your-destination-url.com/long-path"}</div>
                    </div>
                    <button type="button" onClick={handleCopy} disabled={!createdLink}
                      className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white ${copied ? "bg-green-600" : "bg-blue-500"}`}>
                      {copied ? <><CheckCheck size={11} />{t.common.copied}</> : <><Copy size={11} />{t.links.copyLink}</>}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl p-5 bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/20">
                  <div className="flex gap-3 items-start">
                    <Sparkles size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900 dark:text-white">{t.links.proTip}</div>
                      <p className="text-xs mt-1 leading-relaxed text-slate-500 dark:text-slate-400">{t.links.proTipDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {createdLink && (
          <div className="mt-8 rounded-2xl p-6 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-sm dark:shadow-none">
            <h2 className="font-heading text-xl font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white"><Link2 size={18} className="text-blue-500" />{t.links.yourCreatedLink}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div><p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-slate-400 dark:text-slate-500">{t.links.originalUrl}</p><p className="text-sm break-all text-slate-500 dark:text-slate-400">{createdLink.originalUrl}</p></div>
              <div><p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-slate-400 dark:text-slate-500">{t.links.shortUrl}</p><a href={createdLink.shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold text-blue-500 hover:underline">{createdLink.shortUrl}</a></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
