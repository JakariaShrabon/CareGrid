# CareGrid Phase 1 Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the professional reusable CareGrid design system and responsive portal shell without implementing business modules.

**Architecture:** Preserve the Phase 0 App Router and feature-based data flow. Refine existing primitives into canonical reusable components, keep route/RBAC-driven navigation, and demonstrate the shell only on `/dashboard`, `/profile`, and `/unauthorized`.

**Tech Stack:** Next.js App Router, TypeScript strict, Tailwind CSS, Lucide React, Vitest, React Testing Library, Playwright.

**Spec:** User-provided Phase 1 requirements plus existing docs `docs/PROJECT_CONTEXT.md`, `docs/FRONTEND_ARCHITECTURE.md`, `docs/ROUTES_AND_RBAC.md`, and `docs/DESIGN_SYSTEM.md`.

## Global Constraints

- Do not reinitialize the project.
- Do not change the established architecture without proven technical reason.
- Do not build business modules, auth logic, final dashboards, route guards, or role switching.
- Do not add an Admin dashboard.
- Use existing navigation, routes, permissions, and placeholder session display data.
- Keep one canonical implementation for shell, page header, status badge, stat card, empty/error/loading states, and table shell.

---

### Task 1: Tests For Reusable Behaviors

**Files:**
- Create: `src/test/helpers/design-system.test.tsx`
- Create: `src/test/helpers/navigation-ui.test.tsx`

**Interfaces:**
- Consumes: desired public component APIs for `StatusBadge`, `PageHeader`, `EmptyState`, `ErrorState`, `Sidebar`.
- Produces: failing tests that prove missing or incomplete reusable behavior.

- [ ] Write tests for semantic status rendering, page header rendering, feedback state rendering, and active sidebar navigation.
- [ ] Run focused tests and confirm failures come from missing components/props.

### Task 2: Canonical Design Components

**Files:**
- Create: `src/components/layout/page-container.tsx`
- Create: `src/components/data-display/status-badge.tsx`
- Create: `src/components/data-display/stat-card.tsx`
- Create: `src/components/data-display/data-table-shell.tsx`
- Create: `src/components/feedback/error-state.tsx`
- Create: `src/components/feedback/loading-state.tsx`
- Create: `src/components/feedback/alert.tsx`
- Create: `src/components/forms/form-field.tsx`
- Create: `src/components/forms/search-input.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ui/dialog.tsx`
- Modify: `src/components/data-display/status-pill.tsx`
- Modify: `src/components/feedback/empty-state.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces reusable components for future module pages.
- Keeps `StatusPill` as a non-duplicated wrapper around `StatusBadge`.

- [ ] Implement minimal components to satisfy tests.
- [ ] Run focused tests and confirm they pass.

### Task 3: Responsive Portal Shell

**Files:**
- Modify: `src/components/layout/app-shell.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/topbar.tsx`
- Create: `src/components/layout/breadcrumbs.tsx`
- Create: `src/lib/navigation/breadcrumbs.ts`
- Modify: `src/config/navigation.ts`

**Interfaces:**
- Produces desktop sidebar, mobile drawer navigation, topbar with breadcrumbs/context/user display, and RBAC navigation grouping.

- [ ] Refactor shell to manage mobile drawer state.
- [ ] Use existing navigation config and current user placeholder.
- [ ] Preserve accessible active-route state.

### Task 4: Foundation Pages

**Files:**
- Modify: `src/app/(portal)/dashboard/page.tsx`
- Add: `src/app/(portal)/profile/page.tsx`
- Modify: `src/app/unauthorized/page.tsx`

**Interfaces:**
- Produces polished foundation preview dashboard, profile placeholder page, and unauthorized state.

- [ ] Use reusable components only.
- [ ] Avoid real business workflows and final role dashboards.

### Task 5: Documentation And Verification

**Files:**
- Modify: `docs/DESIGN_SYSTEM.md`
- Modify if needed: `docs/FRONTEND_ARCHITECTURE.md`

**Interfaces:**
- Produces accurate implementation documentation.

- [ ] Update design-system documentation to match actual implementation.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.
- [ ] Run visual inspection of `/dashboard`, `/profile`, `/unauthorized` on desktop and mobile widths where possible.
