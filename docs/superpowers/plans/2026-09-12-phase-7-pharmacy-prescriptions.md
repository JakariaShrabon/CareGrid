# Phase 7: Digital Prescription & Pharmacy Module

This implementation plan outlines the architecture for the Digital Prescription Builder, Safety Checks, Pharmacist Queue, Dispensing Workflow, and Pharmacy Inventory synchronization.

## Goal
Build the unified frontend architecture for CareGrid's E-Prescription and Pharmacy management, fully leveraging the verified mock APIs and avoiding independent frontend business logic for safety calculations or stock deductions.

## User Review Required
> [!IMPORTANT]
> The source specification notes a safety step but doesn't prescribe a strict frontend bypass policy. I have assumed that **only safe or acknowledged warnings** are permitted to proceed, and that `useCheckPrescriptionSafety` handles the server's determination. If the backend entirely rejects `INTERACTION_WARNING` with a 400 Bad Request, the UI will reflect that. Does this match the backend assumption?

> [!WARNING]
> The workflow state machine will map to Phase 3's `PrescriptionStatus`: `DRAFT | PENDING | REVIEWED | READY | DISPENSED | CANCELLED`. Note that these are implementation workflow assumptions, not source-defined medical statuses.

## Proposed Changes

---

### Pharmacy Layout & Navigation
Update the global `RequireRole` configuration and routes to support unified endpoints.

#### [MODIFY] src/config/routes.ts
- Export new pharmacy routes (`/pharmacy`, `/pharmacy/prescriptions`, `/pharmacy/inventory`).

#### [MODIFY] src/app/(portal)/layout.tsx & navigation config
- Add `Pharmacy` to sidebar navigation for DOCTOR, NURSE, and PHARMACIST roles.

#### [NEW] src/app/(portal)/pharmacy/layout.tsx
- Simple layout utilizing the global `PageContainer` and mapping `Breadcrumbs` appropriately.

---

### Data Hooks & API (src/features/pharmacy/)
Map the existing mock endpoints to TanStack Query hooks.

#### [NEW] src/features/pharmacy/api/pharmacy.keys.ts
- Establish `queryKeys` for `overview`, `prescriptions`, `prescription(id)`, and `inventory`.

#### [NEW] src/features/pharmacy/api/pharmacy.api.ts
- Fetch wrappers pointing to `/api/prescriptions`, `/api/prescriptions/check-safety`, `/api/pharmacy/inventory`, `/api/pharmacy/dispense`.

#### [NEW] src/features/pharmacy/hooks/use-pharmacy.ts
- Provide hooks: `usePrescriptions`, `usePrescription`, `usePharmacyInventory`, `useCreatePrescription`, `useCheckPrescriptionSafety`, `useDispensePrescription`.

---

### Pharmacy Overview & Inventory

#### [NEW] src/app/(portal)/pharmacy/page.tsx
- Central operational overview displaying high-level queue metrics.
- Uses `RequireRole` for DOCTOR and PHARMACIST.
- Provides quick links (`prescription.create`, `pharmacy.inventory.read`).

#### [NEW] src/app/(portal)/pharmacy/inventory/page.tsx
- Inventory table using `DataTableShell`.
- Renders `PharmacyInventoryItem` properties including low-stock threshold API status.

#### [NEW] src/features/pharmacy/components/pharmacy-inventory-table.tsx
- Data table to display `Medicine` details mapped against stock availability.

---

### E-Prescription Queue & Details

#### [NEW] src/app/(portal)/pharmacy/prescriptions/page.tsx
- The canonical Prescription Queue for both DOCTOR and PHARMACIST.
- Table using `DataTableShell` containing Status, Safety Summary, and Patient identity.

#### [NEW] src/app/(portal)/pharmacy/prescriptions/[id]/page.tsx
- Detailed view using `usePrescription`.
- Visual prominence for safety warnings (`AllergyWarnings`, `InteractionWarnings`).
- Displays the **Dispense** action dynamically based on `prescription.dispense` permission and status.

#### [NEW] src/features/pharmacy/components/dispense-confirmation.tsx
- `ConfirmDialog` wrapping the high-impact dispense action. Includes stock pre-check display.

---

### Prescription Builder Workflow

#### [NEW] src/app/(portal)/pharmacy/prescriptions/new/page.tsx
- Protect with `prescription.create` permission.

#### [NEW] src/features/pharmacy/components/prescription-builder.tsx
- Complex multi-step form utilizing React Hook Form + Zod.
- **Step 1**: Patient Context selection (ensuring identity remains visibly pinned throughout).
- **Step 2**: Medication Items array (dynamic `useFieldArray` mapping to existing inventory meds).
- **Step 3**: Safety Check dispatch (POST `/check-safety`).
- **Step 4**: Safety Result Acknowledgment (Positive feedback or explicit Warning acceptance).
- **Final**: Submit to `POST /prescriptions`.

#### [NEW] src/features/pharmacy/schemas/prescription.schema.ts
- Local Zod validation schema strictly for form structure (not medical authority).

---

## Verification Plan

### Automated Tests
I will add robust unit tests in `src/test/features/pharmacy/pharmacy.test.tsx`:
- Render queue and inventory (with fallback states).
- E-Prescription Builder: Test dynamic row additions and patient context pinning.
- Safety Checks: Validate UI reacts correctly to mock `SAFE` and `ALLERGY_WARNING` responses without mutating data itself.
- Role-based Dispense constraints (Pharmacist sees dispense CTA, Doctor does not).

### Source of Truth Checks
- Verify no arithmetic (`quantity - dispensed`) exists in the frontend files; explicitly confirm stock deduction uses `queryClient.invalidateQueries`.
- Verify `npm run lint; npm run typecheck; npm run test; npm run build` completes with 0 errors.
