# Mock Data Model

## Purpose

Mock data exists to support frontend demonstration before backend integration. UI must never import mock data directly. MSW handlers are the only mock API surface.

## Entity Names

- `AuthUser`
- `PatientSummary`
- `VitalSign`
- `Ward`
- `WardBed`
- `OrganMatchSummary`
- `LivingDonorRegistration`
- `BloodInventoryItem`
- `BloodDonorSummary`
- `PrescriptionSummary`
- `MedicineInventoryItem`
- `BillSummary`
- `InsuranceClaim`
- `NotificationEvent`

## ID Style

Use readable string IDs in mocks:

- `user_doctor_001`
- `hospital_001`
- `patient_001`
- `ward_icu`
- `bed_icu_01`
- `mock_req_foundation`

## Relationships

- Patients reference ward, bed, and primary doctor IDs.
- Beds may reference a patient ID when occupied.
- Prescriptions reference patient and doctor IDs.
- Bills reference patient IDs.
- Claims reference bill IDs.
- Notifications may reference recipient user IDs.

## Mock Limits

Mock handlers can return realistic precomputed compatibility scores, eligibility states, warnings, and totals. They must not become the source of authoritative medical, safety, financial, or authorization rules.
