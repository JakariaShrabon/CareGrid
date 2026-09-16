# Phase 9 Implementation Plan: Patient, Family, Donor, & Notifications

## 1. Goal
Implement the read-only experiences for Patients and Family Attendants, the public anonymous living donor registration flow, and an in-app notification center.

## 2. Patient Read-Only Experience
- **Routes**: `/my-care`, `/my-care/updates`, `/my-care/discharge`
- **Isolation Strategy**: The frontend will use the `session.user.id` to fetch only the patient's data (simulating row-level security on the backend).
- **Features**:
  - `MyCareUpdatesView`: A read-only timeline of `DailyPatientUpdate` where `visibility` is 'FAMILY' or 'STAFF'.
  - `MyCareDischargeView`: Wraps the existing `DischargeSummaryView` component from Phase 8.
  - A lightweight context component to display basic admission context (ward, bed, doctor).

## 3. Family Read-Only Experience
- **Routes**: `/family-care`, `/family-care/updates`, `/family-care/discharge`
- **Isolation Strategy**: The mock API will simulate a relationship (e.g., `linkedPatientId` from the family's profile) to access the linked patient's data.
- **Features**:
  - Similar to Patient but strictly constrained. No billing/prescription views per prompt instructions.
  - Consumes `DailyPatientUpdate` where `visibility` is explicitly `FAMILY`.

## 4. Public Living Donor Flow
- **Routes**: `/donor`, `/donor/register`, `/donor/screening`, `/donor/success` (inside `src/app/(public)`)
- **Features**:
  - **Landing Page**: Educational/factual copy explaining voluntary living donation.
  - **Registration Form**: Anonymous reference generation, capturing Blood Group and Organ Interest using existing `LivingDonorRegistration` contract.
  - **Screening Form**: Fictional demo checklist to demonstrate form logic without making final medical decisions.
  - **Success Page**: Displays the anonymous reference ID and `PENDING` status.
- **Privacy**: No staff-only PII. No authentication required.

## 5. In-App Notification Center
- **Route**: `/notifications`
- **Features**:
  - List of notifications using the `Notification` contract (`PATIENT_UPDATE`, `SOS`, etc.).
  - Scoped strictly to the current user's ID via the mock API.
  - "Mark as Read" functionality.
  - Topbar integration: Badge showing unread count from a TanStack query.
- **Documentation Note**: Highlight that this is an application support extension (the source specifies SMS/Email).

## 6. Verification Plan
- `npm run lint`, `npm run typecheck`, `npm run test`
- `npm run build`
- Playwright E2E tests for Family flow, Patient flow, and Public Donor flow.

## 7. Approval
User has explicitly approved this architecture in the prompt. Proceeding immediately to execution.
