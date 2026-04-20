import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link2, LayoutDashboard, BarChart3, LogOut, User, PlusCircle } from "lucide-react";

// ─── Design Tokens (Dark Theme) ─────────────────
const C = {
  bg: "rgba(15,23,42,0.85)",
  border: "rgba(255,255,255,0.07)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
  surface: "rgba(255,255,255,0.06)",
  surfaceHover: "rgba(255,255,255,0.1)",
};

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: C.bg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: C.primaryGradient }}
            >
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span
              className="font-headline font-bold text-xl"
              style={{
                fontFamily: "'Manrope', sans-serif",
                background: "linear-gradient(to right, #fff, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LinkPulse
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition-all hover:scale-105"
                  style={{
                    background: C.primaryGradient,
                    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
                  }}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = C.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.textMuted;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = C.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.textMuted;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>

                <div
                  className="flex items-center gap-3 pl-4 ml-2 border-l"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: C.primaryGradient }}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span
                      className="hidden md:inline font-medium"
                      style={{ color: C.text }}
                    >
                      {user?.name || user?.email?.split("@")[0]}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: C.textMuted }}
                    title="Logout"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                      e.currentTarget.style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = C.textMuted;
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = C.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.textMuted;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
                  style={{
                    background: C.primaryGradient,
                    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
