import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Link2, LayoutDashboard, BarChart3, LogOut, User, PlusCircle,
  Sun, Moon, Languages,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isDarkMode, toggleDarkMode, language, toggleLanguage, t } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.07] transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`flex items-center gap-2.5 transition-colors duration-200 ${isActive('/')
            ? 'font-semibold text-blue-600 dark:text-blue-400'
            : 'text-slate-900 dark:text-white'
            }`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">LinkPulse</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/[0.08]"
              title={language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}>
              <Languages className="w-3.5 h-3.5" />
              {language === "th" ? "EN" : "TH"}
            </button>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title={isDarkMode ? "Light mode" : "Dark mode"}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/create" className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all ${isActive('/create')
                  ? 'text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 hover:scale-105'
                  }`}>
                  <PlusCircle className="w-4 h-4" /><span className="hidden sm:inline">{t.nav.create}</span>
                </Link>
                <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/dashboard')
                  ? 'font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}>
                  <LayoutDashboard className="w-4 h-4" /><span className="hidden sm:inline font-heading">{t.nav.dashboard}</span>
                </Link>
                <Link to="/analytics" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/analytics')
                  ? 'font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}>
                  <BarChart3 className="w-4 h-4" /><span className="hidden sm:inline font-heading">{t.nav.analytics}</span>
                </Link>
                <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-200 dark:border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700"><User className="w-4 h-4 text-white" /></div>
                    <span className="hidden md:inline font-medium text-slate-700 dark:text-white text-sm">{user?.name || user?.email?.split("@")[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors" title={t.nav.logout}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`px-4 py-2 rounded-lg font-heading font-medium transition-colors duration-200 ${isActive('/login')
                  ? 'font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}>{t.nav.login}</Link>
                <Link to="/register" className={`px-5 py-2.5 rounded-xl font-heading font-bold transition-all ${isActive('/register')
                  ? 'text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 hover:scale-105'
                  }`}>{t.nav.getStarted}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
