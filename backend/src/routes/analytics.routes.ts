import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AnalyticsService } from "../services/analytics.service";
import { LinkService } from "../services/link.service";

// ✅ FIX P0: Validate JWT_SECRET at startup — no fallback allowed
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required!");
}

const analyticsService = new AnalyticsService();
const linkService = new LinkService();

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
  .use(
    jwt({
      name: "jwt",
      secret: jwtSecret, // ✅ ใช้ validated secret (ไม่มี fallback)
      exp: "7d",
    })
  )

  // Get analytics for a specific link (protected)
  .get(
    "/:linkId",
    async ({ params, headers, jwt, set }) => {
      const auth = headers.authorization;
      if (!auth?.startsWith("Bearer ")) {
        set.status = 401;
        return { success: false, error: "Unauthorized" };
      }

      const payload = await jwt.verify(auth.slice(7));
      if (!payload) {
        set.status = 401;
        return { success: false, error: "Invalid token" };
      }

      const linkId = Number(params.linkId);

      // Verify link belongs to user
      const link = await linkService.getLinkById(linkId);
      if (!link || link.userId !== (payload.id as number)) {
        set.status = 403;
        return { success: false, error: "Access denied" };
      }

      const analytics = await analyticsService.getLinkAnalytics(linkId);
      return { success: true, data: analytics };
    },
    {
      params: t.Object({ linkId: t.String() }),
    }
  )

  // Get user's summary (protected)
  .get("/summary", async ({ headers, jwt, set }) => {
    const auth = headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401;
      return { success: false, error: "Unauthorized" };
    }

    const payload = await jwt.verify(auth.slice(7));
    if (!payload) {
      set.status = 401;
      return { success: false, error: "Invalid token" };
    }

    const summary = await analyticsService.getUserSummary(payload.id as number);
    return { success: true, data: summary };
  })

  // Get anonymous user's summary by sessionId
  .get("/summary/anonymous/:sessionId", async ({ params }) => {
    const summary = await analyticsService.getAnonymousSummary(params.sessionId);
    return { success: true, data: summary };
  });
