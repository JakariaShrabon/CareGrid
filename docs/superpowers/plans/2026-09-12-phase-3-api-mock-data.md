# Phase 3 Implementation Plan: API Contracts, Mocks, and Query Foundations

The goal of Phase 3 is to build the definitive API contracts, relational mock data architecture, realistic MSW endpoints, feature API services, and React Query hook foundation for all modules. We will **NOT** implement any business UI in this phase (no patient tables, vitals charts, ward grids, organ UI, blood inventory UI, SOS UI, map UI, prescription UI, billing UI, or notification center). All module boundaries remain as placeholders.

## Proposed Changes

### 1. Common API Conventions & Types
#### `src/contracts/common.ts`
- Add `Money` contract (`{ amount: string; currency: string; }`).
- Standardize `BloodGroup`, `Gender`.

### 2. Domain Contracts
#### `src/contracts/patient.ts`
- Include: `Patient`, `PatientAdmission`, `VitalsRecord` (must support temperatureCelsius, systolicBp, diastolicBp, oxygenSaturationPercent, recordedAt, recordedByUserId, note), `DailyPatientUpdate`, `PatientAllergy`, `LabResult`.
#### `src/contracts/ward.ts`
- Complete `Hospital`, `Ward`, `Room`, `Bed` and precise `BedStatus` enums.
#### `src/contracts/organ.ts`
- Include: `OrganType`, `OrganDonor`, `OrganRecipient`, `CompatibilityFactorBreakdown`, `OrganMatch`, `WaitingListEntry`, `OrganTransit`, `LivingDonorRegistration`.
#### `src/contracts/blood.ts`
- Include: `BloodComponent` (WHOLE_BLOOD, RBC, PLATELETS, PLASMA), `BloodDonor`, `BloodDonation`, `BloodUnit`, `BloodInventorySummary`, `EmergencySOS`.
#### `src/contracts/pharmacy.ts`
- Include: `Medicine`, `PharmacyInventoryItem`, `Prescription`, `PrescriptionItem`, `PrescriptionSafetyResult`, `DispenseRecord`.
#### `src/contracts/billing.ts`
- Include: `Bill`, `BillItem`, `InsuranceClaim`, `DischargeSummary`.
#### `src/contracts/notification.ts`
- Extend `Notification` / `NotificationEvent`.

### 3. Mock Database & Factories
#### `src/mocks/database/store.ts`
- Provides resettable in-memory store including all major collections:
  `hospitals`, `wards`, `rooms`, `beds`, `users`, `patients`, `admissions`, `vitals`, `dailyUpdates`, `labResults`, `organDonors`, `organRecipients`, `organMatches`, `waitingList`, `organTransits`, `livingDonors`, `bloodDonors`, `bloodDonations`, `bloodUnits`, `bloodSos`, `medicines`, `pharmacyInventory`, `prescriptions`, `dispenseRecords`, `bills`, `insuranceClaims`, `dischargeSummaries`, `notifications`.
#### `src/mocks/factories/index.ts`
- Deterministic data generator injecting a consistent `now: Date`. Generates realistic volume with proper relationships.

### 4. API Path Convention
We will preserve the exact working Phase 2 convention:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`
- Feature services call relative paths (e.g., `client.get("/patients")`)
- MSW intercepts exact paths via `apiBaseUrl` (e.g., `http.get(`${apiBaseUrl}/patients`)`)

### 5. MSW Handlers (Mock API Endpoints)
Endpoints to be implemented:

- **AUTH**: Preserve existing Phase 2 endpoints
- **PATIENTS**: GET `/patients`, GET `/patients/:id`, GET `/patients/:id/admission`, GET `/patients/:id/vitals`, POST `/patients/:id/vitals`, GET `/patients/:id/updates`, POST `/patients/:id/updates`, GET `/patients/:id/lab-results`
- **WARDS**: GET `/wards`, GET `/wards/:id`, GET `/wards/:id/beds`, PATCH `/beds/:id/status`
- **ORGAN**: GET `/organ/overview`, GET `/organ/matches`, GET `/organ/matches/:id`, GET `/organ/waiting-list`, GET `/organ/transit`, GET `/organ/living-donors`
- **BLOOD**: GET `/blood/overview`, GET `/blood/inventory`, GET `/blood/units`, GET `/blood/donors`, GET `/blood/donors/:id`, GET `/blood/sos`, POST `/blood/sos`
- **PHARMACY**: GET `/prescriptions`, GET `/prescriptions/:id`, POST `/prescriptions`, POST `/prescriptions/check-safety`, GET `/pharmacy/inventory`, POST `/pharmacy/dispense`
- **BILLING**: GET `/bills`, GET `/bills/:id`, GET `/insurance/claims`, GET `/insurance/claims/:id`, PATCH `/insurance/claims/:id`, GET `/discharges`, GET `/discharges/:patientId`
- **NOTIFICATIONS**: GET `/notifications`, PATCH `/notifications/:id/read`, POST `/notifications/mark-all-read`

### 6. Feature API Services & Query Hooks
Use the existing `src/features/blood-bank/` directory instead of creating a new one.

- **Patients**: `src/features/patients/api/`, `hooks/use-patients.ts`, etc.
- **Wards**: `src/features/wards/api/`, `hooks/use-wards.ts`, etc.
- **Organ**: `src/features/organ/api/`, `hooks/use-organ-matches.ts`, etc.
- **Blood Bank**: `src/features/blood-bank/api/`, `hooks/use-blood-inventory.ts`, etc.
- **Pharmacy**: `src/features/pharmacy/api/`, `hooks/use-prescriptions.ts`, etc.
- **Billing**: `src/features/billing/api/`, `hooks/use-bills.ts`, etc.
- **Notifications**: `src/features/notifications/api/`, `hooks/use-notifications.ts`, `use-mark-notification-read.ts`, `use-mark-all-notifications-read.ts`

### 7. Integrity and MSW Tests
#### `src/test/mocks/integrity.test.ts`
- Fails if foreign keys are broken (Admission->Patient, Vitals->Patient/User, Bed->Admission, OrganMatch->Donor/Recipient, BloodDonation->Donor, Prescription->Patient/Doctor, etc.)
#### `src/test/mocks/handlers.test.ts` / `api-hooks.test.tsx`
- Validate MSW mutability, pagination, filtering, and hook cache invalidation.

### 8. Documentation Updates
Update `API_CONTRACT.md`, `MOCK_DATA_MODEL.md`, and `BACKEND_HANDOFF.md`.
