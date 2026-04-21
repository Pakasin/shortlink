import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "../services/auth.service";
import type { LoginRequest, RegisterRequest } from "shortlink-shared";

const authService = new AuthService();

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "your-secret-key",
      exp: "7d",
    })
  )
  .post(
    "/register",
    async ({ body, jwt }) => {
      const data = body as RegisterRequest;

      // Check if email already exists
      const existingUser = await authService.validateUser({
        email: data.email,
        password: "",
      });
      if (existingUser) {
        return { success: false, error: "Email already registered" };
      }

      const user = await authService.register(data);
      const token = await jwt.sign({ id: user.id, email: user.email });

      return {
        success: true,
        data: { user, token },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        name: t.Optional(t.String()),
      }),
    }
  )

  .post(
    "/login",
    async ({ body, jwt, set }) => {
      const data = body as LoginRequest;

      const user = await authService.validateUser(data);
      if (!user) {
        set.status = 401;
        return { success: false, error: "Invalid credentials" };
      }

      const token = await jwt.sign({ id: user.id, email: user.email });

      return {
        success: true,
        data: { user, token },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )

  .get("/me", async ({ headers, jwt, set }) => {
    const auth = headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401;
      return { success: false, error: "Unauthorized" };
    }

    const token = auth.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      return { success: false, error: "Invalid token" };
    }

    const user = await authService.getUserById(payload.id as number);
    if (!user) {
      set.status = 404;
      return { success: false, error: "User not found" };
    }

    return { success: true, data: { user } };
  });
