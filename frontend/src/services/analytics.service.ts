import apiClient from "./api";
import type { LinkAnalytics, ApiResponse } from "shortlink-shared";

export const analyticsService = {
  async getLinkAnalytics(linkId: number): Promise<LinkAnalytics> {
    const response = await apiClient.get<ApiResponse<LinkAnalytics>>(
      `/api/analytics/${linkId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to get analytics");
    }
    return response.data.data!;
  },

  async getUserSummary(sessionId?: string): Promise<{
    totalLinks: number;
    totalClicks: number;
  }> {
    const url = sessionId
      ? `/api/analytics/summary/anonymous/${sessionId}`
      : "/api/analytics/summary";

    const response = await apiClient.get<
      ApiResponse<{ totalLinks: number; totalClicks: number }>
    >(url);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to get summary");
    }
    return response.data.data!;
  },
};

export default analyticsService;
