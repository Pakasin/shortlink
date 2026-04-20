import { Elysia, t } from "elysia"; import { LinkService } from "../services/link.service"; import { AnalyticsService } from "../services/analytics.service";

const linkService = new LinkService(); const analyticsService = new AnalyticsService();

export const redirectRoutes = new Elysia().get( "/:shortCode", async ({ params, request, set }) => { const { shortCode } = params;

// Debug log (ลบออกหลัง fix)
console.log("[Redirect] shortCode:", shortCode);

const link = await linkService.getLinkByShortCode(shortCode);

console.log("[Redirect] link found:", link);

if (!link || !link.isActive) {
  set.status = 404;
  return { success: false, error: "Link not found" };
}

// Check expiration
if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
  set.status = 410;
  return { success: false, error: "Link has expired" };
}

// Track analytics (async - don't wait)
const userAgent = request.headers.get("user-agent") || "";
const ip =
  request.headers.get("x-forwarded-for") ||
  request.headers.get("x-real-ip") ||
  "unknown";
const referrer = request.headers.get("referer") || "";

analyticsService
  .trackClick(link.id, { ipAddress: ip, userAgent, referrer })
  .catch(console.error);

linkService.incrementClicks(link.id).catch(console.error);

console.log("[Redirect] → redirecting to:", link.originalUrl);

// ✅ Raw Response — แน่นอนกว่า set.redirect
return new Response(null, {
  status: 302,
  headers: { Location: link.originalUrl },
});
}, { params: t.Object({ shortCode: t.String(), }), } );