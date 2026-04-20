import { useState } from "react";
import { Link } from "react-router-dom";
import type { Link as LinkType } from "shortlink-shared";
import {
  ExternalLink, Copy, Trash2,
  Check, BarChart3, MousePointer,
  Link2,
} from "lucide-react";

// ─── Design Tokens (Dark Theme) ─────────────────
const C = {
  surface: "rgba(255,255,255,0.06)",
  surfaceHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  primary: "#3b82f6",
  error: "#f87171",
  errorBg: "rgba(248,113,113,0.1)",
  success: "#22c55e",
};

interface LinksListProps {
  links: LinkType[];
  showActions?: boolean;
  onDelete?: (id: number) => void;
  emptyMessage?: string;
}

export const LinksList: React.FC<LinksListProps> = ({
  links,
  showActions = false,
  onDelete,
  emptyMessage = "No links found",
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (link: LinkType) => {
    const url = link.shortUrl ?? "";
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      onDelete?.(id);
    }
  };

  // ─── Empty State ─────────────────────────────────────────────
  if (links.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3"
        style={{ color: C.textMuted }}
      >
        <Link2 size={40} style={{ opacity: 0.25, color: C.textDim }} />
        <p className="text-sm font-medium text-center max-w-xs">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // ─── List ────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {links.map((link) => {
        const shortUrl = link.shortUrl ?? "";
        const clicks = link.clicks ?? 0;
        const createdAt = link.createdAt
          ? new Date(link.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—";

        return (
          <div
            key={link.id}
            className="rounded-xl p-4 transition-all"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.surfaceHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = C.surface)
            }
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* ─── Link Info ───────────────────────────────── */}
              <div className="flex-1 min-w-0">
                {/* Short URL */}
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-headline font-bold text-base hover:underline"
                  style={{ color: C.primary }}
                >
                  {link.shortCode}
                  <ExternalLink size={13} />
                </a>

                {/* Original URL */}
                <p
                  className="text-sm truncate mt-0.5"
                  style={{ color: C.textMuted }}
                  title={link.originalUrl}
                >
                  → {link.originalUrl}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {/* Clicks */}
                  <span
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: C.textMuted }}
                  >
                    <MousePointer size={12} />
                    {clicks.toLocaleString()} clicks
                  </span>

                  {/* Date */}
                  <span className="text-xs" style={{ color: C.textDim }}>
                    {createdAt}
                  </span>

                  {/* Badges */}
                  {link.customAlias && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(59,130,246,0.15)",
                        color: C.primary,
                      }}
                    >
                      Custom
                    </span>
                  )}
                  {link.isAnonymous && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: C.surface,
                        color: C.textMuted,
                      }}
                    >
                      Guest
                    </span>
                  )}
                </div>
              </div>

              {/* ─── Actions ─────────────────────────────────── */}
              <div className="flex items-center gap-1">
                {/* Copy */}
                <button
                  onClick={() => handleCopy(link)}
                  disabled={!shortUrl}
                  title="Copy short link"
                  className="p-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {copiedId === link.id ? (
                    <Check size={18} style={{ color: C.success }} />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>

                {showActions && (
                  <>
                    {/* Analytics */}
                    <Link
                      to={`/analytics?link=${link.id}`}
                      title="View analytics"
                      className="p-2 rounded-lg transition-colors block"
                      style={{ color: C.textMuted }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <BarChart3 size={18} />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(link.id)}
                      title="Delete link"
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: C.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = C.errorBg;
                        e.currentTarget.style.color = C.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = C.textMuted;
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
