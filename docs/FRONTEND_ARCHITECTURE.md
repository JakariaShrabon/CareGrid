# Frontend Architecture

## Structure

The frontend uses a Next.js App Router project under `src/`:

- `app/`: route groups for public, auth, portal, and unauthorized views.
- `components/`: shared UI, layout, data display, forms, charts, and feedback components.
- `features/`: feature-owned API services and query hooks.
- `config/`: navigation, routes, and permission configuration.
- `contracts/`: shared TypeScript contracts for frontend/backend integration.
- `lib/`: API client, auth helpers, query provider, utilities, and validation.
- `mocks/`: MSW browser worker, handlers, mock data, and factories.
- `test/`: Vitest setup and helper tests.

## Data Flow

The required data flow is:

```text
Page/UI
  -> feature component
  -> TanStack Query hook
  -> feature API/service
  -> central API client
  -> MSW mock API today or real backend API later
```

UI must not import mock data directly. Mock data belongs behind MSW handlers and service functions.

## Feature Boundaries

Each feature owns its API service and query keys. Shared contracts live in `src/contracts` so backend integration can align to a stable surface. Phase 9 has established read-only patient and family portals, public donor registration, and a shared notification center. Dashboard screens for clinical roles remain for future phases.

## API Mode Switching

Environment variables:

```text
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

`mock` mode starts MSW in the browser and responds to API-client requests. `remote` mode uses the same central API client and feature services against the configured backend URL.

## Business Authority

The frontend may display precomputed values but must not be authoritative for:

- organ compatibility calculations
- donor eligibility decisions
- drug interaction calculations
- final billing calculations
- permissions or security authorization

Those rules must be enforced by backend services and persisted audit trails.
