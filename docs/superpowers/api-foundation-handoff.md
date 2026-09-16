# CareGrid API Foundation & Backend Handoff

This document outlines the architecture for Phase 3 of the CareGrid frontend, defining the standard contracts, mock data, and API interactions.

## 1. API Contracts
All contracts are defined using pure TypeScript in `src/contracts/`. The canonical domain models represent the exact JSON structures the frontend expects to receive from the backend and send to the backend.

- **Common (`common.ts`)**: Base types like `EntityId`, `Money`, `Gender`, `BloodGroup`.
- **Domain Modules**: Separate files (`patient.ts`, `ward.ts`, `organ.ts`, `blood.ts`, `pharmacy.ts`, `billing.ts`, `notification.ts`) contain specific entity shapes.

## 2. API Layer
The frontend fetches data via domain-specific feature hooks located in `src/features/<domain>/hooks/`. These hooks wrap API functions defined in `src/features/<domain>/api/`, which in turn use a central axios/fetch wrapper `src/lib/api/client.ts`.

- Base URL: Configured via `NEXT_PUBLIC_API_BASE_URL` (typically `http://localhost:8000/api/v1`).
- Endpoints: All endpoints are RESTful (e.g., `GET /patients`, `POST /patients/:id/vitals`).

## 3. Mock Service Worker (MSW)
During development, MSW intercepts API requests and fulfills them using a rich, relational mock database.
- **Database (`src/mocks/database/store.ts`)**: Central in-memory data store holding all mock data.
- **Handlers (`src/mocks/handlers/`)**: Implement REST behaviors mapping directly to the frontend's API contracts.
- **Integrity**: Tests ensure that relational keys (e.g., `wardId`, `bedId`, `patientId`) inside mock data point to valid entities.

## 4. Backend Implementation Requirements
To replace the MSW mock layer, the backend must implement endpoints matching those defined in `src/mocks/handlers/`.

1. Match the exact JSON shapes defined in `src/contracts/`.
2. Adhere to the API path structures used by the feature hooks.
3. Handle pagination appropriately as expected by `PaginatedResponse<T>` in `src/contracts/common.ts`.
