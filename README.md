# CareGrid.io — Hospital Care Coordination Platform

## Project Overview

**CareGrid.io** is a comprehensive, role-based hospital care coordination web platform designed to streamline clinical workflows across five major operational areas:

- **Organ Donation & Compatibility Matching**: Donor registry, recipient waiting lists, compatibility scoring, cold-ischemia countdown
- **Blood Bank & Emergency SOS**: Component inventory, donor eligibility, geofenced donor search, emergency broadcast workflow
- **Patient Care & Vitals**: Patient records, vital signs monitoring, daily clinical updates, lab results, trend visualization
- **Pharmacy & E-Prescriptions**: Digital prescription builder, pharmacist queue, allergy/interaction warnings, inventory management
- **Billing & Insurance**: Itemized bills, insurance claims, discharge summaries with PDF generation

The platform serves seven key roles: Doctor, Nurse, Blood Bank Coordinator, Pharmacist, Billing Officer, Patient, and Family Attendant.

**Status**: ✓ Phase 11 Complete — Production-Ready for Backend Integration

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Care_grid_project

# Install dependencies
npm install

# Create .env.local (copy from .env.example if exists)
cp .env.example .env.local  # or create manually
```

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_MODE=mock              # "mock" or "remote"
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Development
NODE_ENV=development
```

**Explanation**:

- `NEXT_PUBLIC_API_MODE=mock`: Use mock MSW handlers (default for development)
- `NEXT_PUBLIC_API_MODE=remote`: Use real backend API
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint (when switching to remote mode)

### Development Server

```bash
# Start development server
npm run dev

# Open browser
# → http://localhost:3000
```

The app will start with **Mock Mode** enabled. MSW intercepts API calls and returns mock data.

### Test Accounts (Mock Mode Only)

```
Role: DOCTOR
Email: doctor@caregrid.demo
Password: CareGrid123!

Role: NURSE
Email: nurse@caregrid.demo
Password: CareGrid123!

Role: BLOOD_BANK_COORDINATOR
Email: blood@caregrid.demo
Password: CareGrid123!

Role: PHARMACIST
Email: pharmacist@caregrid.demo
Password: CareGrid123!

Role: BILLING_OFFICER
Email: billing@caregrid.demo
Password: CareGrid123!

Role: PATIENT
Email: patient@caregrid.demo
Password: CareGrid123!

Role: FAMILY_ATTENDANT
Email: family@caregrid.demo
Password: CareGrid123!
```

---

## Development Commands

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Check TypeScript
npm run typecheck

# Expected: 0 errors, 0 warnings (both)
```

### Testing

```bash
# Run Vitest (unit & component tests)
npm run test

# Expected: 93 tests passed

# Run Playwright E2E tests
npx playwright test

# Expected: 13 tests passed

# Run Playwright in UI mode (debug)
npx playwright test --ui
```

### Production Build

```bash
# Build for production
npm run build

# Start production server (after build)
npm start
```

---

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── (auth)/          # Login, password reset
│   ├── (portal)/        # Main application (protected)
│   ├── (public)/        # Public pages (living donor)
│   └── globals.css      # Global styles
├── features/            # Feature modules (one per feature)
│   ├── auth/            # Authentication and session
│   ├── patients/        # Patient management
│   ├── wards/           # Ward/bed management
│   ├── organ/           # Organ donation
│   ├── blood-bank/      # Blood bank operations
│   ├── pharmacy/        # Pharmacy & prescriptions
│   ├── billing/         # Billing & insurance
│   ├── notifications/   # Notification center
│   └── dashboard/       # Role-based dashboards
├── components/          # Reusable UI components
│   ├── layout/          # App shell, sidebar, breadcrumbs
│   ├── data-display/    # Tables, cards, status badges
│   ├── forms/           # Form controls, inputs
│   ├── feedback/        # Loading, error, empty states
│   └── ui/              # Primitives (buttons, dialogs, etc.)
├── config/              # Configuration
│   ├── permissions.ts   # RBAC permission matrix
│   ├── navigation.ts    # Sidebar navigation config
│   └── routes.ts        # Route definitions
├── contracts/           # TypeScript type definitions
│   ├── auth.ts          # Auth types
│   ├── patient.ts       # Patient entity types
│   ├── organ.ts         # Organ matching types
│   ├── blood.ts         # Blood bank types
│   ├── pharmacy.ts      # Pharmacy types
│   ├── billing.ts       # Billing types
│   ├── common.ts        # Shared types
│   └── notification.ts  # Notification types
├── lib/                 # Utilities and helpers
│   ├── api/             # Central API client
│   ├── auth/            # Auth helpers
│   ├── navigation/      # Navigation utilities
│   ├── query/           # React Query setup
│   └── utils/           # General utilities
├── mocks/               # Mock API (MSW)
│   ├── browser.ts       # MSW setup
│   ├── handlers/        # API handlers per feature
│   ├── data/            # Mock data factories
│   └── database/        # Mock database
└── test/                # Tests
    ├── e2e/             # Playwright E2E
    ├── features/        # Feature integration tests
    ├── helpers/         # Test utilities
    └── setup.ts         # Test configuration

docs/
├── PROJECT_CONTEXT.md         # Project purpose and modules
├── API_CONTRACT.md            # API endpoint specifications
├── FRONTEND_ARCHITECTURE.md   # Architecture overview
├── ROUTES_AND_RBAC.md        # Route list and permission mapping
├── DESIGN_SYSTEM.md          # UI/UX principles
├── BACKEND_HANDOFF.md        # Backend integration requirements
├── DATABASE_HANDOFF.md       # Database entity relationships
├── FINAL_REQUIREMENTS_AUDIT.md # Requirements traceability
└── FRONTEND_COMPLETION_REPORT.md # Phase 11 completion
```

---

## Key Architecture Patterns

### Data Flow

```
Page/Component
  ↓
Feature Hook (usePatients, usePrescriptions, etc.)
  ↓
Feature API Service (patientsService, prescriptionService, etc.)
  ↓
Central API Client (src/lib/api/client.ts)
  ↓
MSW Mock Handler (development) or Backend API (production)
```

**Important**: Business UI components never import mock data directly. All data flows through the central client.

### Permission Checking

```typescript
import { can } from "@/lib/auth/permissions";

// In components
if (can("patient.update.write")) {
  // Show edit form
}

// In navigation
const items = navigationConfig.filter((item) => can(item.permission));
```

All permissions defined in `src/config/permissions.ts`. Role-to-permission mapping centralized.

### Feature Services

Each feature owns:

- **Hooks** (`src/features/*/hooks/`): useQuery and useMutation hooks
- **Services** (`src/features/*/services/`): API service (calls central client)
- **Components** (`src/features/*/components/`): Feature UI
- **Types** (`src/contracts/`): Shared TypeScript types

Example: Patient feature

```
src/features/patients/
├── hooks/
│   ├── use-patients.ts
│   └── use-patient-detail.ts
├── services/
│   └── patient-service.ts
└── components/
    ├── patient-list.tsx
    └── patient-detail.tsx
```

---

## Mock vs. Backend Switching

### Development (Mock Mode)

```env
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

- MSW browser worker intercepts API calls
- Mock handlers return predetermined data
- No real backend needed for development

### Production (Backend Mode)

```env
NEXT_PUBLIC_API_MODE=remote
NEXT_PUBLIC_API_BASE_URL=https://your-backend.com/api/v1
```

- Requests sent to real backend
- No code changes needed (same feature components)
- Central API client handles the switch

**No React component rewrite required.**

---

## API Contract & Endpoints

**Full specification**: See `docs/API_CONTRACT.md`

**Common endpoints**:

```
GET    /patients
GET    /patients/:patientId
POST   /patients/:patientId/vitals
GET    /pharmacy/prescriptions
POST   /pharmacy/prescriptions
POST   /pharmacy/prescriptions/:id/dispense
GET    /organ/matches
GET    /blood-bank/inventory
GET    /billing/bills
GET    /billing/discharge/:patientId/pdf
POST   /auth/login
GET    /auth/me
POST   /auth/logout
```

All requests/responses use standardized envelope:

```json
{
  "data": <response>,
  "meta": {
    "requestId": "unique-id",
    "timestamp": "2026-09-13T10:00:00Z"
  }
}
```

---

## Role-Based Access Control (RBAC)

### Canonical Roles

- **DOCTOR**: Prescribe, view patients/organ/blood, manage vitals
- **NURSE**: Record vitals, manage wards, update patient care
- **BLOOD_BANK_COORDINATOR**: Manage blood inventory, handle SOS, view organ matching
- **PHARMACIST**: View prescriptions, dispense, manage inventory
- **BILLING_OFFICER**: Create bills, manage insurance, handle discharge
- **PATIENT**: View own records, discharge
- **FAMILY_ATTENDANT**: View linked patient records only

### Permission Matrix

See `src/config/permissions.ts` for complete mapping.

**Frontend RBAC is UX protection only.** Backend must enforce all authorization.

---

## Testing

### Unit & Component Tests (Vitest)

```bash
npm run test

# Test files: src/test/features/**/*.test.ts[x]
# Coverage: Auth, components, hooks, mock data integrity
```

**Topics covered**:

- Auth flow and session management
- Permission checking
- Component rendering
- API hook behavior
- Mock data factories

### E2E Tests (Playwright)

```bash
npx playwright test

# Test files: src/test/e2e/**/*.spec.ts
# Coverage: Critical user flows
```

**Topics covered**:

- Login and logout
- Dashboard persistence across reload
- Prescription creation and dispensing
- Patient portal isolation
- Living donor registration

**Debugging**:

```bash
# UI mode for visual debugging
npx playwright test --ui

# Debug single test
npx playwright test -g "Doctor creates prescription"

# Headed mode (see browser)
npx playwright test --headed
```

---

## Building & Deployment

### Development Build

```bash
npm run build
npm start
```

Server runs on `http://localhost:3000`

### Production Build

```bash
# Build optimized bundle
npm run build

# Start production server
npm start
```

**Build output**: `.next/` folder with optimized pages and assets

### Environment-Specific Notes

- **Development**: Mock mode (MSW), hot reload enabled
- **Production**: Remote mode (real backend), optimized bundle
- **Testing**: Mock mode with test-specific data

---

## Troubleshooting

### Common Issues

**Issue**: "Session not persisting after reload"

- Ensure `/auth/me` endpoint returns current user
- Check browser cookies are enabled (HttpOnly in production)
- Clear localStorage/cookies and try login again

**Issue**: "Permission denied error"

- Verify user role matches permission requirement
- Check `src/config/permissions.ts` for role-permission mapping
- Ensure backend enforces same permissions

**Issue**: "API request failing in development"

- Verify MSW is running (check browser console)
- Confirm mock handler exists in `src/mocks/handlers/`
- Check API endpoint path matches `NEXT_PUBLIC_API_BASE_URL`

**Issue**: "Tests failing after code changes"

- Run `npm run typecheck` first (catch type errors)
- Run `npm run lint` (catch code style issues)
- Run `npm run test` (run all tests)
- Run `npx playwright test` (run E2E tests)

### Debug Commands

```bash
# Check all potential issues
npm run lint && npm run typecheck && npm run test && npx playwright test && npm run build

# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Documentation

**Essential files**:

- `docs/PROJECT_CONTEXT.md` — Project overview and scope
- `docs/FRONTEND_ARCHITECTURE.md` — Architecture explanation
- `docs/API_CONTRACT.md` — API endpoint specifications
- `docs/BACKEND_HANDOFF.md` — Backend integration requirements
- `docs/DATABASE_HANDOFF.md` — Database entity relationships
- `docs/DESIGN_SYSTEM.md` — UI/UX principles and components

**Phase documentation**:

- `docs/superpowers/plans/` — Phase planning docs
- `docs/FINAL_REQUIREMENTS_AUDIT.md` — Requirements traceability (Phase 11)
- `docs/FRONTEND_COMPLETION_REPORT.md` — Completion status (Phase 11)

---

## Backend Integration

**When ready to integrate backend**:

1. Update `.env.local`:

   ```env
   NEXT_PUBLIC_API_MODE=remote
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url/api/v1
   ```

2. Restart dev server: `npm run dev`

3. Run E2E tests: `npx playwright test`

**No frontend code changes required.** Feature components remain unchanged.

**Backend must implement**:

- All auth endpoints
- RBAC enforcement on every endpoint
- Business rule authority (organ matching, drug interactions, billing, etc.)
- Resource-level authorization (patient scoping, family attendant linking)
- Audit logging

See `docs/BACKEND_HANDOFF.md` for complete specifications.

---

## Performance & Monitoring

### Development Mode

- HMR (Hot Module Reload) enabled for instant feedback
- Source maps available for debugging
- Console shows development warnings

### Production Build

- Code splitting optimized
- Images optimized
- CSS/JavaScript minified
- Bundle size: ~107 kB initial JS (shared)

### Monitoring Points

- Session validation on app load
- API response times (use browser DevTools Network tab)
- Memory usage (watch for leaks in long-running sessions)
- Bundle size (run `npm run build` to see route-specific sizes)

---

## Support & Help

**Questions about**:

- **Frontend architecture**: See `docs/FRONTEND_ARCHITECTURE.md`
- **API contract**: See `docs/API_CONTRACT.md`
- **RBAC/permissions**: Check `src/config/permissions.ts`
- **Component usage**: Check `src/components/`
- **Backend integration**: See `docs/BACKEND_HANDOFF.md`

---

## License & Attribution

CareGrid.io is a hospital care coordination platform developed for healthcare workflow optimization. Mock data is fictional and for demonstration only.

---

**Project Status**: ✓ Phase 11 Complete — Production Ready  
**Last Updated**: 2026-09-13  
**For Issues**: Check `docs/FRONTEND_COMPLETION_REPORT.md` for known limitations
