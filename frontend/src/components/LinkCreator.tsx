import { useState, useEffect } from "react";
import { linkService } from "../services/link.service";
import type { Link, CreateLinkRequest } from "shortlink-shared";
import { Link2, Copy, Check, AlertCircle, Loader2 } from "lucide-react";

// ─── Design Tokens (Dark Theme) ─────────────────
const C = {
  surface: "rgba(255,255,255,0.06)",
  surfaceHigh: "rgba(255,255,255,0.1)",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
  error: "#f87171",
  errorBg: "rgba(248,113,113,0.1)",
  success: "#22c55e",
  successBg: "rgba(34,197,94,0.1)",
};

interface LinkCreatorProps {
  sessionId?: string;
  onLinkCreated?: (link: Link) => void;
}

export const LinkCreator: React.FC<LinkCreatorProps> = ({
  sessionId,
  onLinkCreated,
}) => {
  const [stableSessionId] = useState(() => {
    return sessionId || localStorage.getItem("anonymous_session") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("anonymous_session", id);
      return id;
    })();
  });

  const [formData, setFormData] = useState<CreateLinkRequest>({
    url: "",
    customAlias: "",
  });
  const [result, setResult] = useState<Link | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const link = await linkService.createLink({ ...formData, sessionId: stableSessionId });
      setResult(link);
      setFormData({ url: "", customAlias: "" });
      onLinkCreated?.(link);
    } catch (err: any) {
      setError(err.message || "Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h2
        className="font-headline text-xl font-bold mb-5 flex items-center gap-2"
        style={{
          fontFamily: "'Manrope', sans-serif",
          color: C.text,
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.15)" }}
        >
          <Link2 className="w-5 h-5" style={{ color: C.primary }} />
        </div>
        Create Short Link
      </h2>

      {error && (
        <div
          className="p-4 rounded-xl text-sm font-medium mb-4 flex items-center gap-2"
          style={{ backgroundColor: C.errorBg, color: C.error }}
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: C.textMuted }}>
            Long URL *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            placeholder="https://example.com/very-long-url-path"
            className="w-full rounded-xl outline-none transition-all"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.text,
              fontFamily: "'Inter', sans-serif",
              padding: "14px 16px",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: C.textMuted }}>
            Custom Alias (optional)
          </label>
          <div className="flex">
            <span
              className="px-4 py-3 rounded-l-xl text-sm font-medium"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRight: "none",
                color: C.textMuted,
              }}
            >
              /r/
            </span>
            <input
              type="text"
              value={formData.customAlias}
              onChange={(e) =>
                setFormData({ ...formData, customAlias: e.target.value })
              }
              placeholder="my-link"
              className="flex-1 rounded-r-xl outline-none font-medium"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontFamily: "'Inter', sans-serif",
                padding: "14px 16px",
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: C.textDim }}>
            Leave empty for random code
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: C.primaryGradient,
            fontFamily: "'Manrope', sans-serif",
            boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            "Create Short Link"
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div
          className="mt-5 p-4 rounded-xl flex items-start gap-3"
          style={{
            backgroundColor: C.successBg,
            border: `1px solid rgba(34,197,94,0.2)`,
          }}
        >
          <Check
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: C.success }}
          />
          <div className="flex-1">
            <p
              className="font-medium mb-2"
              style={{ color: C.success, fontSize: "14px" }}
            >
              Link created successfully!
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={result.shortUrl}
                readOnly
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  color: C.text,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105"
                style={{
                  background: C.primary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
