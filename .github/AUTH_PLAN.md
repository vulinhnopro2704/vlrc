# Auth + Users Integration Plan

## Steps

1. Config: ensure VITE_BACKEND_API_URL = https://english.vulinh2704.id.vn; optionally validate in src/env.ts; note cookie-based auth.
2. HTTP client: update src/api/api-client.ts to use credentials: 'include'; remove bearer/refresh/sessionStorage logic; keep logging; redirect to /login on 401 for non-auth endpoints.
3. Auth API: keep /auth/login, /auth/register, /auth/me, /auth/logout in src/api/auth-management.ts; adjust types to user-only response; drop refresh usage unless backend requires; expose helpers for TanStack Query usage.
4. Users API: point src/api/user-management.ts to base path /auth/user (list/get/create/update/delete) using cookie auth; ensure searchParams casting stays safe.
5. Types: update src/types/auth.d.ts so AuthResponse reflects user-only cookie model; keep Auth.UserProfile for Users CRUD.
6. Login UI: wire src/pages/LoginPage/LoginPage.tsx submit with TanStack Query mutation; on success set cache (['auth','me']), update store, toast, navigate /dashboard; error inline + toast; rememberMe remains cosmetic.
7. Register UI: wire src/pages/RegisterPage/RegisterPage.tsx similarly with TanStack Query mutation; default redirect /dashboard (adjust if backend needs /login).
8. Session store: add auth store/context near src/routes/\_\_root.tsx and hydrate via TanStack Query (useAuthSession) to keep router in sync; expose logout handler for reuse.
9. Optional next: add guarded routes based on store state (TODO if out of scope).

## Verification

- Login/register success: cookies set, user hydrated, redirect /dashboard.
- Login/register failure: inline + toast errors, no redirect.
- Users CRUD works with cookies; no tokens in storage.
- Network: requests include credentials; local/sessionStorage contain no auth tokens.

## Decisions

- Token storage: backend http-only Secure cookies only.
- Redirect after auth: /dashboard.
- Error display: inline + toast.
- rememberMe: UI only.

## Risks / Assumptions

- Register may require login afterward if backend does not auto-auth.
- Backend CORS and Set-Cookie must allow credentials from current origin.
