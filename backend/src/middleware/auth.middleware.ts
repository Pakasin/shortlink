// ============================================================
// Auth Middleware — ตรวจสอบ JWT Token
// ============================================================
import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"
import type { JwtPayload } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "shortlink-secret-key-2026"

// Middleware สำหรับ route ที่ต้อง login
export const requireAuth = new Elysia()
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, cookie: { auth_token }, set }) => {
    // ตรวจสอบว่ามี token ไหม
    if (!auth_token?.value) {
      set.status = 401
      throw new Error("ต้อง login ก่อน")
    }

    // ตรวจสอบว่า token ถูกต้องไหม
    const payload = await jwt.verify(auth_token.value) as JwtPayload | false
    if (!payload) {
      set.status = 401
      throw new Error("Token ไม่ถูกต้องหรือหมดอายุ")
    }

    // ส่ง user ไปให้ route handler
    return { user: payload }
  })

// Middleware สำหรับ route ที่ optional login
export const optionalAuth = new Elysia()
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, cookie: { auth_token } }) => {
    if (!auth_token?.value) return { user: null }

    const payload = await jwt.verify(auth_token.value) as JwtPayload | false
    return { user: payload || null }
  })