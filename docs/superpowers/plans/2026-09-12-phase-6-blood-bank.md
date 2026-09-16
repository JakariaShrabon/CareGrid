# Phase 6: Blood Bank Module Implementation Plan

## 1. Overview
The Blood Bank module manages blood inventory, donor directory, emergency SOS, and a geofenced donor map. The architecture is fully defined by existing API contracts and mock handlers. The frontend will remain strictly presentation-focused, deferring clinical/business logic (e.g., expiry dates, donor eligibility, SOS matching) to the backend.

## 2. Routes and RBAC
- `/blood-bank`: Overview dashboard.
- `/blood-bank/inventory`: Blood component inventory summary.
- `/blood-bank/units`: Blood unit list with expiration tracking.
- `/blood-bank/donors`: Privacy-conscious donor directory.
- `/blood-bank/sos`: Emergency SOS workflows.
- `/blood-bank/map`: Geofenced eligible donor map.

**RBAC**:
All routes will be protected by `blood.inventory.read`, `blood.donor.read`, `blood.sos.create`, and `blood.map.read` respectively in `ROUTE_ACCESS_RULES` in `src/config/routes.ts`.

## 3. UI Components
All components will reside in `src/features/blood-bank/components/`.

### 3.1 Overview (`BloodOverviewCards` & `BloodBankNavigation`)
- Consumes `useBloodOverview`.
- Displays High-level metrics: Available Units, Low Stock Alerts, Active SOS, Donors.
- Provides quick links to submodule pages.

### 3.2 Inventory (`InventoryTable`)
- Consumes `useBloodInventory`.
- Matrix table displaying Blood Group x Component, safe thresholds, and current status (SAFE, WARNING, CRITICAL).
- Status rendered directly from API response (no local `units < N` checks).

### 3.3 Blood Units (`BloodUnitTable`)
- Consumes `useBloodUnits`.
- Columns: Unit ID, Blood Group, Component, Collected At, Expires At, Status.
- Includes display-only time-window filters for expiry.

### 3.4 Donors (`DonorTable`)
- Consumes `useBloodDonors`.
- Columns: Reference/Name, Blood Group, Eligibility, Next Eligible Date.
- No local 56-day rule derivation. Eligibility maps directly to UI semantics.

### 3.5 Emergency SOS (`SosList` & `CreateSosForm`)
- Consumes `useBloodSos` and `useCreateBloodSos`.
- Form uses `zod` and `react-hook-form`. Includes a high-impact confirmation step before broadcasting.

### 3.6 Geofenced Map (`DonorMap` & `DonorMapFallback`)
- Safe dynamic import of Leaflet (`react-leaflet`).
- Fallback list view handles gracefully if map assets fail or data is missing.
- Strict reliance on API-provided distance and location.

## 4. Testing
- Mock handlers already exist and provide data.
- E2E Playwright test simulating Coordinator workflows (Inventory, Donors, SOS, Map fallback).
- Vitest testing of render states (Loading, Error, Empty, Data) for all views.
