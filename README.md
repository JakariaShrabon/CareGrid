# CareGrid.io

**A Unified Digital Platform for Hospital Care, Blood & Organ Coordination**

CareGrid.io is a digital platform that unifies hospital care operations with
blood bank and organ coordination workflows. This repository contains the
**frontend application only**; the backend is developed separately by
teammates with Spring Boot.

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React.js 19 (TypeScript) |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| UI components | shadcn/ui · Radix UI · Lucide React |
| Server state | TanStack React Query |
| Client state | Zustand (minimal global UI state only) |
| Charts | Recharts |
| Forms | React Hook Form · Zod |

## Repository Scope

This repository is **frontend-only**.

- **Included:** React UI, service abstraction layer with mock data, design
  system, documentation.
- **Not included (developed by teammates):** Java / Spring Boot backend,
  database schemas, and REST API server code.

## Architecture

The frontend follows a clean **service/API abstraction** pattern:

- All features interact with data through a dedicated service layer
  (`src/services`).
- Services currently run on **realistic fictional mock data** for frontend
  development.
- Service interfaces mirror REST-style operations (list / get / create /
  update / delete), so the mock services can later be **swapped for Spring
  Boot REST API clients without changing UI code**.

```
React Components (UI)
        |
        v
Service/API Abstraction Layer
        |
        +-- Mock Services (now)
        +-- Spring Boot REST API clients (later)
```

## Core Modules (1–10)

Every core module ships with its own service layer, realistic fictional mock
data, and a verified UI.

1. **Landing Page** (`/`) — marketing page with hero, feature highlights and
   sign-up call-to-action.
2. **Authentication UI** (`/login`, `/register`, `/forgot-password`) —
   role-based demo accounts, form validation, session persistence and route
   guards.
3. **Role-Based Dashboard** (`/app/dashboard`) — KPI cards, admissions /
   discharges chart, alert feed, and a sidebar that adapts to the signed-in
   role.
4. **Patient Management** (`/app/patients`, `/app/patients/:patientId`) —
   searchable, filterable, sortable patient list with pagination and a full
   clinical detail view (admission, ward & bed, care team, medications,
   timeline).
5. **Family Portal** (`/app/family`) — a read-only, family-friendly summary
   of a linked patient's care: latest vitals, upcoming care, billing,
   discharge status, notifications and emergency contact.
6. **Organ Matching** (`/app/organ/matching`) — donor-recipient candidates
   ranked by compatibility score with filters and a match detail drawer.
7. **Organ Waiting List** (`/app/organ/waiting-list`) — patients waiting by
   priority, organ and blood group, with status updates.
8. **Ischemia Monitoring** (`/app/organ/ischemia`) — live cold-ischemia
   timers against safe windows with warning tones.
9. **Living Donor Registry** (`/app/organ/living-donors`) — donor KPIs,
   sortable table, availability, evaluation status and detail drawer.
10. **Smart Blood Bank** (`/app/blood/inventory`, `/blood/donors`,
    `/blood/requests`, `/blood/sos`) — 8-group × 4-component stock matrix,
    donor eligibility (56-day rule), cross-hospital requests and emergency
    SOS broadcasting.

**Extras:** Vitals trending, Ward & Bed management, Pharmacy
(e-prescriptions, inventory, safety alerts).

## Try the Demo

All modules run on fictional demo data with a shared password:
`Caregrid@2026`

| Role | Email |
|---|---|
| Doctor | `shahid.hasan@caregrid.io` |
| Nurse | `ayesha.malik@caregrid.io` |
| Blood Bank Coordinator | `fatima.noor@caregrid.io` |
| Pharmacist | `imran.chowdhury@caregrid.io` |
| Billing Officer | `rana.khan@caregrid.io` |
| Patient / Family | `tanvir.ahmed@caregrid.io` |

## Getting Started

Prerequisites: Node.js 18+ and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server
```

Other scripts:

```bash
npm run build      # production build (tsc -b && vite build)
npm run preview    # preview the production build
npm run lint       # lint with oxlint
npx tsc --noEmit   # typecheck
```

## Project Structure

```
src/
├── components/          # Reusable UI
│   ├── ui/              # shadcn/ui primitives (via shadcn CLI)
│   ├── common/          # Higher-order: DataTable, PageHeader, StatCard, states...
│   ├── charts/          # Theme-aware Recharts wrappers
│   ├── tables/          # Cell renderers, sort headers, row actions
│   ├── feedback/        # Toaster, NotificationPanel, UserMenu
│   ├── layout/          # Public header/footer shell pieces
│   ├── brand/           # Logo / brand primitives
│   └── theme/           # ThemeProvider (system/light/dark)
├── layouts/             # PublicLayout, AppLayout (sidebar + topbar shell)
├── routes/              # Route tree + config (public, app)
├── pages/               # Route-level pages grouped by module
│   ├── public/          # Landing, auth, 404
│   ├── dashboard/ patients/ wards/ organ/ blood/ pharmacy/ billing/ system/
├── features/            # Feature-private UI + stateful logic per module
├── services/            # Data-access layer (mock APIs, REST-shaped signatures)
├── data/mock/           # Centralized fictional mock data
├── types/               # Domain models + status unions
├── hooks/               # React Query hooks (queries/mutations)
├── contexts/  store/    # App context; Zustand UI store only
├── config/  lib/  utils/
├── App.tsx  main.tsx    # Providers + router + entry
```

## Roadmap

The application is developed **phase by phase**, with each phase verified
before moving on:

- **Phase 1 — Foundation ✅** Vite + TS scaffold, Tailwind CSS, shadcn/ui,
  React Router, React Query, Zustand, layout & theme foundation, service
  layer skeleton, landing page.
- **Phase 2 — Auth & Dashboard ✅** authentication UI and role-based
  dashboard.
- **Phase 3 — Patient-facing modules ✅** patient management, family portal,
  ward & bed management.
- **Phase 4 — Blood bank modules ✅** smart blood bank, blood donor
  management, emergency blood SOS.
- **Phase 5 — Organ coordination ✅** organ matching, waiting list, ischemia
  monitoring, living donor registry.
- **Phase 6 — Clinical & admin modules 🔜** e-prescription, pharmacy
  inventory, billing, insurance claims, digital discharge, responsive
  polish and accessibility hardening.

## Team

| Role | Developer |
|---|---|
| Frontend Developer | **Zafar Muhammad Amran** |
| Backend (Spring Boot) | Team — developed separately |