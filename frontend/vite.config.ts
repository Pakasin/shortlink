import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ลบ import tailwindcss ออก ← ไม่ต้องมีแล้ว

export default defineConfig({
  plugins: [
    react(),
    // ลบ tailwindcss() ออก ← ไม่ต้องมีแล้ว
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "shortlink-shared": path.resolve(__dirname, "../shared/types"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});