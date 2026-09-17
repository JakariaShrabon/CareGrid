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
- **Phase 2 — Auth & Dashboard:** authentication UI and role-based
  dashboard.
- **Phase 3 — Patient-facing modules:** patient management, family portal,
  ward & bed management.
- **Phase 4 — Blood bank modules:** smart blood bank, blood donor
  management, emergency blood SOS.
- **Phase 5 — Organ coordination:** organ matching, waiting list, ischemia
  monitoring, living donor registry.
- **Phase 6 — Clinical & admin modules:** e-prescription, pharmacy
  inventory, billing, insurance claims, digital discharge, responsive
  polish and accessibility hardening.

## Team

| Role | Developer |
|---|---|
| Frontend Developer | **Zafar Muhammad Amran** |
| Backend (Spring Boot) | Team — developed separately |