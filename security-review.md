# Security Review Report

**Date:** 2026-04-21  
**Commit:** 013f0f6 - feat: add OAuth support, i18n, edit link modal, and agent configurations  
**Reviewer:** Security Reviewer Agent  

---

## Executive Summary

Reviewed the recent commit adding OAuth (PSU) integration, i18n support, and UI refactoring. Identified **3 HIGH confidence** and **2 MEDIUM confidence** security issues requiring immediate attention.

| Severity | Count |
|----------|-------|
| HIGH | 3 |
| MEDIUM | 2 |
| LOW | 0 |

---

## HIGH Severity Findings

### 1. OAuth State Validation Bypass

* **Location:** `backend/src/routes/oauth.routes.ts:56-62`
* **Severity:** HIGH
* **Category:** `oauth_csrf_bypass`
* **Confidence:** 9/10

**Description:** The OAuth state parameter validation is intentionally disabled, allowing CSRF protection to be bypassed. The code explicitly continues even when state is missing or expired:

```typescript
const ts = stateStore.get(state);
if (!ts) {
  console.warn('⚠️ State not found (possible restart), continuing...');
} else if (Date.now() - ts > 300_000) {
  console.warn('⚠️ State expired, continuing...');
} else {
  stateStore.delete(state);
}
```

**Exploit Scenario:** An attacker can craft a malicious OAuth callback URL with a valid authorization code but without a valid state parameter. Since state validation is bypassed, the application will process the callback, potentially allowing account takeover if the attacker can obtain a victim's OAuth authorization code through other means (e.g., XSS on the OAuth provider's redirect).

**Recommendation:** Enforce strict state validation:

```typescript
const ts = stateStore.get(state);
if (!ts || Date.now() - ts > 300_000) {
  return new Response(JSON.stringify({ error: "Invalid or expired state" }), {
    status: 400,
  });
}
stateStore.delete(state);
```

---

### 2. Hardcoded Weak JWT Secret Fallback

* **Location:** 
  - `backend/src/index.ts:36`
  - `backend/src/routes/auth.routes.ts:12`
  - `backend/src/routes/oauth.routes.ts:18`
* **Severity:** HIGH
* **Category:** `weak_credential`
* **Confidence:** 10/10

**Description:** Multiple files use a hardcoded fallback `"your-secret-key"` when `JWT_SECRET` environment variable is not set:

```typescript
secret: process.env.JWT_SECRET || "your-secret-key"
```

**Exploit Scenario:** If the application is deployed without setting `JWT_SECRET` (common in development or misconfigured production environments), an attacker can forge valid JWT tokens for any user by signing with the known secret `"your-secret-key"`. This enables complete authentication bypass and account takeover.

**Recommendation:** Require `JWT_SECRET` to be set and fail securely if missing:

```typescript
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Then use jwtSecret in the jwt() plugin
```

---

### 3. Sensitive Data Logging

* **Location:** `backend/src/routes/oauth.routes.ts:81-82`
* **Severity:** HIGH
* **Category:** `sensitive_data_exposure`
* **Confidence:** 9/10

**Description:** The OAuth token exchange response (containing access tokens) is logged to the console:

```typescript
console.log('PSU Token response status:', tokenRes.status);
console.log('PSU Token response:', await tokenRes.clone().text());
```

**Exploit Scenario:** In environments where console logs are persisted (production logging systems, log aggregation services), OAuth access tokens are stored in plaintext. Anyone with access to logs (developers, support staff, compromised log systems) can extract these tokens and impersonate users via the PSU OAuth API.

**Recommendation:** Remove sensitive logging:

```typescript
console.log('PSU Token response status:', tokenRes.status);
// Do NOT log the response body containing tokens
```

---

## MEDIUM Severity Findings

### 4. Hardcoded Localhost API URL

* **Location:** `frontend/src/pages/CallbackPage.tsx:29`
* **Severity:** MEDIUM
* **Category:** `misconfiguration`
* **Confidence:** 8/10

**Description:** The OAuth callback page has a hardcoded localhost URL for the token exchange:

```typescript
const res = await fetch("http://localhost:3000/api/auth/psu/exchange", {...})
```

**Exploit Scenario:** In production, this hardcoded URL will fail, breaking OAuth authentication. Additionally, if an attacker can manipulate the frontend environment (e.g., via DNS rebinding or host header injection), they could potentially redirect OAuth token exchanges to a malicious server.

**Recommendation:** Use environment variable or relative URL:

```typescript
const apiUrl = import.meta.env.VITE_API_URL || '';
const res = await fetch(`${apiUrl}/api/auth/psu/exchange`, {...})
```

---

### 5. In-Memory OAuth State Store

* **Location:** `backend/src/routes/oauth.routes.ts:8`
* **Severity:** MEDIUM
* **Category:** `state_management`
* **Confidence:** 8/10

**Description:** OAuth state is stored in an in-memory Map which will be lost on server restart. Combined with the lenient state validation, this creates an inconsistent security posture.

**Impact:** While not directly exploitable, this design forces the lenient state validation (Finding #1), creating a cascading security weakness. In production with multiple server instances (load balancing), the state will not be shared across instances, causing legitimate OAuth flows to fail.

**Recommendation:** Use a persistent store (Redis/database) for OAuth state in production:

```typescript
// Use Redis with 5-minute TTL
await redis.setex(`oauth_state:${state}`, 300, 'pending');

// On validation:
const exists = await redis.get(`oauth_state:${state}`);
if (!exists) {
  return new Response(JSON.stringify({ error: "Invalid or expired state" }), {
    status: 400,
  });
}
await redis.del(`oauth_state:${state}`);
```

---

## Security Strengths

The following security practices were implemented correctly:

| Practice | Status |
|----------|--------|
| SQL parameterized queries | ✅ Implemented |
| Password hashing (bcrypt) | ✅ Implemented |
| JWT validation on protected endpoints | ✅ Implemented |
| CORS configuration | ✅ Implemented |
| Input validation (Elysia schemas) | ✅ Implemented |

---

## Remediation Priority

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| P0 | #2 Hardcoded JWT Secret | Low | Critical |
| P0 | #1 OAuth State Bypass | Low | High |
| P0 | #3 Sensitive Data Logging | Low | High |
| P1 | #4 Hardcoded Localhost URL | Low | Medium |
| P1 | #5 In-Memory State Store | Medium | Medium |

---

## Sign-off

- [ ] All HIGH severity issues addressed
- [ ] MEDIUM severity issues reviewed and accepted/deferred
- [ ] Security strengths documented for team awareness

---

*Generated by Security Reviewer Agent*
