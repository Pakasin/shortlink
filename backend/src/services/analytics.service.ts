import { sql } from "../config/database";
import type { AnalyticsData, LinkAnalytics } from "shortlink-shared";

export class AnalyticsService {
  async trackClick(linkId: number, data: Partial<AnalyticsData>): Promise<void> {
    const userAgent = data.userAgent || "";
    const deviceType = this.parseDeviceType(userAgent);
    const browser = this.parseBrowser(userAgent);
    const os = this.parseOS(userAgent);

    await sql`
      INSERT INTO analytics (link_id, ip_address, user_agent, referrer, country, device_type, browser, os)
      VALUES (
        ${linkId},
        ${data.ipAddress || null},
        ${userAgent},
        ${data.referrer || null},
        ${data.country || null},
        ${deviceType},
        ${browser},
        ${os}
      )
    `;
  }

  async getLinkAnalytics(linkId: number): Promise<LinkAnalytics> {
    // Total clicks
    const [totalClicks] = await sql`
      SELECT COUNT(*) as count FROM analytics WHERE link_id = ${linkId}
    `;

    // Unique visitors
    const [uniqueVisitors] = await sql`
      SELECT COUNT(DISTINCT ip_address) as count FROM analytics WHERE link_id = ${linkId}
    `;

    // Clicks by day (last 30 days)
    const clicksByDay = await sql`
      SELECT DATE(clicked_at) as date, COUNT(*) as count
      FROM analytics
      WHERE link_id = ${linkId}
        AND clicked_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(clicked_at)
      ORDER BY date ASC
    `;

    // Top referrers
    const topReferrers = await sql`
      SELECT COALESCE(referrer, 'Direct') as referrer, COUNT(*) as count
      FROM analytics
      WHERE link_id = ${linkId}
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `;

    // Devices
    const devices = await sql`
      SELECT device_type as device, COUNT(*) as count
      FROM analytics
      WHERE link_id = ${linkId}
      GROUP BY device_type
      ORDER BY count DESC
    `;

    // Browsers
    const browsers = await sql`
      SELECT browser, COUNT(*) as count
      FROM analytics
      WHERE link_id = ${linkId} AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 5
    `;

    return {
      totalClicks: Number(totalClicks.count),
      uniqueVisitors: Number(uniqueVisitors.count),
      clicksByDay: clicksByDay.map((d: any) => ({
        date: d.date,
        count: Number(d.count),
      })),
      topReferrers: topReferrers.map((r: any) => ({
        referrer: r.referrer || "Direct",
        count: Number(r.count),
      })),
      devices: devices.map((d: any) => ({
        device: d.device || "Unknown",
        count: Number(d.count),
      })),
      browsers: browsers.map((b: any) => ({
        browser: b.browser || "Unknown",
        count: Number(b.count),
      })),
    };
  }

  async getUserSummary(userId: number): Promise<{
    totalLinks: number;
    totalClicks: number;
  }> {
    const [linksCount] = await sql`
      SELECT COUNT(*) as count FROM links WHERE user_id = ${userId}
    `;

    const [clicksCount] = await sql`
      SELECT COALESCE(SUM(clicks), 0) as total FROM links WHERE user_id = ${userId}
    `;

    return {
      totalLinks: Number(linksCount.count),
      totalClicks: Number(clicksCount.total),
    };
  }

  async getAnonymousSummary(sessionId: string): Promise<{
    totalLinks: number;
    totalClicks: number;
  }> {
    const [linksCount] = await sql`
      SELECT COUNT(*) as count
      FROM links
      WHERE session_id = ${sessionId} AND is_anonymous = true
    `;

    const [clicksCount] = await sql`
      SELECT COALESCE(SUM(clicks), 0) as total
      FROM links
      WHERE session_id = ${sessionId} AND is_anonymous = true
    `;

    return {
      totalLinks: Number(linksCount.count),
      totalClicks: Number(clicksCount.total),
    };
  }

  private parseDeviceType(userAgent: string): string {
    if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
      return /ipad|tablet/i.test(userAgent) ? "Tablet" : "Mobile";
    }
    return "Desktop";
  }

  private parseBrowser(userAgent: string): string {
    if (/chrome/i.test(userAgent)) return "Chrome";
    if (/safari/i.test(userAgent)) return "Safari";
    if (/firefox/i.test(userAgent)) return "Firefox";
    if (/edge|edg/i.test(userAgent)) return "Edge";
    if (/opera|opr/i.test(userAgent)) return "Opera";
    return "Other";
  }

  private parseOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return "Windows";
    if (/macintosh|mac os/i.test(userAgent)) return "MacOS";
    if (/linux/i.test(userAgent)) return "Linux";
    if (/android/i.test(userAgent)) return "Android";
    if (/ios|iphone|ipad/i.test(userAgent)) return "iOS";
    return "Other";
  }
}
