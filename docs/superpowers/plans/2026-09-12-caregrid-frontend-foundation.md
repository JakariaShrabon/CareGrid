# CareGrid Frontend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the CareGrid.io frontend foundation so future feature, API, and database phases can integrate without restructuring.

**Architecture:** Build a Next.js App Router TypeScript application with feature-based boundaries. UI code talks to TanStack Query hooks, hooks talk to feature services, services use a central API client, and MSW supplies mock responses while remote API mode remains pluggable.

**Tech Stack:** Next.js, TypeScript strict mode, Tailwind CSS, shadcn-style primitives, Lucide React, TanStack Query, React Hook Form, Zod, MSW, Recharts, Leaflet, date-fns, Vitest, React Testing Library, Playwright.

**Spec:** Root project documents: `CareGrid_io_Detailed_Report.pdf`, `Software Lab Project Idea and features .pdf`, `CareGrid_io_Project_Idea_Presentation_Updated_Cover.pptx`, and partially recovered `CareGrid_io_Software_Lab_Report.pdf`.

## Global Constraints

- Foundation only: do not implement Organ, Blood Bank, Pharmacy, Billing, or other business feature pages.
- No Admin dashboard unless later requested.
- Shared functional routes and permission-altered actions are preferred over duplicated role-specific pages.
- Business authority stays outside frontend: matching, donor eligibility, interactions, final billing, and authorization are backend responsibilities.
- Frontend RBAC is UX protection only; backend must enforce authorization.
- Mock data is reachable only through MSW and services, never directly from UI.
- Use `NEXT_PUBLIC_API_MODE=mock` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`.
- Use ISO-8601 strings for timestamps.

---

### Task 1: Tooling And Application Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/unauthorized/page.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(portal)/layout.tsx`
- Create: `src/app/(portal)/dashboard/page.tsx`
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/topbar.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/table.tsx`
- Create: `src/components/feedback/empty-state.tsx`
- Create: `src/components/data-display/status-pill.tsx`
- Create: `src/lib/utils/cn.ts`
- Create: `src/lib/query/query-provider.tsx`
- Create: `src/lib/api/mock-provider.tsx`

**Interfaces:**
- Produces: working Next.js app shell, scripts `dev`, `lint`, `typecheck`, `test`, `build`.
- Produces: `QueryProvider` and `MockProvider` wrappers used by the root layout.

- [ ] **Step 1: Create configuration and shell files**
- [ ] **Step 2: Install dependencies with npm**
- [ ] **Step 3: Run `npm run typecheck` and fix configuration/type errors**

### Task 2: Contracts, RBAC, Routes, And Navigation

**Files:**
- Create: `src/contracts/common.ts`
- Create: `src/contracts/auth.ts`
- Create: `src/contracts/patient.ts`
- Create: `src/contracts/ward.ts`
- Create: `src/contracts/organ.ts`
- Create: `src/contracts/blood.ts`
- Create: `src/contracts/pharmacy.ts`
- Create: `src/contracts/billing.ts`
- Create: `src/contracts/notification.ts`
- Create: `src/config/routes.ts`
- Create: `src/config/permissions.ts`
- Create: `src/config/navigation.ts`
- Create: `src/lib/auth/rbac.ts`
- Create: `src/features/auth/session.ts`
- Create: `src/features/auth/use-current-user.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/helpers/rbac.test.ts`

**Interfaces:**
- Produces: `UserRole`, `Permission`, `ROLE_PERMISSIONS`, `hasPermission`, `canAccessRoute`, `getNavigationForRole`.
- Consumes: role list from project docs: DOCTOR, NURSE, BLOOD_BANK_COORDINATOR, PHARMACIST, BILLING_OFFICER, PATIENT, FAMILY_ATTENDANT.

- [ ] **Step 1: Write RBAC tests first**
- [ ] **Step 2: Run `npm run test -- src/test/helpers/rbac.test.ts` and confirm failures from missing RBAC modules**
- [ ] **Step 3: Implement contracts and RBAC modules**
- [ ] **Step 4: Re-run the focused test and then full `npm run test`**

### Task 3: API Client, Feature Service Boundaries, And MSW

**Files:**
- Create: `src/lib/api/types.ts`
- Create: `src/lib/api/environment.ts`
- Create: `src/lib/api/client.ts`
- Create: `src/mocks/browser.ts`
- Create: `src/mocks/handlers/index.ts`
- Create: `src/mocks/data/foundation.ts`
- Create: `src/mocks/factories/foundation.ts`
- Create: `src/features/patients/api.ts`
- Create: `src/features/patients/queries.ts`
- Create: `src/features/wards/api.ts`
- Create: `src/features/wards/queries.ts`
- Create: `src/features/organ/api.ts`
- Create: `src/features/blood-bank/api.ts`
- Create: `src/features/pharmacy/api.ts`
- Create: `src/features/billing/api.ts`
- Create: `src/features/notifications/api.ts`
- Create: `src/test/helpers/api-client.test.ts`

**Interfaces:**
- Produces: `apiClient.get<T>()`, `apiClient.post<TBody, TResponse>()`, standardized `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>`.
- Produces: thin services that expose future endpoints without UI coupling to mocks.

- [ ] **Step 1: Write API client tests first**
- [ ] **Step 2: Run focused test and confirm failures from missing client**
- [ ] **Step 3: Implement environment, client, MSW handlers, and service boundaries**
- [ ] **Step 4: Re-run focused and full tests**

### Task 4: Architecture Documentation

**Files:**
- Create: `docs/PROJECT_CONTEXT.md`
- Create: `docs/FRONTEND_ARCHITECTURE.md`
- Create: `docs/ROUTES_AND_RBAC.md`
- Create: `docs/API_CONTRACT.md`
- Create: `docs/DESIGN_SYSTEM.md`
- Create: `docs/MOCK_DATA_MODEL.md`
- Create: `docs/BACKEND_HANDOFF.md`

**Interfaces:**
- Produces: durable handoff docs for future frontend, backend API, and database integration phases.
- Consumes: extracted source document scope and all route/RBAC/API decisions from Tasks 1-3.

- [ ] **Step 1: Write source-grounded documentation**
- [ ] **Step 2: Scan docs for contradictions against the project documents**
- [ ] **Step 3: Ensure docs do not claim implemented business modules**

### Task 5: Final Verification

**Files:**
- Modify only files from Tasks 1-4 if verification exposes issues.

**Interfaces:**
- Consumes: all foundation files.
- Produces: verified frontend foundation.

- [ ] **Step 1: Run `npm run lint`**
- [ ] **Step 2: Run `npm run typecheck`**
- [ ] **Step 3: Run `npm run test`**
- [ ] **Step 4: Run `npm run build`**
- [ ] **Step 5: Fix all relevant errors and repeat failed commands**
