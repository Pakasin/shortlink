  import apiClient from "./api";
  import type { Link, CreateLinkRequest, ApiResponse } from "shortlink-shared";

  // ── Helper: parse ApiResponse body อย่างปลอดภัย ──────────────
  // DELETE / บาง endpoint return 204 (ไม่มี body) ต้องรองรับทั้งสองกรณี
  function assertSuccess<T>(
    data: ApiResponse<T> | unknown,
    fallbackMsg: string
  ): T {
    // 204 No Content — data เป็น "" | null | undefined
    if (!data || typeof data !== "object") return undefined as T;

    const body = data as ApiResponse<T>;
    if (!body.success) {
      throw new Error(body.error || fallbackMsg);
    }
    return body.data!;
  }

  // ─────────────────────────────────────────────────────────────
  export const linkService = {

    // ── CREATE ────────────────────────────────────────────────
    async createLink(data: CreateLinkRequest): Promise<Link> {
      const response = await apiClient.post<ApiResponse<Link>>(
        "/api/links",
        data
      );
      return assertSuccess(response.data, "Failed to create link");
    },

    // ── GET USER LINKS ────────────────────────────────────────
    async getUserLinks(): Promise<Link[]> {
      const response = await apiClient.get<ApiResponse<Link[]>>("/api/links");
      return assertSuccess(response.data, "Failed to get links") ?? [];
    },

    // ── GET ANONYMOUS LINKS ───────────────────────────────────
    async getAnonymousLinks(sessionId: string): Promise<Link[]> {
      const response = await apiClient.get<ApiResponse<Link[]>>(
        `/api/links/anonymous/${sessionId}`
      );
      return assertSuccess(response.data, "Failed to get anonymous links") ?? [];
    },

    // ── DELETE ────────────────────────────────────────────────
    async deleteLink(id: number): Promise<void> {
      const response = await apiClient.delete<ApiResponse<void> | "">(
        `/api/links/${id}`
      );

      // ✅ 204 No Content → success (ไม่มี body — ถือว่า OK)
      if (response.status === 204) return;

      // ✅ 200 with body → ตรวจ success flag ตามปกติ
      assertSuccess(response.data, "Failed to delete link");
    },
  };

  export default linkService;
    