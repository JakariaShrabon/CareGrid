# Phase 4: Patient Care & Clinical Workflow

## 1. Patient List (`/patients`)
- **Route**: `src/app/(portal)/patients/page.tsx`
- **Components**: `PatientList` in `src/features/patients/components/patient-list.tsx`
- **Features**: Data table showing patients, powered by `usePatients` hook. Uses existing `DataTableShell`, `StatusBadge`, `SearchInput`.
- **Columns**: Patient ID, Name, Age, Gender, Blood Group, Admission Date, Action (View Patient).

## 2. Patient Detail Shell (`/patients/[patientId]`)
- **Route**: `src/app/(portal)/patients/[patientId]/page.tsx`
- **Components**: 
  - `PatientDetailHeader` (Identity, demographics, admission status)
  - Tabs: Overview, Vitals, Daily Updates, Lab Results
- **Queries**: `usePatient`, `usePatientAdmission`

## 3. Vitals Visualization & Mutation
- **Tab Component**: `VitalsTab`
- **Visuals**: `VitalsCharts` using `recharts` for Temperature, Blood Pressure (Systolic + Diastolic), and Oxygen Saturation.
- **Action**: `RecordVitalsForm` using `react-hook-form` and `zod`. Uses `useCreatePatientVital` mutation.
- **Permissions**: Requires `patient.vitals.write`.

## 4. Daily Updates Timeline & Mutation
- **Tab Component**: `DailyUpdatesTab`
- **Visuals**: `DailyUpdatesTimeline` listing `DailyPatientUpdate` entries with author and timestamp.
- **Action**: `CreateUpdateForm` using `useCreatePatientUpdate` mutation.
- **Permissions**: Requires `patient.update.write`.

## 5. Lab Results (Read-only)
- **Tab Component**: `LabResultsTab`
- **Features**: Simple data table or list displaying `LabResult` data (Test Name, Result, Reference Range, Flag).

## 6. Ward Management (`/wards`)
- **Route**: `src/app/(portal)/wards/page.tsx`
- **Components**:
  - `WardSelector` (Dropdown/Tabs)
  - `WardSummary` (Count of bed statuses)
  - `RoomBedGroup` & `BedCard` (Visual grid of beds grouped by room)
- **Queries**: `useWards`, `useWardBeds`

## 7. Bed Detail & Status Mutation
- **Component**: `BedDetailDialog` (Accessible drawer/dialog on click)
- **Features**: Displays bed/patient info. Allows changing status between `AVAILABLE`, `OCCUPIED`, `CLEANING`, `RESERVED` using `useUpdateBedStatus`.
- **Permissions**: Requires `ward.manage` to change status.

## 8. Permissions & Auth
- Utilize `hasEveryPermission` from `src/lib/auth/rbac`.
- Shared clinical route for both `DOCTOR` and `NURSE`. Logic adjusts based on canonical permission matrix.

## 9. Tests
- Add Vitest/Playwright tests for Patient List, Patient Detail, Vitals Recording, Ward Bed Management.
