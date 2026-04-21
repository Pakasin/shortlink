import React, {
  createContext, useState, useContext, useEffect, type ReactNode,
} from "react";
import type { User, LoginRequest, RegisterRequest } from "shortlink-shared";
import { authService } from "../services/auth.service";
import { tokenStorage } from "../services/api";
import { en, th, type Translations } from "../config/i18n";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  language: string;
  t: Translations;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "th");

  // Derived translation object
  const t: Translations = language === "th" ? th : en;

  // ── Apply dark class on mount & changes ──────────────────────
  useEffect(() => { document.documentElement.classList.toggle("dark", isDarkMode); }, [isDarkMode]);

  // ── Restore session on mount ────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try { setUser(JSON.parse(user)); }
      catch { localStorage.removeItem('token'); localStorage.removeItem('user'); }
    }
    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => { const next = !prev; localStorage.setItem("darkMode", String(next)); return next; });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => { const next = prev === "th" ? "en" : "th"; localStorage.setItem("language", next); return next; });
  };

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem("user"); setUser(null); };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!localStorage.getItem('token'), isDarkMode, language, t,
      login, register, logout, toggleDarkMode, toggleLanguage,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

/** Convenience hook — returns only the translation object */
export const useTranslation = () => useAuth().t;
