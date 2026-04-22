import "dotenv/config";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { RedisClient } from "bun";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

// ✅ FIX P0: Validate ALL required env vars at startup
const jwtSecret         = process.env.JWT_SECRET;
const psuClientId       = process.env.PSU_CLIENT_ID;
const psuClientSecret   = process.env.PSU_CLIENT_SECRET;
const psuCallbackUrl    = process.env.PSU_CALLBACK_URL;

if (!jwtSecret)       throw new Error("JWT_SECRET is required!");
if (!psuClientId)     throw new Error("PSU_CLIENT_ID is required!");
if (!psuClientSecret) throw new Error("PSU_CLIENT_SECRET is required!");
if (!psuCallbackUrl)  throw new Error("PSU_CALLBACK_URL is required!");

// ✅ FIX P0: PSU URLs from env (fallback to official PSU endpoints)
const PSU_AUTHORIZE_URL = process.env.PSU_AUTHORIZE_URL
  ?? "https://eila.psu.ac.th/authen/application/o/authorize/";
const PSU_TOKEN_URL = process.env.PSU_TOKEN_URL
  ?? "https://eila.psu.ac.th/authen/application/o/token/";
const PSU_USERINFO_URL = process.env.PSU_USERINFO_URL
  ?? "https://eila.psu.ac.th/authen/application/o/userinfo/";

const redis = new RedisClient(process.env.REDIS_URL);
const OAUTH_STATE_PREFIX     = "oauth_state:";
const OAUTH_STATE_TTL_SECONDS = 300;
const OAUTH_STATE_TTL_MS      = 300_000; // 5 minutes

export const oauthRoutes = new Elysia({ prefix: "/auth/psu" })
  .use(
    jwt({
      name: "jwt",
      secret: jwtSecret,
      exp: "7d",
    })
  )
  .get("/", async () => {
    console.log("🔄 PSU OAuth initiated");
    console.log("CLIENT_ID:", psuClientId ? "✅" : "❌ MISSING");
    console.log("CALLBACK_URL:", psuCallbackUrl);

    const state = crypto.randomUUID();
    await redis.set(
      `${OAUTH_STATE_PREFIX}${state}`,
      Date.now().toString(),
      "EX",
      OAUTH_STATE_TTL_SECONDS
    );

    const url = new URL(PSU_AUTHORIZE_URL);
    url.searchParams.append("client_id",     psuClientId);
    url.searchParams.append("redirect_uri",  psuCallbackUrl);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope",         "openid profile email");
    url.searchParams.append("state",         state);

    return new Response(null, {
      status: 302,
      headers: { Location: url.toString() },
    });
  })
  .post("/exchange", async ({ body, jwt }) => {
    try {
      const { code, state } = body as { code: string; state: string };

      // ✅ FIX P1: Validate inputs before processing
      if (!code || typeof code !== "string" || code.length > 512) {
        return new Response(JSON.stringify({ error: "Missing or invalid code" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (!state || typeof state !== "string" || state.length > 128) {
        return new Response(JSON.stringify({ error: "Missing or invalid state" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ✅ Validate Redis state
      const stateKey = `${OAUTH_STATE_PREFIX}${state}`;
      const ts = await redis.get(stateKey);
      if (!ts || Date.now() - Number(ts) > OAUTH_STATE_TTL_MS) {
        if (ts) await redis.del(stateKey);
        return new Response(JSON.stringify({ error: "Invalid or expired state" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      await redis.del(stateKey);
      console.log("✅ State check passed, exchanging code...");

      // Exchange code for token — ✅ ใช้ validated env vars (ไม่มี fallback hardcoded)
      const tokenBody = new URLSearchParams({
        grant_type:    "authorization_code",
        code,
        redirect_uri:  psuCallbackUrl,
        client_id:     psuClientId,
        client_secret: psuClientSecret,
      });

      const tokenRes = await fetch(PSU_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenBody.toString(),
      });

      console.log("PSU Token response status:", tokenRes.status);

      if (!tokenRes.ok) {
        // ✅ FIX: ไม่ forward PSU error body ไปยัง client (อาจ leak ข้อมูล)
        console.error("❌ Token exchange failed:", tokenRes.status);
        return new Response(JSON.stringify({ error: "Token exchange failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const tokens = await tokenRes.json();

      // Fetch userinfo
      const userinfoRes = await fetch(PSU_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userinfoRes.ok) {
        console.error("❌ Userinfo response not ok:", userinfoRes.status);
        return new Response(JSON.stringify({ error: "Failed to fetch userinfo" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const userinfo = await userinfoRes.json();
      console.log("👤 Userinfo received - sub:", userinfo.sub ? "✅" : "❌");

      const email = userinfo.email || `${userinfo.sub}@psu.ac.th`;
      const name  = userinfo.name || userinfo.preferred_username || "PSU User";

      const user = await authService.findOrCreateOAuthUser(
        userinfo.sub,
        email,
        name
      );
      console.log("✅ User found/created:", user.id);

      const token = await jwt.sign({ id: user.id, email: user.email });
      console.log("✅ Returning token for user id:", user.id); // ✅ ไม่ log email

      return new Response(
        JSON.stringify({
          token,
          user: { id: user.id, email: user.email, name: user.name },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      // ✅ FIX: ไม่ leak error details ไปยัง client
      console.error("❌ Exchange error:", error);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }), // generic message
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  });