# Phase 8: Billing, Insurance & Discharge Implementation Plan

## Goal
Build the unified frontend architecture for CareGrid's Patient Billing, Insurance Claims, and Discharge operations. This phase introduces itemized charge presentation, insurance workflow states (approval/rejection), and a mock backend-driven PDF discharge summary. 

## Proposed Architecture & Scope

### 1. Billing Module Overview
- **Route**: `/billing`
- **Summary**: Operational overview displaying open bills, total outstanding, insurance claims, approved claims, rejected claims, and patients ready for discharge. Derives data purely from the mock API.
- **Role**: `BILLING_OFFICER`

### 2. Patient Bill List
- **Route**: `/billing/bills`
- **Summary**: Uses existing `useBills` and `DataTableShell`. Displays Bill ID, Patient, Admission, Generated At, Subtotal, Insurance Adjustment, Patient Payable, and Status. Handles pagination natively through the Phase 3 backend mock.

### 3. Bill Detail & Itemized Charges
- **Route**: `/billing/bills/[billId]`
- **Summary**: Detailed view presenting the patient/admission context. Itemized charges are grouped by source categories (`ROOM`, `PHARMACY`, `SURGERY`, `CONSULTATION`). Subtotals and final patient payables are strictly consumed from the API (`subtotal`, `insuranceAdjustment`, `patientPayable`), enforcing zero local frontend financial calculations.

### 4. Money Formatting
- **Shared Util**: Use the canonical `Money` contract to implement a centralized `formatMoney` utility, removing hardcoded currencies globally.

### 5. Insurance Claim List
- **Route**: `/billing/claims`
- **Summary**: Displays insurance claims with patient/bill linking, claim number, status, submission date, and decision context.

### 6. Insurance Claim Status Workflow
- **Route**: `/billing/claims/[claimId]`
- **Summary**: Uses `useInsuranceClaim` and `useUpdateInsuranceClaim`. The UI exposes permitted state transitions (e.g., `APPROVED`, `REJECTED`) without building internal business rules. Rejections may include a `decisionMessage`. Successful mutations selectively invalidate React Query cache for the claim, claim list, and linked bill.

### 7. Discharge-Ready List & Summary View
- **Route**: `/billing/discharge` & `/billing/discharge/[patientId]`
- **Summary**: The canonical operational view for discharge handling. Displays patient stay context, summarized lab results (`LabResult`), and the post-discharge medication schedule directly from the `DischargeSummary` response (uncoupled from active Pharmacy records).

### 8. Downloadable Discharge PDF Workflow
- **API Extension**: Introduce `getBlob()` into `src/lib/api/client.ts` to properly handle binary `application/pdf` payloads. 
- **Mock Extension**: Expose `GET /api/discharges/:patientId/pdf` in MSW. It returns a mock PDF Blob with the correct header (`Content-Type: application/pdf`).
- **UI Action**: An accessible "Download PDF" button triggers the API and handles the blob creation/download via a temporary anchor element (`<a>`).

### 9. RBAC & Security
- **Roles**: Use existing `RequirePermission` components where needed, but primarily lock `/billing/*` layout routes via `RequireRole` to `BILLING_OFFICER`.

### 10. Responsive & Accessibility 
- Financial tables will afford horizontal scroll on mobile to preserve structural readability. 
- Avoid indicating financial state/status strictly through color (e.g., using icons in `StatusBadge` and semantic labels). 
- PDF download actions and claim rejection dialogue forms will be fully keyboard accessible with appropriate focus management.

### 11. Testing Strategy
- Unit test suite (`src/test/features/billing/billing.test.tsx`): Component isolation for BillDetail, ClaimMutation, DischargeSummary, and PDF download initiation.
- E2E Playwright Suite: (`src/test/e2e/billing-workflow.spec.ts`): Fully simulate the `BILLING_OFFICER` journey from login to itemized bill review to claim decision and finally to a mock PDF download.

---
*Note: This architecture intentionally omits external live insurers and online payment gateways as outlined by project constraints.*
