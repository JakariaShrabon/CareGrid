# CareGrid.io

**A Unified Digital Platform for Hospital Care, Blood & Organ Coordination**

> **26 modules** · 6 role-based dashboards · React 19 + TypeScript + Vite
> Frontend-only. Data flows through a service layer that mirrors REST, so the
> Spring Boot backend can be swapped in without touching the UI.

| Modules 1–10 | Modules 11–26 |
|---|---|
| Landing, auth, dashboard, patients, family portal, organ matching, waiting list, ischemia, living donors, smart blood bank | Vitals, wards, e-prescription, pharmacy overview, inventory, safety alerts, billing, invoices, insurance claims, digital discharge, notifications, settings |

**Latest work — modules 11 to 26.** Billing, insurance claims and digital
discharge are complete and cross-linked: each discharge mirrors its invoice,
and both datasets run assertion guards at load time so the ledgers cannot
drift. Notifications, settings and the pharmacy overview round out the
operational side.

```bash
npm install && npm run dev     # http://localhost:5173
```

Demo password for every account: `Caregrid@2026` — see
[Getting Started](#getting-started).

---

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

### What was built

| # | Module | Route | Service layer | Notes |
|---|---|---|---|---|
| 11 | Vitals Monitoring | `/app/vitals`, `/app/vitals/:patientId` | `VitalsService` | Trends with abnormal-reading flags |
| 12 | Ward & Bed Management | `/app/wards` | `WardService` | Live bed occupancy grid |
| 13 | E-Prescription | `/app/pharmacy/prescriptions`, `/:prescriptionId` | `PharmacyService` | Write, review and dispense |
| 14 | Pharmacy Overview | `/app/pharmacy` | `PharmacyService` | Queue, stock pressure, open alerts |
| 15 | Pharmacy Inventory | `/app/pharmacy/inventory` | `PharmacyService` | Stock, reorder points, expiry |
| 16 | Pharmacy Safety Alerts | `/app/pharmacy/alerts` | `PharmacyService` | Allergy, interaction, duplicate, stock |
| 17 | Billing | `/app/billing` | `BillingService` | Revenue KPIs, status mix, outstanding |
| 18 | Invoice Management | `/app/billing/invoices`, `/:invoiceId` | `BillingService` | Line items, coverage, discounts, transitions |
| 19 | Insurance Claims | `/app/billing/claims`, `/:claimId` | `BillingService` | Claim lifecycle and settlement |
| 20 | Digital Discharge | `/app/discharge`, `/:patientId` | `DischargeService` | Blockers, checklist, summary, balance |
| 21 | Notifications | `/app/notifications` | `NotificationService` | Role-scoped centre + topbar popover |
| 22 | Settings | `/app/settings` | `SettingsService` | Profile, password, preferences, sessions |

### Where the code lives

| Area | Path | Contents |
|---|---|---|
| Domain models | `src/types/` | `billing`, `discharge`, `notifications`, `settings` — status unions and interfaces |
| Business rules | `src/lib/` | `billing`, `discharge`, `format`, `table`, `roles` — pure functions, no React |
| Fictional data | `src/data/mock/` | `billing`, `discharge`, `notifications`, `settings` — each with an import-time assertion guard |
| Service contracts | `src/services/` | REST-shaped interfaces plus the mock implementations they resolve to |
| Module UI | `src/components/billing/`, `src/components/settings/`, `src/components/notifications/` | Status badges, money breakdown, charts, panels, rows |
| Pages | `src/pages/app/` | One file per route, all lazy-loaded |
| Routes | `src/routes/`, `src/config/app-navigation.ts` | Route tree and role-aware navigation |

### Design decisions worth knowing

- **Cross-linked ledgers.** A discharge's billing snapshot is generated from
  its invoice, so `gross − insurance − paid − waived = outstanding` holds by
  construction. Editing one without the other fails at load.
- **Owner-scoped checklists.** Each discharge checklist item names its owning
  team, and only that role can close it — a pharmacist cannot tick off a
  doctor's sign-off.
- **Explicit userId in settings.** Profile operations take the session user's
  id rather than reading a fixed demo user, so the same contract works against
  an authenticated backend.
- **One notification feed.** The topbar popover and the full page share a
  single role-scoped React Query feed; read state lives in the browser, not on
  a server.
- **Guards over silent drift.** Where two datasets must agree, the mock asserts
  the invariant at import and throws a specific message rather than rendering
  a wrong number.


## Try the Demo

All modules run on fictional demo data with a shared password:
`Caregrid@2026`. The full sign-in walkthrough and account list are in
[Getting Started](#getting-started).

## Roles and Access

Every account sees only the navigation its role allows, and action buttons
are gated to the roles that own them:

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

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 or newer (`node --version`) |
| npm | 9 or newer, bundled with Node |

No database, API server or environment variables are required. Every module
runs on in-memory fictional demo data.

### Run it locally

```bash
# 1. install dependencies
npm install

# 2. start the development server
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`. Open it in your
browser. The app loads the public landing page with no login required.

### Sign in

1. Go to `/login`.
2. Pick any demo account below, or type the email manually.
3. Enter the shared password `Caregrid@2026`.
4. You are redirected to `/app/dashboard`, and the sidebar, KPIs and
   notification feed adapt to the selected role.

| Role | Email | Sees |
|---|---|---|
| Doctor | `shahid.hasan@caregrid.io` | Clinical, wards, organ, discharge release |
| Nurse | `ayesha.malik@caregrid.io` | Clinical, wards, organ, discharge release |
| Blood Bank Coordinator | `fatima.noor@caregrid.io` | Blood bank modules |
| Pharmacist | `imran.chowdhury@caregrid.io` | Pharmacy modules |
| Billing Officer | `rana.khan@caregrid.io` | Billing, invoices, claims |
| Patient / Family | `tanvir.ahmed@caregrid.io` | Dashboard and family portal only |

The session is held in a Zustand store with `localStorage` persistence, so
a refresh keeps you signed in. Use the profile menu → **Sign out** to clear
it.

### Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

### Verify the project is healthy

```bash
npm run lint     # expect: no errors
npm run build    # expect: "built in Xs"
```

If the billing or discharge fixtures ever disagree with each other, the app
fails at load with a specific assertion message rather than rendering a
wrong ledger. See [Demo data integrity](#demo-data-integrity).

### Troubleshooting

| Symptom | Fix |
|---|---|
| `npx.ps1 cannot be loaded because running scripts is disabled` | PowerShell execution policy. Run through `cmd /c npx ...`, or call the binary directly: `& "C:\Program Files\nodejs\node.exe" ".\node_modules\typescript\bin\tsc" -b --noEmit` |
| Port 5173 already in use | Vite picks the next free port automatically; use the URL it prints |
| `Cannot find module '@/components/ui/...'` | Run `npm install` — the `@` alias is resolved by Vite and `tsconfig.app.json`, not by Node |
| Changes not appearing | Confirm the dev server is running and hard-reload the browser |

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

## Team

| Role                  | Developer                              | GitHub                                     |
| --------------------- | -------------------------------------- | ------------------------------------------ |
| Frontend Developer    | **Zafar Muhammad Amran** (`amransuui`) | [@amransuui](https://github.com/amransuui) |
| Backend (Spring Boot) | Team — developed separately            | —                                          |

Repository: https://github.com/JakariaShrabon/CareGrid
Active branch: `Zafar-Muhammad-Amran`


