import axios from "axios";

const TOKEN_KEY = "auth_token"; // ← key ที่ใช้ save ใน localStorage

// ── Helpers ──────────────────────────────────────────────────
export const tokenStorage = {
  get: ()              => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: ()            => localStorage.removeItem(TOKEN_KEY),
};

// ── Axios Instance ────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor — แนบ Bearer Token ────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      // ✅ Backend อ่านจาก headers.authorization เท่านั้น
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        data: config.data,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url;

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status} → ${url}`, error.response?.data);
    }

    // Token หมดอายุ / invalid → เคลียร์แล้วไป login
    if (status === 401) {
      tokenStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
