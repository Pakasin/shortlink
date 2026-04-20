import { Elysia, t } from "elysia";
import { LinkService } from "../services/link.service";
import type { CreateLinkRequest, UpdateLinkRequest } from "shortlink-shared";

const linkService = new LinkService();

export const linkRoutes = new Elysia({ prefix: "/links" })
  // Create link (public - optional auth)
  .post(
    "/",
    async ({ body, headers, jwt, set }) => {
      const data = body as CreateLinkRequest;

      let userId: number | undefined;
      const auth = headers.authorization;
      console.log("[Link POST] Auth header:", auth ? `✅ Bearer ${auth.slice(7).slice(0, 10)}...` : "❌ none");

      if (auth?.startsWith("Bearer ")) {
        try {
          const payload = await jwt.verify(auth.slice(7));
          console.log("[Link POST] JWT payload:", payload);
          if (payload) {
            userId = payload.id as number;
            console.log("[Link POST] ✅ User authenticated:", userId);
          } else {
            console.log("[Link POST] ❌ JWT verify returned null");
          }
        } catch (err) {
          console.log("[Link POST] ❌ JWT verify error:", err);
        }
      }

      try {
        const link = await linkService.createLink(data, userId);
        console.log("[Link POST] ✅ Created link:", link.shortCode, "for userId:", userId);
        return { success: true, data: link };
      } catch (error: any) {
        console.log("[Link POST] ❌ Error:", error.message);
        set.status = 400;
        return { success: false, error: error.message };
      }
    },
    {
      body: t.Object({
        url: t.String({ format: "uri" }),
        customAlias: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
        sessionId: t.Optional(t.String()),
      }),
    }
  )

  // Get user's links (protected)
  .get("/", async ({ headers, jwt, set }) => {
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

    const links = await linkService.getUserLinks(payload.id as number);
    return { success: true, data: links };
  })

  // Get anonymous links by sessionId
  .get("/anonymous/:sessionId", async ({ params, set }) => {
    const links = await linkService.getAnonymousLinks(params.sessionId);
    return { success: true, data: links };
  })

  // ✅ Update link destination (protected) — shortCode ยังเดิม
  .patch(
    "/:id",
    async ({ params, body, headers, jwt, set }) => {
      const linkId = Number(params.id);
      if (Number.isNaN(linkId)) {
        set.status = 400;
        return { success: false, error: "Invalid link id" };
      }

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

      if (
        body.url === undefined &&
        body.customAlias === undefined &&
        body.isActive === undefined
      ) {
        set.status = 400;
        return { success: false, error: "No fields to update" };
      }

      try {
        const updated = await linkService.updateLink(linkId, payload.id as number, body as UpdateLinkRequest);

        if (!updated) {
          set.status = 404;
          return { success: false, error: "Link not found or unauthorized" };
        }

        console.log("[Link PATCH] ✅ Updated link:", updated.shortCode);
        return { success: true, data: updated };
      } catch (error: any) {
        set.status = 400;
        return { success: false, error: error.message || "Failed to update link" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        url: t.Optional(t.String({ format: "uri" })),
        customAlias: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )

  // Delete link (protected)
  .delete(
    "/:id",
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

      const deleted = await linkService.deleteLink(
        Number(params.id),
        payload.id as number
      );

      if (!deleted) {
        set.status = 404;
        return { success: false, error: "Link not found or unauthorized" };
      }

      return { success: true, message: "Link deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
