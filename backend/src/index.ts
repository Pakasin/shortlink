import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { join } from "path";

import { authRoutes } from "./routes/auth.routes";
import { oauthRoutes } from "./routes/oauth.routes";
import { linkRoutes } from "./routes/link.routes";
import { analyticsRoutes } from "./routes/analytics.routes";
import { redirectRoutes } from "./routes/redirect.routes";
import { LinkService } from "./services/link.service";
import { AnalyticsService } from "./services/analytics.service";

import "./config/database";

const PORT = Number(process.env.PORT) || 3000;
const isDev = (process.env.NODE_ENV || "development") === "development";

const linkService = new LinkService();
const analyticsService = new AnalyticsService();

const app = new Elysia()

// ── CORS + JWT ─────────────────────────────
.use(
  cors({
    origin: isDev
      ? ["http://localhost:5173", "http://localhost:3000"]
      : process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
  })
)
.use(
  jwt({
    secret: process.env.JWT_SECRET || "your-secret-key",
    exp: "7d",
  })
)

// ── Health ─────────────────────────────
.get("/health", () => ({
  status: "ok",
}))

// ── API ─────────────────────────────
.group("/api", (app) =>
  app.use(authRoutes).use(oauthRoutes).use(linkRoutes).use(analyticsRoutes)
)

// ── 🔥 Redirect (ต้องอยู่หลัง API แต่ก่อน static) ──
.use(redirectRoutes)

// ── Static (production only) ─────────
.use(
  isDev
    ? new Elysia()
    : staticPlugin({
        assets: join(import.meta.dir, "../../frontend/dist"),
        prefix: "/",
      })
)

// ── Error handler ───────────────────
.onError(({ code, error, set }) => {
  console.error(`[Error ${code}]`, error);

  set.status = 500;
  return { error: "Internal server error" };
})

.listen(PORT);

console.log(`🚀 http://localhost:${PORT}`);