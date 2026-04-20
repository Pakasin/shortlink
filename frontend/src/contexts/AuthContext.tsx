import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type {
  User,
  LoginRequest,
  RegisterRequest,
} from "shortlink-shared";
import { authService } from "../services/auth.service";
import { tokenStorage } from "../services/api"; // ✅ import tokenStorage

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ────────────────────────────────
  useEffect(() => {
    const token       = tokenStorage.get();                     // ✅ "auth_token"
    const storedUser  = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // JSON เสีย → เคลียร์ทิ้ง
        tokenStorage.clear();
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    tokenStorage.set(response.token);                          // ✅ "auth_token"
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  // ── Register ────────────────────────────────────────────────
  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    tokenStorage.set(response.token);                          // ✅ "auth_token"
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = () => {
    tokenStorage.clear();                                      // ✅ "auth_token"
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
