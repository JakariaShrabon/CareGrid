# Phase 10: Final Role-Specific Dashboards

## Goal
Implement the final role-specific dashboard views at the single `/dashboard` route for all 7 roles (DOCTOR, NURSE, BLOOD_BANK_COORDINATOR, PHARMACIST, BILLING_OFFICER, PATIENT, FAMILY_ATTENDANT). Dashboards will compose existing feature hooks without modifying the mock backend or domain contracts.

## Architecture

We will introduce a new `dashboard` feature boundary at `src/features/dashboard/`.

### Directory Structure
```
src/features/dashboard/
  components/
    role-dashboard.tsx (main switcher)
    shared/
      dashboard-stat-grid.tsx
      dashboard-quick-actions.tsx
      dashboard-section.tsx
      recent-notification-list.tsx
    roles/
      doctor-dashboard.tsx
      nurse-dashboard.tsx
      blood-bank-dashboard.tsx
      pharmacist-dashboard.tsx
      billing-dashboard.tsx
      patient-dashboard.tsx
      family-dashboard.tsx
  hooks/
    use-doctor-dashboard-data.ts
    use-nurse-dashboard-data.ts
    ... (one hook per role)
```

### Data Flow
1. The user hits `/dashboard`.
2. `src/app/(portal)/dashboard/page.tsx` renders `RoleDashboard`.
3. `RoleDashboard` switches on `user.role` and renders the specific dashboard (e.g., `DoctorDashboard`).
4. `DoctorDashboard` calls `useDoctorDashboardData()`.
5. `useDoctorDashboardData` calls existing hooks (e.g., `usePatients()`, `useOrganMatches()`, `useNotifications()`) and returns an aggregated view model containing `data`, `isLoading`, and `error`.
6. `DoctorDashboard` handles loading/error via existing shared components and renders metrics via `DashboardStatGrid` and actionable links via `DashboardQuickActions`.

## Roles & Features

*   **DOCTOR**: Active patients, match summary, critical transit summary, ward availability, notifications. Actions: Patients, Organ Matches, Ischemia Tracker, Create Prescription, Wards.
*   **NURSE**: Assigned patients, bed status, recent vitals, notifications. Actions: Patients, Record Vitals, Wards.
*   **BLOOD_BANK_COORDINATOR**: Available units, low stock, active SOS. Actions: Inventory, Units, Donors, SOS, Map.
*   **PHARMACIST**: Pending prescriptions, dispenses, low-stock medicines. Actions: Prescription Queue, Pharmacy Inventory.
*   **BILLING_OFFICER**: Open bills, pending/approved claims, discharges. Actions: Bills, Claims, Discharge.
*   **PATIENT**: Read-only, link to My Care, own prescriptions/billing (if permitted). Actions: My Care.
*   **FAMILY**: Strictly read-only linked patient context. Actions: Family Care.

## Execution Guardrails
- **No new domains**: Leverage existing feature hooks.
- **One Route**: Use `src/app/(portal)/dashboard/page.tsx`.
- **Backend Compatibility**: Dashboards use hook-based aggregation, setting the stage for a future unified `GET /dashboard` backend endpoint.
- **Error Handling**: Dashboard level loading and error handling using existing UI states, gracefully failing specific sections where possible.
