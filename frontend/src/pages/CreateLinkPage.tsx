import { useState } from "react";
import { linkService } from "../services/link.service";
import { QRGenerator } from "../components/QRGenerator";
import {
  Link2, Copy, CheckCheck, Loader2,
  Shield, Sparkles, QrCode, ArrowRight,
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
  errorBg: "rgba(248,113,113,0.1)",
  success: "#22c55e",
  successBg: "rgba(34,197,94,0.1)",
};

// ─── Brand Color Palette ───────────────────────────────────────
const PALETTE = [
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#8b5cf6", label: "Purple" },
  { hex: "#22c55e", label: "Green" },
  { hex: "#ef4444", label: "Red" },
];

// ─── Placeholder QR ────────────────────────────────────────────
const PlaceholderQR = () => (
  <div
    className="w-40 h-40 flex flex-col items-center justify-center gap-2 rounded-xl"
    style={{
      background: C.surface,
      border: "2px dashed rgba(255,255,255,0.15)",
    }}
  >
    <QrCode size={44} style={{ color: C.textDim, opacity: 0.3 }} />
    <p className="text-[9px] font-bold text-center uppercase tracking-widest px-2" style={{ color: C.textDim }}>
      QR Preview
    </p>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────
export const CreateLinkPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [genQR, setGenQR] = useState(true);
  const [qrColor, setQrColor] = useState("#3b82f6");
  const [logoMode, setLogoMode] = useState<"center" | "none">("center");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [createdLink, setCreatedLink] = useState<{
    id: number;
    shortUrl: string;
    shortCode: string;
    originalUrl: string;
  } | null>(null);

  const baseUrl = window.location.origin;
  const previewCode = alias.trim() || "my-alias";
  const previewUrl = `${baseUrl}/${previewCode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setIsLoading(true);
    try {
      const link = await linkService.createLink({
        url: url.trim(),
        ...(alias.trim() ? { customAlias: alias.trim() } : {}),
      });
      setCreatedLink({
        id: link.id,
        shortUrl: link.shortUrl || `${baseUrl}/${link.shortCode}`,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl || url.trim(),
      });
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.message ?? "Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdLink) return;
    navigator.clipboard.writeText(createdLink.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
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
            background: "rgba(59,130,246,0.2)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1
            className="font-headline text-4xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
          >
            Create New Link
          </h1>
          <p className="text-base" style={{ color: C.textMuted }}>
            Transform your long URLs into short, trackable links instantly.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ─── Form Side (8 cols) ────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Error Banner */}
              {error && (
                <div
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium"
                  style={{ background: C.errorBg, color: C.error }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke={C.error} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              {/* 1 · Destination URL */}
              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "20px", padding: "24px" }}
              >
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: C.textDim }}>
                  Destination URL
                </label>
                <div className="relative group">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your-long-link"
                    type="url"
                    required
                    className="w-full rounded-xl outline-none transition-all"
                    style={{
                      background: C.surface,
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: C.text,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "15px",
                      padding: "20px",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full h-[2px] rounded-b-xl transition-all duration-300 origin-left scale-x-0 group-focus-within:scale-x-100"
                    style={{ background: C.primary }}
                  />
                </div>
              </div>

              {/* 2 · Alias + Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  className="rounded-xl p-5"
                  style={{ ...C.glass, borderRadius: "16px", padding: "20px" }}
                >
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: C.textDim }}>
                    Custom Alias <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <div
                    className="flex items-center rounded-lg"
                    style={{ background: C.surface }}
                  >
                    <span
                      className="text-sm font-medium border-r px-3 mr-3 whitespace-nowrap"
                      style={{ color: C.textMuted, borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      {baseUrl}/
                    </span>
                    <input
                      value={alias}
                      onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="my-alias"
                      className="bg-transparent border-none p-0 w-full font-medium outline-none"
                      style={{ color: C.text, fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ ...C.glass, borderRadius: "16px", padding: "20px" }}
                >
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: C.textDim }}>
                    Link Title <span className="normal-case font-normal">(Private)</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Marketing Campaign 2024"
                    className="w-full rounded-lg outline-none font-medium"
                    style={{
                      background: C.surface,
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: C.text,
                      fontFamily: "'Inter', sans-serif",
                      padding: "12px 16px",
                    }}
                  />
                </div>
              </div>

              {/* 3 · QR Code Options */}
              <div
                className="rounded-2xl p-6"
                style={{ ...C.glass, borderRadius: "20px", padding: "24px" }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3
                      className="font-headline text-base font-bold"
                      style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                    >
                      Generate QR Code
                    </h3>
                    <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                      Create a matching QR code for this link.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGenQR((v) => !v)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                    style={{ backgroundColor: genQR ? C.primary : C.surface }}
                  >
                    <span
                      className="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                      style={{ transform: genQR ? "translateX(1.35rem)" : "translateX(0.125rem)" }}
                    />
                  </button>
                </div>

                {genQR && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold tracking-widest uppercase" style={{ color: C.textDim }}>
                        Brand Color
                      </label>
                      <div className="flex gap-3 items-center">
                        {PALETTE.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            title={c.label}
                            onClick={() => setQrColor(c.hex)}
                            className="w-10 h-10 rounded-full transition-all hover:scale-110"
                            style={{
                              backgroundColor: c.hex,
                              boxShadow:
                                qrColor === c.hex
                                  ? `0 0 0 3px white, 0 0 0 5px ${c.hex}`
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold tracking-widest uppercase" style={{ color: C.textDim }}>
                        Logo Placement
                      </label>
                      <div className="flex gap-3">
                        {(["center", "none"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setLogoMode(opt)}
                            className="flex-1 p-3 rounded-lg text-center cursor-pointer border-2 transition-all"
                            style={{
                              borderColor: logoMode === opt ? C.primary : "rgba(255,255,255,0.1)",
                              background: logoMode === opt ? C.surface : "transparent",
                            }}
                          >
                            <span
                              className="text-xs font-bold"
                              style={{ color: logoMode === opt ? C.primary : C.textMuted }}
                            >
                              {opt === "center" ? "Center Logo" : "No Logo"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 · CTA Row */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2" style={{ color: C.textMuted }}>
                  <Shield size={16} />
                  <span className="text-xs font-medium">Secure & Encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3 hover:scale-105"
                  style={{
                    background: C.primaryGradient,
                    fontFamily: "'Manrope', sans-serif",
                    boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <QrCode size={20} />
                  )}
                  {isLoading ? "Creating..." : "Create Link & QR"}
                </button>
              </div>
            </div>

            {/* ─── Preview Side (4 cols) ─────────────────────── */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-5">
                <div
                  className="rounded-2xl p-6"
                  style={{ ...C.glass, borderRadius: "20px", padding: "24px" }}
                >
                  <h3
                    className="text-center font-bold text-xs uppercase tracking-widest mb-6"
                    style={{ color: C.textDim }}
                  >
                    Real-time Preview
                  </h3>

                  <div
                    className="rounded-xl p-5 flex flex-col items-center gap-5"
                    style={{ background: C.surface }}
                  >
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.95)" }}
                    >
                      {createdLink ? (
                        <QRGenerator url={createdLink.shortUrl} linkId={createdLink.id} />
                      ) : (
                        <PlaceholderQR />
                      )}
                    </div>

                    <div className="text-center w-full">
                      <div
                        className="font-headline font-bold text-lg mb-1 truncate"
                        style={{ fontFamily: "'Manrope', sans-serif", color: C.primary }}
                      >
                        {createdLink ? createdLink.shortUrl : previewUrl}
                      </div>
                      <div
                        className="text-[10px] truncate max-w-[200px] mx-auto"
                        style={{ color: C.textDim }}
                      >
                        {url || "https://your-destination-url.com/long-path"}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!createdLink}
                        className="flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: copied ? "#16a34a" : C.primary,
                          color: "white",
                        }}
                      >
                        {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  <div className="flex gap-3 items-start">
                    <Sparkles size={18} style={{ color: "#a78bfa" }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
                      >
                        Pro Tip
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: C.textMuted }}>
                        Add UTM parameters to your URL to track exactly where your traffic is coming from in Analytics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ─── Created Link Summary ─────────────────────────────── */}
        {createdLink && (
          <div
            className="mt-8 rounded-2xl p-6"
            style={{ ...C.glass, borderRadius: "20px", padding: "24px" }}
          >
            <h2
              className="font-headline text-xl font-bold mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
            >
              <Link2 size={18} style={{ color: C.primary }} />
              Your Created Link
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: C.textDim }}>
                  Original URL
                </p>
                <p className="text-sm break-all" style={{ color: C.textMuted }}>
                  {createdLink.originalUrl}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: C.textDim }}>
                  Short URL
                </p>
                <a
                  href={createdLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-bold hover:underline"
                  style={{ color: C.primary }}
                >
                  {createdLink.shortUrl}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
