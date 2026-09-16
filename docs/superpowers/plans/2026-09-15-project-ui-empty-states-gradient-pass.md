# Project UI Empty States And Gradient Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve project-wide UI resilience when data is empty and add restrained medical gradients to shared cards/surfaces.

**Architecture:** Use shared primitives first so tables, loading, error, empty, and stats improve across the portal. Patch direct empty surfaces that bypass shared primitives. Add tests for defensive rendering and dashboard non-blank behavior.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library, existing lucide-react icons.

**Spec:** User-approved chat request on 2026-09-15.

## Global Constraints

- No auth logic changes.
- No clinical mutation or auto-linking behavior changes.
- No real patient auto-create.
- Mock/demo data may be used only for mock/demo presentation.
- Components must render safely for `undefined`, `null`, and empty arrays.
- Use professional medical gradients: cyan, teal, emerald, sky, white.
- No new dependencies.
- Avoid `globals.css` unless absolutely necessary.

---

### Task 1: Shared Feedback And Table Surfaces

**Files:**
- Modify: `src/components/feedback/empty-state.tsx`
- Modify: `src/components/feedback/loading-state.tsx`
- Modify: `src/components/feedback/error-state.tsx`
- Modify: `src/components/data-display/data-table-shell.tsx`
- Modify: `src/components/data-display/stat-card.tsx`
- Test: `src/test/helpers/design-system.test.tsx`

**Interfaces:**
- `EmptyState({ title, description, icon, action })`
- `LoadingState({ label })`
- `ErrorState({ title, description, icon, action })`
- `DataTableShell({ isLoading, error, isEmpty, ... })`
- `StatCard({ title, value, icon, ... })`

- [ ] Write tests asserting empty/loading/error/stat/table shells keep accessible copy and include gradient-safe classes.
- [ ] Run focused design-system test and confirm red for new visual classes.
- [ ] Add professional gradient surfaces in shared components.
- [ ] Rerun focused design-system test and confirm green.

### Task 2: Direct Empty State Components

**Files:**
- Modify: `src/features/patients/components/daily-updates-timeline.tsx`
- Modify: `src/features/patients/components/vitals-charts.tsx`
- Modify: `src/features/patients/components/patient-lab-results.tsx`
- Modify: `src/features/billing/components/bill-items-table.tsx`
- Modify: `src/features/billing/components/discharge-summary-view.tsx`
- Modify: `src/features/dashboard/components/shared/dashboard-quick-actions.tsx`
- Test: focused existing feature tests where present.

**Interfaces:**
- Keep component props unchanged.
- Empty arrays should render polished `EmptyState`.
- `DashboardQuickActions` should render a read-only empty action state instead of `null`.

- [ ] Write/update tests for one representative empty timeline and dashboard quick actions behavior.
- [ ] Run focused tests and confirm red where UI is missing.
- [ ] Replace plain text/null empty surfaces with `EmptyState`.
- [ ] Rerun focused tests and confirm green.

### Task 3: Dashboard And Card Gradient Polish

**Files:**
- Modify: `src/features/dashboard/components/shared/dashboard-section.tsx`
- Modify: overview card modules only if needed after shared `StatCard` changes.

**Interfaces:**
- Dashboard section props unchanged.
- No role dashboard data logic changes.

- [ ] Add soft gradient section shells where appropriate.
- [ ] Ensure dashboard role pages still render with current tests.
- [ ] Run dashboard-focused tests or full Vitest.

### Task 4: Final Verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Report files changed and verification results.
