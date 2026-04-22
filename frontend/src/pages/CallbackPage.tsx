import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    // Check for OAuth error first - navigate immediately, no API calls
    const hasError = searchParams.get("error");
    if (hasError) {
      navigate("/login", { replace: true });
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      navigate("/login", { replace: true });
      return;
    }

    // Only proceed with token exchange if we have valid params
    const handleExchange = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/psu/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        const data = await res.json();

        if (!res.ok || !data.token) {
          navigate("/login", { replace: true });
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };

    handleExchange();
  }, [apiUrl, searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold">Authenticating...</p>
      </div>
    </div>
  );
};
