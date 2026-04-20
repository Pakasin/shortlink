import { Elysia, t } from "elysia";
import { AnalyticsService } from "../services/analytics.service";
import { LinkService } from "../services/link.service";

const analyticsService = new AnalyticsService();
const linkService = new LinkService();

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
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
      params: t.Object({
        linkId: t.String(),
      }),
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
  .get("/summary/anonymous/:sessionId", async ({ params, set }) => {
    const summary = await analyticsService.getAnonymousSummary(params.sessionId);
    return { success: true, data: summary };
  });
