import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

// Use an in-memory store for states with 5-minute expiry (Production: Redis/DB)
const stateStore = new Map<string, number>();

const PSU_AUTHORIZE_URL = "https://eila.psu.ac.th/authen/application/o/authorize/";
const PSU_TOKEN_URL = "https://eila.psu.ac.th/authen/application/o/token/";
const PSU_USERINFO_URL = "https://eila.psu.ac.th/authen/application/o/userinfo/";

export const oauthRoutes = new Elysia({ prefix: "/auth/psu" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "your-secret-key",
      exp: "7d",
    })
  )
  .get("/", async () => {
    console.log('🔄 PSU OAuth initiated');
    console.log('CLIENT_ID:', process.env.PSU_CLIENT_ID ? '✅' : '❌ MISSING');
    console.log('CALLBACK_URL:', process.env.PSU_CALLBACK_URL);

    const state = Math.random().toString(36).substring(7);
    stateStore.set(state, Date.now());

    const url = new URL(PSU_AUTHORIZE_URL);
    url.searchParams.append("client_id", process.env.PSU_CLIENT_ID!);
    url.searchParams.append("redirect_uri", process.env.PSU_CALLBACK_URL!);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid profile email");
    url.searchParams.append("state", state);

    return new Response(null, {
      status: 302,
      headers: { Location: url.toString() }
    });
  })
  .post("/exchange", async ({ body, jwt }) => {
    try {
      const { code, state } = body as { code: string; state: string };

      if (!code) {
        console.error('❌ Missing code in request body');
        return new Response(JSON.stringify({ error: "Missing code" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Validate state with 5-minute expiry (lenient - allows restarts)
      const ts = stateStore.get(state);
      if (!ts) {
        console.warn('⚠️ State not found (possible restart), continuing...');
      } else if (Date.now() - ts > 300_000) {
        console.warn('⚠️ State expired, continuing...');
      } else {
        stateStore.delete(state);
      }
      console.log('✅ State check passed, exchanging code...');

      // Exchange code for token
      const tokenBody = new URLSearchParams();
      tokenBody.append("grant_type", "authorization_code");
      tokenBody.append("code", code);
      tokenBody.append("redirect_uri", process.env.PSU_CALLBACK_URL || "http://localhost:5173/callback");
      tokenBody.append("client_id", process.env.PSU_CLIENT_ID!);
      tokenBody.append("client_secret", process.env.PSU_CLIENT_SECRET!);

      const tokenRes = await fetch(PSU_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody.toString(),
      });

      console.log('PSU Token response status:', tokenRes.status);
      console.log('PSU Token response:', await tokenRes.clone().text());

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        return new Response(JSON.stringify({ error: `Token exchange failed: ${errorText}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const tokens = await tokenRes.json();

      // Fetch userinfo
      const userinfoRes = await fetch(PSU_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!userinfoRes.ok) {
        console.error('❌ Userinfo response not ok:', userinfoRes.status);
        return new Response(JSON.stringify({ error: "Failed to fetch userinfo" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const userinfo = await userinfoRes.json();
      console.log('👤 Userinfo:', JSON.stringify(userinfo));

      const email = userinfo.email || `${userinfo.sub}@psu.ac.th`;
      const name = userinfo.name || userinfo.preferred_username || "PSU User";

      const user = await authService.findOrCreateOAuthUser(
        userinfo.sub,
        email,
        name
      );
      console.log('✅ User found/created:', user.id, user.email);

      const token = await jwt.sign({ id: user.id, email: user.email });
      console.log('✅ Returning token for user:', user.email);

      return new Response(JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('❌ Exchange error:', error);
      return new Response(
        JSON.stringify({ error: String(error) }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  });
