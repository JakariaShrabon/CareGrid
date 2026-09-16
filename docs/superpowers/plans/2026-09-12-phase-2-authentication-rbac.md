# Phase 2: Authentication and RBAC Implementation Plan

This phase focuses on replacing the static `demoUser` context with a fully functional mock authentication service, comprehensive RBAC-based navigation filtering, and strict route guarding. The goal is to establish a secure foundation for subsequent clinical module development without touching business logic or inventing new UI components.

## Proposed Changes

### Configuration and Permissions

#### [MODIFY] [permissions.ts](file:///d:/Care_grid_project/src/config/permissions.ts)
- Update role-permission mappings to precisely match the Phase 2 specification (e.g., Blood Bank Coordinator gets Donor Map, Emergency SOS).

#### [MODIFY] [routes.ts](file:///d:/Care_grid_project/src/config/routes.ts)
- Extend routing table and `ROUTE_ACCESS_RULES` to explicitly capture public routes vs auth-required vs permission-protected boundaries.

#### [MODIFY] [navigation.ts](file:///d:/Care_grid_project/src/config/navigation.ts)
- Ensure all navigation items cleanly map to the 7 prescribed roles.

---

### Authentication Architecture

#### [MODIFY] [auth.ts](file:///d:/Care_grid_project/src/contracts/auth.ts)
- Add `AuthSession` and `LoginCredentials` models to securely type authentication workflows without exposing underlying token secrets to UI logic.

#### [NEW] [demo-users.ts](file:///d:/Care_grid_project/src/mocks/data/demo-users.ts)
- Define realistic mock payload representations for all 7 role personas.

#### [NEW] [mock-session.ts](file:///d:/Care_grid_project/src/lib/api/mock-session.ts)
- Build isolated browser-persistence (via `sessionStorage`) explicitly for MOCK MODE to survive page reloads without leaking token concepts.

#### [MODIFY] [index.ts](file:///d:/Care_grid_project/src/mocks/handlers/index.ts)
- Implement REST handlers: `POST /api/v1/auth/login`, `GET /api/v1/auth/session`, `POST /api/v1/auth/logout`.

#### [NEW] [auth-service.ts](file:///d:/Care_grid_project/src/lib/auth/auth-service.ts)
- Construct the primary `login`, `logout`, `getSession`, and `requestPasswordReset` boundary.

#### [NEW] [auth-provider.tsx](file:///d:/Care_grid_project/src/features/auth/auth-provider.tsx)
- Create canonical React Context provider exposing `user`, `isAuthenticated`, `isLoading`, and mutation helpers.

#### [MODIFY] [use-current-user.ts](file:///d:/Care_grid_project/src/features/auth/use-current-user.ts)
- Convert from static `demoUser` stub to consume `AuthProvider`.

---

### Application Shell & Layout Integration

#### [NEW] [route-guard.tsx](file:///d:/Care_grid_project/src/features/auth/route-guard.tsx)
- Enforce layout-level session waiting (using `LoadingState`), unauthenticated redirection to `/login`, and unauthorized redirection to `/unauthorized`.

#### [MODIFY] [layout.tsx](file:///d:/Care_grid_project/src/app/(portal)/layout.tsx)
- Wrap `<AppShell>` inside the new `<RouteGuard>`.

#### [MODIFY] [layout.tsx](file:///d:/Care_grid_project/src/app/layout.tsx)
- Wrap the entire application tree inside `<AuthProvider>`.

#### [MODIFY] [topbar.tsx](file:///d:/Care_grid_project/src/components/layout/topbar.tsx)
- Connect logout action to the real `useAuth` hook.

---

### Route Implementations

#### [NEW] [module-boundary.tsx](file:///d:/Care_grid_project/src/components/layout/module-boundary.tsx)
- Create standard placeholder template for valid top-level module endpoints that have no business logic yet.

#### [MODIFY] [page.tsx](file:///d:/Care_grid_project/src/app/(auth)/login/page.tsx)
- Implement canonical login UI: React Hook Form + Zod, pending states, error handling. Include mock credentials helper panel strictly for MOCK MODE.

#### [NEW] [page.tsx](file:///d:/Care_grid_project/src/app/(auth)/forgot-password/page.tsx)
- Add single-input professional email recovery workflow.

#### [NEW] [page.tsx](file:///d:/Care_grid_project/src/app/(auth)/reset-password/page.tsx)
- Add new password constraints workflow.

#### [MODIFY] [page.tsx](file:///d:/Care_grid_project/src/app/(portal)/profile/page.tsx)
- Populate profile fields directly from `useCurrentUser()`.

## Verification Plan

### Automated Tests
- Write test to cover `canAccessRoute` under `rbac.test.ts`.
- Ensure Next.js builds properly via `npm run build`.
- Maintain total type safety via `npm run typecheck`.

### Manual Verification
- Simulate logins across all 7 user roles.
- Ensure correct `<Sidebar />` subset for each user.
- Test that logging out safely removes protected views.
- Test hitting `/patients` without authentication yields redirection to `/login?returnTo=/patients`.
- Test that a `FAMILY_ATTENDANT` visiting `/blood-bank` hits `/unauthorized`.
