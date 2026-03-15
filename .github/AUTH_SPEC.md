# Auth + Users Integration Spec

## Goal

Integrate authentication via https://english.vulinh2704.id.vn/auth/* using http-only Secure cookies (no client-side token storage). Wire login/register/logout/me flows and support admin Users CRUD over the same cookie-based session.

## Scope

- Update HTTP client to send credentials and drop bearer/refresh token handling.
- Align auth API layer and types to cookie-based responses.
- Wire login/register UI flows using TanStack Query mutations, cache user, and redirect.
- Hydrate session with TanStack Query + router root; keep Toaster mounted globally.
- Ensure Users CRUD uses the auth service with cookies.

## Out of Scope

- Social login
- rememberMe persistence changes
- Advanced guards/role-gated UI
- Detailed refresh-token handling
- Password reset UI beyond existing link
- Full automated test coverage

## Backend Endpoints (assumed)

- POST /auth/login — body: { email, password }; response: { user }; sets cookie.
- POST /auth/register — body: { name, email, password }; response: { user }; sets cookie (or require login again if backend dictates).
- GET /auth/me — response: { user }; 401 if unauthenticated.
- POST /auth/logout — clears cookies.
- Users (admin) base path: /auth/user — CRUD: list (search/role/cursor/take), get by id, create, update, delete; auth via cookie.

## Client Requirements

- HTTP client must send credentials with every request; no Authorization header.
- Base URL comes from VITE_BACKEND_API_URL.
- On 401 for non-auth endpoints, redirect to /login.
- AuthResponse is user-only under the cookie model.

## UX Flows

- Login: submit -> /auth/login -> hydrate user (response or /auth/me) -> toast success -> redirect /dashboard; show inline + toast errors.
- Register: same pattern; redirect /dashboard (or /login if backend requires).
- Logout: /auth/logout -> clear user state -> /login.

## Error Handling

Map backend message to inline field/general error; toast as secondary; keep loading states clear.

## Security / CORS

Backend must allow credentials (Access-Control-Allow-Credentials) and set SameSite/Domain correctly for the current origin. Frontend sends credentials=include.

## Assumptions / Questions

- Confirm register auto-login vs require login afterward.
- Confirm error shape includes a message string.
