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
| Client state | Zustand (session + minimal global UI state only) |
| Charts | Recharts |
| Forms | React Hook Form · Zod |

## Repository Scope

This repository is **frontend-only**.

- **Included:** React UI, service abstraction layer with mock data, design
  system, documentation.
- **Not included (developed by teammates):** Java / Spring Boot backend,
  database schemas, and REST API server code.

Nothing in this app performs a real clinical, financial or identity action.
Billing, insurance claims, discharge, medication and vital data are **fictional
demo data**, and every money value is in Bangladeshi Taka (BDT / `৳`).

## Architecture

The frontend follows a clean **service/API abstraction** pattern:

- All features interact with data through a dedicated service layer
  (`src/services`).
- Services currently run on **realistic fictional mock data** for frontend
  development.
- Service interfaces mirror REST-style operations (list / get / create /
  update / delete), so the mock services can later be **swapped for Spring
  Boot REST API clients without changing UI code**.
- Domain models live in `src/types`, pure business rules in `src/lib`, and
  fixtures in `src/data/mock`.

```
React Components (UI)
        |
        v
Service/API Abstraction Layer
        |
        +-- Mock Services (now)
        +-- Spring Boot REST API clients (later)
```

### Demo data integrity

Billing and discharge fixtures are cross-linked, and both mock datasets run an
assertion guard at import time (`assertLedgerIsConsistent` and
`assertDischargeDatasetIsConsistent`). The invariants are:

- `gross − insurance − paid − waived = outstanding`
- A paid invoice has a zero outstanding balance; a draft or cancelled invoice
  carries no payment or coverage.
- A claim's claimed amount equals its linked invoice's gross amount, and a
  settled claim's history ends on its current status.
- A `ready` discharge has complete documentation, no open required checklist
  items, a settled balance and no outstanding coordination items.

If a fixture is edited and breaks one of these rules, the app fails loudly at
load rather than showing an inconsistent ledger.

## Modules (1–26)

### Core modules (1–10)

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
   clinical detail view.
5. **Family Portal** (`/app/family`) — a read-only, family-friendly summary
   of a linked patient's care: vitals, upcoming care, billing, discharge
   status and notifications.
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

### Operational modules (11–26)

11. **Vitals Monitoring** (`/app/vitals`, `/app/vitals/:patientId`) — trends
    and abnormal-reading flags.
12. **Ward & Bed Management** (`/app/wards`) — live bed occupancy grid.
13. **E-Prescription** (`/app/pharmacy/prescriptions`,
    `/app/pharmacy/prescriptions/:prescriptionId`) — write, review and
    dispense prescriptions.
14. **Pharmacy Overview** (`/app/pharmacy`) — dispensing queue, stock
    pressure and open safety alerts at a glance.
15. **Pharmacy Inventory** (`/app/pharmacy/inventory`) — stock levels,
    reorder points and expiry tracking.
16. **Pharmacy Safety Alerts** (`/app/pharmacy/alerts`) — simulated allergy,
    interaction, duplicate-medication and stock alerts.
17. **Billing** (`/app/billing`) — revenue KPIs, status charts, outstanding
    balances and claim queue.
18. **Invoice Management** (`/app/billing/invoices`,
    `/app/billing/invoices/:invoiceId`) — invoice register with line items,
    coverage, discounts and status transitions.
19. **Insurance Claims** (`/app/billing/claims`,
    `/app/billing/claims/:claimId`) — claim lifecycle with insurer responses
    and settlement tracking.
20. **Digital Discharge** (`/app/discharge`, `/app/discharge/:patientId`) —
    readiness blockers, owner-scoped checklist, draft summary, medicines,
    follow-up and the admission balance.
21. **Notifications** (`/app/notifications`) — role-scoped in-app notification
    centre shared by the topbar popover; read state is local to the browser.
22. **Settings** (`/app/settings`) — profile, password, appearance,
    notification channels and demo session management.

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

## Roles and Access

| Role | Sees |
|---|---|
| Doctor / Nurse | Clinical, wards, organ, discharge release |
| Blood bank coordinator | Blood bank modules only |
| Pharmacist | Pharmacy modules only |
| Billing officer | Billing, invoices, claims |
| Patient / family | Dashboard and family portal only |

Role checks live in `src/lib/roles.ts`. They are **rendering affordances for
the demo, not an authorization mechanism** — real RBAC arrives with the
backend.

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

> On Windows, if PowerShell blocks `npx.ps1` (`PSSecurityException`), run the
> same script through `cmd /c npx ...` or invoke the local binary directly.

## Project Structure

```
src/
├── components/          # Reusable UI
│   ├── ui/              # shadcn/ui primitives (via shadcn CLI)
│   ├── common/          # Higher-order: DataTable, PageHeader, KpiCard, states...
│   ├── charts/          # Theme-aware Recharts wrappers
│   ├── billing/         # Money + billing/discharge status presentation
│   ├── settings/        # Settings panels
│   ├── layout/          # App shell: sidebar, topbar, notification centre
│   ├── brand/           # Logo / brand primitives
│   └── theme/           # ThemeProvider (system/light/dark)
├── layouts/             # PublicLayout, AppLayout (sidebar + topbar shell)
├── routes/              # Route tree + lazy route components (public, app)
├── pages/               # Route-level pages grouped by module
│   ├── public/          # Landing, auth, 404
│   └── app/             # Authenticated module pages
├── services/            # Data-access layer (mock APIs, REST-shaped signatures)
├── data/mock/           # Centralized fictional mock data
├── types/               # Domain models + status unions
├── hooks/               # React Query hooks (queries/mutations)
├── store/               # Zustand session + UI store only
├── config/  lib/        # Navigation config; pure business rules
└── App.tsx  main.tsx    # Providers + router + entry
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
  ward & bed management, vitals.
- **Phase 4 — Blood bank modules ✅** smart blood bank, blood donor
  management, emergency blood SOS.
- **Phase 5 — Organ coordination ✅** organ matching, waiting list, ischemia
  monitoring, living donor registry.
- **Phase 6 — Clinical & admin modules ✅** pharmacy overview, e-prescription,
  pharmacy inventory, billing, insurance claims, digital discharge,
  notifications, settings, and responsive/accessibility polish.

**Next:** swap the mock services for Spring Boot REST clients with the same
interfaces, and move role checks from the UI to server-side enforcement.

## Team

| Role | Developer |
|---|---|
| Frontend Developer | **Zafar Muhammad Amran** |
| Backend (Spring Boot) | Team — developed separately |
