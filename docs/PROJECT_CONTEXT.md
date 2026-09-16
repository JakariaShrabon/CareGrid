# CareGrid.io Project Context

## Source Documents Reviewed

- `CareGrid_io_Detailed_Report.pdf`: primary detailed project report and feature specification.
- `Software Lab Project Idea and features .pdf`: concise feature list for the five modules.
- `CareGrid_io_Project_Idea_Presentation_Updated_Cover.pptx`: 12-slide project idea presentation.
- `CareGrid_io_Software_Lab_Report.pdf`: inspected with partial text recovery; recoverable structure matched the same CareGrid scope.

## Purpose

CareGrid.io is a responsive, role-based hospital care coordination platform. It brings five fragmented hospital workflows into one shared patient, hospital, identity, and notification context so staff can reduce emergency delays, manual record mistakes, duplicate data entry, and family uncertainty.

## Main Modules

1. Organ Donation & Compatibility Matching
   - Compatibility score presentation using blood group, HLA compatibility, urgency, and distance.
   - Recipient waiting list priority with MELD/PELD-style urgency information.
   - Cold-ischemia countdown for organs in transit.
   - Anonymous living donor registry.

2. Smart Blood Bank & Emergency SOS
   - Component-wise inventory for Whole Blood, RBC, Platelets, and Plasma.
   - Low-stock and expiration alert representation.
   - Emergency SOS workflow with SMS/email broadcast representation.
   - Backend-provided donor eligibility, including the 56-day interval rule.
   - Nearby or geofenced donor search.

3. Daily Patient Update & Doctor Dashboard
   - Patient records, vitals, medication information, and trend charts.
   - Daily doctor and nurse updates.
   - Family read-only portal.
   - Ward and bed management with AVAILABLE, OCCUPIED, CLEANING, RESERVED states.

4. Pharmacy & E-Prescription
   - Digital prescription builder.
   - Pharmacy prescription queue.
   - Drug interaction and allergy warning presentation.
   - Medicine inventory, dispensing, and stock deduction workflow.

5. Billing, Insurance & Discharge
   - Room, pharmacy, surgery, and consultation charges.
   - Itemized bill.
   - Insurance claim approval/rejection tracking.
   - Discharge summary and downloadable PDF workflow.

## Roles

- DOCTOR
- NURSE
- BLOOD_BANK_COORDINATOR
- PHARMACIST
- BILLING_OFFICER
- PATIENT
- FAMILY_ATTENDANT

Living donors may use a public or anonymous donor flow. No Admin dashboard is included in this foundation.

## In Scope

- Web-based responsive frontend.
- Role-aware navigation and access helpers.
- Shared frontend contracts for future backend integration.
- Read-only patient and family portals with discharge summaries.
- Public living donor registration flow and eligibility screening demo.
- In-app notification center.
- Mock API mode for demonstration and local development.
- Remote API mode switch without changing feature components.
- Documentation for backend/API handoff.

## Out Of Scope

- Native mobile applications.
- Telemedicine or video consultation.
- Live national organ registry integration.
- Live external insurance-provider integration.
- Frontend authority for matching, eligibility, drug interactions, billing totals, or security authorization.

## Non-Functional Requirements

- Security and privacy: sensitive medical and financial data require backend authentication, authorization, and encryption.
- Reliability: emergency SOS and cold-ischemia workflows are time-critical.
- Auditability: matches, prescriptions, billing actions, and approvals must be traceable.
- Scalability: additional hospitals and wards should fit without frontend restructuring.
