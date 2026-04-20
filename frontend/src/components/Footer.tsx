import { Link2 } from "lucide-react";

// ─── Design Tokens (Dark Theme) ─────────────────
const C = {
  bg: "#1e293b",
  border: "rgba(255,255,255,0.06)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
};

export const Footer: React.FC = () => {
  return (
    <footer
      className="py-8 mt-auto"
      style={{
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: C.primaryGradient }}
            >
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span
                className="font-headline font-bold"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  background: "linear-gradient(to right, #fff, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LinkPulse
              </span>
              <span className="text-sm block md:hidden" style={{ color: C.textDim }}>
                Create short links & QR codes
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <span className="text-sm" style={{ color: C.textDim }}>
              Create short links & QR codes instantly
            </span>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              Contact
            </a>
          </div>
        </div>

        <div
          className="text-center text-sm mt-6"
          style={{ color: C.textDim }}
        >
          © {new Date().getFullYear()} LinkPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
