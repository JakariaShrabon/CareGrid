# Database Handoff — Phase 11 Finalized

**Status**: Ready for database schema design  
**Frontend Version**: Phase 11 Complete  
**Date**: 2026-09-13

---

## Executive Summary

This document specifies the entity relationships and data model that the backend database must support. It does **not** dictate SQL schema—that is the backend team's responsibility. Instead, it documents the frontend's entity relationship expectations and lifecycle requirements.

---

## 1. Hospital & Organization Structure

### 1.1 Entity Relationships

```
Hospital (singleton or organization identifier)
  ├─ Ward (department, unit, ICU, etc.)
  │  ├─ Room (physical location)
  │  └─ Bed (occupancy unit)
  └─ Department (for pharmacy, blood bank, billing, etc.)
```

### 1.2 Hospital

| Field     | Type              | Required | Notes                          |
| --------- | ----------------- | -------- | ------------------------------ |
| id        | EntityId          | ✓        | e.g., "hospital_001"           |
| name      | string            | ✓        | e.g., "Central Medical Center" |
| location  | string            | ✓        | City or full address           |
| createdAt | ISODateTimeString | ✓        | When hospital record created   |

### 1.3 Ward

| Field       | Type              | Required | Notes                           |
| ----------- | ----------------- | -------- | ------------------------------- |
| id          | EntityId          | ✓        | e.g., "ward_001"                |
| hospitalId  | EntityId          | ✓        | FK to Hospital                  |
| name        | string            | ✓        | e.g., "General Medicine", "ICU" |
| description | string            |          | e.g., "12-bed intensive care"   |
| capacity    | number            | ✓        | Total bed count                 |
| createdAt   | ISODateTimeString | ✓        |                                 |

### 1.4 Room

| Field      | Type              | Required | Notes                  |
| ---------- | ----------------- | -------- | ---------------------- |
| id         | EntityId          | ✓        | e.g., "room_001"       |
| wardId     | EntityId          | ✓        | FK to Ward             |
| roomNumber | string            | ✓        | e.g., "101", "ICU-A"   |
| capacity   | number            | ✓        | Number of beds in room |
| createdAt  | ISODateTimeString | ✓        |                        |

### 1.5 Bed

| Field             | Type              | Required | Notes                                         |
| ----------------- | ----------------- | -------- | --------------------------------------------- |
| id                | EntityId          | ✓        | e.g., "bed_001"                               |
| roomId            | EntityId          | ✓        | FK to Room                                    |
| bedNumber         | string            | ✓        | e.g., "A1", "B2"                              |
| status            | BedStatus         | ✓        | AVAILABLE \| OCCUPIED \| CLEANING \| RESERVED |
| occupantPatientId | EntityId          |          | FK to Patient (if OCCUPIED)                   |
| reservedUntil     | ISODateTimeString |          | If RESERVED, until when                       |
| updatedAt         | ISODateTimeString | ✓        | Last status change                            |

**Note**: No MAINTENANCE status. Cleaning status represents beds being prepared.

---

## 2. User & Authentication

### 2.1 User

| Field        | Type              | Required | Notes                                      |
| ------------ | ----------------- | -------- | ------------------------------------------ |
| id           | EntityId          | ✓        | e.g., "user_001"                           |
| email        | string            | ✓        | Unique, email format                       |
| passwordHash | string            | ✓        | Bcrypt or equivalent                       |
| role         | UserRole          | ✓        | DOCTOR \| NURSE \| ... (7 canonical roles) |
| status       | string            | ✓        | ACTIVE \| INACTIVE \| SUSPENDED            |
| displayName  | string            | ✓        | Full name or display name                  |
| department   | string            |          | Ward/department assignment for staff       |
| hospitalId   | EntityId          | ✓        | FK to Hospital                             |
| lastLoginAt  | ISODateTimeString |          | Last successful login                      |
| createdAt    | ISODateTimeString | ✓        | Account creation                           |
| updatedAt    | ISODateTimeString | ✓        | Last profile update                        |

### 2.2 Session

| Field          | Type              | Required | Notes                                 |
| -------------- | ----------------- | -------- | ------------------------------------- |
| id             | EntityId          | ✓        | e.g., "session_abc123"                |
| userId         | EntityId          | ✓        | FK to User                            |
| token          | string            | ✓        | Cryptographically signed token or JWT |
| expiresAt      | ISODateTimeString | ✓        | Session expiration                    |
| lastActivityAt | ISODateTimeString | ✓        | Last request timestamp                |
| ipAddress      | string            |          | Client IP for audit                   |
| userAgent      | string            |          | Browser/client info for audit         |
| createdAt      | ISODateTimeString | ✓        | Session creation                      |

**Note**: HttpOnly cookie transport. No exposure to JavaScript.

---

## 3. Patient & Care

### 3.1 Patient

| Field            | Type              | Required | Notes                                |
| ---------------- | ----------------- | -------- | ------------------------------------ |
| id               | EntityId          | ✓        | e.g., "patient_001"                  |
| displayName      | string            | ✓        | Patient name (mock data, fictional)  |
| age              | number            |          | Age or DOB                           |
| gender           | Gender            |          | MALE \| FEMALE \| OTHER              |
| bloodGroup       | BloodGroup        |          | For transfusion, organ matching      |
| contactNumber    | string            |          | Patient or emergency contact         |
| address          | string            |          | Address on file                      |
| emergencyContact | string            |          | Contact name/phone                   |
| allergy          | string            |          | Free-text or structured allergy info |
| medicalHistory   | string            |          | Relevant history summary             |
| hospitalId       | EntityId          | ✓        | FK to Hospital (if admitted)         |
| status           | string            | ✓        | ACTIVE \| DISCHARGED \| TRANSFERRED  |
| createdAt        | ISODateTimeString | ✓        |                                      |
| updatedAt        | ISODateTimeString | ✓        |                                      |

### 3.2 Admission

| Field         | Type              | Required | Notes                                                            |
| ------------- | ----------------- | -------- | ---------------------------------------------------------------- |
| id            | EntityId          | ✓        | e.g., "admission_001"                                            |
| patientId     | EntityId          | ✓        | FK to Patient                                                    |
| wardId        | EntityId          |          | FK to Ward (if assigned)                                         |
| bedId         | EntityId          |          | FK to Bed (current bed)                                          |
| admissionDate | ISODateTimeString | ✓        | When patient admitted                                            |
| dischargeDate | ISODateTimeString |          | When patient discharged                                          |
| reason        | string            |          | Admission reason (e.g., "Surgical procedure", "Post-transplant") |
| status        | string            | ✓        | ACTIVE \| DISCHARGED                                             |
| createdAt     | ISODateTimeString | ✓        |                                                                  |

### 3.3 Vitals

| Field            | Type              | Required | Notes               |
| ---------------- | ----------------- | -------- | ------------------- |
| id               | EntityId          | ✓        | e.g., "vital_001"   |
| patientId        | EntityId          | ✓        | FK to Patient       |
| admissionId      | EntityId          |          | FK to Admission     |
| temperature      | number            |          | Celsius             |
| systolicBP       | number            |          | mmHg                |
| diastolicBP      | number            |          | mmHg                |
| oxygenSaturation | number            |          | Percentage (0-100)  |
| heartRate        | number            |          | BPM                 |
| respiratoryRate  | number            |          | Breaths per minute  |
| recordedBy       | EntityId          | ✓        | FK to User (NURSE)  |
| recordedAt       | ISODateTimeString | ✓        | When vital recorded |
| createdAt        | ISODateTimeString | ✓        |                     |

### 3.4 Daily Patient Update

| Field       | Type              | Required | Notes                        |
| ----------- | ----------------- | -------- | ---------------------------- |
| id          | EntityId          | ✓        | e.g., "update_001"           |
| patientId   | EntityId          | ✓        | FK to Patient                |
| admissionId | EntityId          |          | FK to Admission              |
| content     | string            | ✓        | Update text (clinical notes) |
| writtenBy   | EntityId          | ✓        | FK to User (DOCTOR/NURSE)    |
| writtenAt   | ISODateTimeString | ✓        | When written                 |
| createdAt   | ISODateTimeString | ✓        |                              |

### 3.5 Lab Result

| Field       | Type              | Required | Notes                       |
| ----------- | ----------------- | -------- | --------------------------- |
| id          | EntityId          | ✓        | e.g., "lab_001"             |
| patientId   | EntityId          | ✓        | FK to Patient               |
| admissionId | EntityId          |          | FK to Admission             |
| testName    | string            | ✓        | e.g., "Blood Work", "X-Ray" |
| result      | string            | ✓        | Result text or code         |
| reference   | string            |          | Normal/reference range      |
| orderedBy   | EntityId          |          | FK to User (DOCTOR)         |
| resultDate  | ISODateTimeString | ✓        | When result available       |
| createdAt   | ISODateTimeString | ✓        |                             |

---

## 4. Organ Donation & Transplant

### 4.1 Organ Donor

| Field        | Type              | Required | Notes                                                                |
| ------------ | ----------------- | -------- | -------------------------------------------------------------------- |
| id           | EntityId          | ✓        | e.g., "donor_001"                                                    |
| displayName  | string            | ✓        | Donor name (mock data)                                               |
| bloodGroup   | BloodGroup        | ✓        | For matching                                                         |
| HLA          | string            |          | HLA typing if available                                              |
| age          | number            |          | Donor age                                                            |
| causeOfDeath | string            |          | Medical cause if deceased                                            |
| organType    | string            |          | HEART \| LIVER \| KIDNEY \| PANCREAS \| LUNG (which organ to donate) |
| retrievedAt  | ISODateTimeString | ✓        | When organ retrieved                                                 |
| expiresAt    | ISODateTimeString | ✓        | Organ expiration timestamp                                           |
| status       | string            | ✓        | REGISTERED \| RETRIEVED \| TRANSPLANTED \| EXPIRED                   |
| registeredAt | ISODateTimeString | ✓        |                                                                      |

### 4.2 Organ Recipient

| Field        | Type              | Required | Notes                                         |
| ------------ | ----------------- | -------- | --------------------------------------------- |
| id           | EntityId          | ✓        | e.g., "recipient_001"                         |
| patientId    | EntityId          | ✓        | FK to Patient                                 |
| organNeeded  | string            | ✓        | Type of organ (HEART, LIVER, KIDNEY, etc.)    |
| bloodGroup   | BloodGroup        | ✓        | For matching                                  |
| HLA          | string            |          | HLA if available                              |
| urgencyScore | number            | ✓        | MELD/PELD or similar (0-100+)                 |
| waitingSince | ISODateTimeString | ✓        | When added to waiting list                    |
| status       | string            | ✓        | WAITING \| MATCHED \| TRANSPLANTED \| REMOVED |
| createdAt    | ISODateTimeString | ✓        |                                               |

### 4.3 Organ Match

| Field                   | Type              | Required | Notes                                                        |
| ----------------------- | ----------------- | -------- | ------------------------------------------------------------ |
| id                      | EntityId          | ✓        | e.g., "match_001"                                            |
| donorId                 | EntityId          | ✓        | FK to Organ Donor                                            |
| recipientId             | EntityId          | ✓        | FK to Organ Recipient                                        |
| compatibilityScore      | number            | ✓        | 0-100 (calculated by backend)                                |
| bloodGroupCompatibility | number            |          | %                                                            |
| HLACompatibility        | number            |          | %                                                            |
| urgencyFactor           | number            |          | %                                                            |
| distanceFactor          | number            |          | %                                                            |
| matchedAt               | ISODateTimeString | ✓        | When match calculated                                        |
| status                  | string            | ✓        | MATCHED \| IN_TRANSIT \| TRANSPLANTED \| EXPIRED \| REJECTED |
| createdAt               | ISODateTimeString | ✓        |                                                              |

### 4.4 Living Donor Registration

| Field            | Type              | Required | Notes                                             |
| ---------------- | ----------------- | -------- | ------------------------------------------------- |
| id               | EntityId          | ✓        | e.g., "living_donor_001"                          |
| anonymousId      | string            | ✓        | Generated by backend (unique, pseudonym)          |
| displayName      | string            | ✓        | Donor name (mock, fictional)                      |
| bloodGroup       | BloodGroup        | ✓        |                                                   |
| organType        | string            | ✓        | Type willing to donate                            |
| age              | number            |          |                                                   |
| screeningStatus  | string            | ✓        | PRELIMINARY \| CLEARED \| REJECTED \| IN_PROGRESS |
| screeningResults | string            |          | Notes from screening                              |
| registeredAt     | ISODateTimeString | ✓        |                                                   |
| createdAt        | ISODateTimeString | ✓        |                                                   |

**Note**: Screening is demo/preliminary only. Final medical clearance is out-of-scope.

---

## 5. Blood Bank & Donation

### 5.1 Blood Donor

| Field            | Type              | Required | Notes                               |
| ---------------- | ----------------- | -------- | ----------------------------------- |
| id               | EntityId          | ✓        | e.g., "blood_donor_001"             |
| displayName      | string            | ✓        | Donor name (mock)                   |
| bloodGroup       | BloodGroup        | ✓        |                                     |
| lastDonationDate | ISODateTimeString |          | For 56-day eligibility check        |
| status           | string            | ✓        | ELIGIBLE \| INELIGIBLE \| SUSPENDED |
| latitude         | number            |          | Geolocation for map                 |
| longitude        | number            |          | Geolocation for map                 |
| donationCount    | number            |          | Lifetime donation count             |
| createdAt        | ISODateTimeString | ✓        |                                     |

### 5.2 Blood Donation

| Field        | Type              | Required | Notes                                               |
| ------------ | ----------------- | -------- | --------------------------------------------------- |
| id           | EntityId          | ✓        | e.g., "donation_001"                                |
| donorId      | EntityId          | ✓        | FK to Blood Donor                                   |
| donationDate | ISODateTimeString | ✓        | When blood collected                                |
| status       | string            | ✓        | COLLECTED \| TESTED \| AVAILABLE \| USED \| EXPIRED |
| createdAt    | ISODateTimeString | ✓        |                                                     |

### 5.3 Blood Unit

| Field      | Type              | Required | Notes                                       |
| ---------- | ----------------- | -------- | ------------------------------------------- |
| id         | EntityId          | ✓        | e.g., "unit_001"                            |
| donationId | EntityId          | ✓        | FK to Blood Donation                        |
| component  | BloodComponent    | ✓        | WHOLE_BLOOD \| RBC \| PLATELETS \| PLASMA   |
| quantity   | number            | ✓        | Units or mL                                 |
| status     | string            | ✓        | AVAILABLE \| IN_USE \| EXPIRED \| DISCARDED |
| expiresAt  | ISODateTimeString | ✓        | Expiration date                             |
| createdAt  | ISODateTimeString | ✓        |                                             |

### 5.4 Blood Inventory

| Field             | Type              | Required | Notes                                     |
| ----------------- | ----------------- | -------- | ----------------------------------------- |
| id                | EntityId          | ✓        | e.g., "inventory_001"                     |
| hospitalId        | EntityId          | ✓        | FK to Hospital                            |
| component         | BloodComponent    | ✓        | WHOLE_BLOOD \| RBC \| PLATELETS \| PLASMA |
| quantity          | number            | ✓        | Current stock                             |
| lowStockThreshold | number            | ✓        | When to alert (backend sets)              |
| criticalThreshold | number            | ✓        | Emergency threshold                       |
| lastUpdated       | ISODateTimeString | ✓        | Last inventory count                      |

### 5.5 Emergency SOS

| Field          | Type              | Required | Notes                               |
| -------------- | ----------------- | -------- | ----------------------------------- |
| id             | EntityId          | ✓        | e.g., "sos_001"                     |
| createdBy      | EntityId          | ✓        | FK to User (BLOOD_BANK_COORDINATOR) |
| bloodComponent | BloodComponent    | ✓        | Type needed                         |
| quantity       | number            | ✓        | Units needed                        |
| urgency        | string            | ✓        | CRITICAL \| HIGH \| MEDIUM          |
| message        | string            |          | Additional info                     |
| status         | string            | ✓        | ACTIVE \| FULFILLED \| CANCELLED    |
| createdAt      | ISODateTimeString | ✓        |                                     |
| respondedAt    | ISODateTimeString |          | When fulfilled                      |

---

## 6. Pharmacy & Prescriptions

### 6.1 Medicine

| Field        | Type              | Required | Notes                                |
| ------------ | ----------------- | -------- | ------------------------------------ |
| id           | EntityId          | ✓        | e.g., "med_001"                      |
| name         | string            | ✓        | Medicine name                        |
| dosage       | string            | ✓        | e.g., "500mg", "10ml"                |
| type         | string            |          | e.g., "tablet", "syrup", "injection" |
| manufacturer | string            |          |                                      |
| status       | string            | ✓        | ACTIVE \| DISCONTINUED               |
| createdAt    | ISODateTimeString | ✓        |                                      |

### 6.2 Pharmacy Inventory

| Field             | Type              | Required | Notes                |
| ----------------- | ----------------- | -------- | -------------------- |
| id                | EntityId          | ✓        | e.g., "pharminv_001" |
| medicineId        | EntityId          | ✓        | FK to Medicine       |
| hospitalId        | EntityId          | ✓        | FK to Hospital       |
| quantity          | number            | ✓        | Current stock        |
| batchNumber       | string            |          | Lot number           |
| expiresAt         | ISODateTimeString |          | Expiration           |
| lowStockThreshold | number            | ✓        | Reorder level        |
| lastRestocked     | ISODateTimeString |          |                      |
| updatedAt         | ISODateTimeString | ✓        |                      |

### 6.3 Prescription

| Field        | Type              | Required | Notes                                                   |
| ------------ | ----------------- | -------- | ------------------------------------------------------- |
| id           | EntityId          | ✓        | e.g., "rx_001"                                          |
| patientId    | EntityId          | ✓        | FK to Patient                                           |
| admissionId  | EntityId          |          | FK to Admission                                         |
| prescribedBy | EntityId          | ✓        | FK to User (DOCTOR)                                     |
| prescribedAt | ISODateTimeString | ✓        | When prescription written                               |
| status       | string            | ✓        | DRAFT \| SUBMITTED \| DISPENSED \| EXPIRED \| CANCELLED |
| notes        | string            |          | Special instructions                                    |
| createdAt    | ISODateTimeString | ✓        |                                                         |

### 6.4 Prescription Item

| Field          | Type              | Required | Notes                             |
| -------------- | ----------------- | -------- | --------------------------------- |
| id             | EntityId          | ✓        | e.g., "rx_item_001"               |
| prescriptionId | EntityId          | ✓        | FK to Prescription                |
| medicineId     | EntityId          | ✓        | FK to Medicine                    |
| quantity       | number            | ✓        | Quantity to dispense              |
| frequency      | string            | ✓        | e.g., "Once daily", "Twice daily" |
| duration       | string            | ✓        | e.g., "7 days", "30 days"         |
| notes          | string            |          | e.g., "Take with food"            |
| createdAt      | ISODateTimeString | ✓        |                                   |

### 6.5 Prescription Safety Check

| Field              | Type              | Required | Notes                      |
| ------------------ | ----------------- | -------- | -------------------------- |
| id                 | EntityId          | ✓        | e.g., "safety_001"         |
| prescriptionId     | EntityId          | ✓        | FK to Prescription         |
| hasAllergyConflict | boolean           | ✓        | Based on patient allergies |
| hasDrugInteraction | boolean           | ✓        | Between prescribed drugs   |
| warnings           | string[]          |          | List of warnings           |
| checkedAt          | ISODateTimeString | ✓        | When checked               |
| createdAt          | ISODateTimeString | ✓        |                            |

### 6.6 Dispense Record

| Field             | Type              | Required | Notes                   |
| ----------------- | ----------------- | -------- | ----------------------- |
| id                | EntityId          | ✓        | e.g., "dispense_001"    |
| prescriptionId    | EntityId          | ✓        | FK to Prescription      |
| dispensedBy       | EntityId          | ✓        | FK to User (PHARMACIST) |
| dispensedAt       | ISODateTimeString | ✓        | When actually dispensed |
| quantityDispensed | number            | ✓        | Amount given            |
| createdAt         | ISODateTimeString | ✓        |                         |

**Note**: Inventory deduction happens on dispense, not on prescription creation.

---

## 7. Billing & Insurance

### 7.1 Bill

| Field       | Type              | Required | Notes                                                |
| ----------- | ----------------- | -------- | ---------------------------------------------------- |
| id          | EntityId          | ✓        | e.g., "bill_001"                                     |
| patientId   | EntityId          | ✓        | FK to Patient                                        |
| admissionId | EntityId          |          | FK to Admission                                      |
| totalAmount | Money             | ✓        | Calculated by backend                                |
| status      | string            | ✓        | DRAFT \| FINALIZED \| PAID \| PARTIAL \| WRITTEN_OFF |
| generatedAt | ISODateTimeString | ✓        | When bill created                                    |
| dueDate     | ISODateTimeString |          | Payment due                                          |
| paidDate    | ISODateTimeString |          | When paid                                            |
| createdAt   | ISODateTimeString | ✓        |                                                      |
| updatedAt   | ISODateTimeString | ✓        |                                                      |

### 7.2 Bill Item

| Field       | Type              | Required | Notes                                                       |
| ----------- | ----------------- | -------- | ----------------------------------------------------------- |
| id          | EntityId          | ✓        | e.g., "billitem_001"                                        |
| billId      | EntityId          | ✓        | FK to Bill                                                  |
| category    | string            | ✓        | ROOM \| PHARMACY \| SURGERY \| CONSULTATION \| LAB \| OTHER |
| description | string            | ✓        | e.g., "ICU - 3 nights"                                      |
| quantity    | number            | ✓        |                                                             |
| unitPrice   | Money             | ✓        |                                                             |
| amount      | Money             | ✓        | quantity × unitPrice                                        |
| createdAt   | ISODateTimeString | ✓        |                                                             |

**Note**: Total calculated by backend from items.

### 7.3 Insurance Claim

| Field             | Type              | Required | Notes                                        |
| ----------------- | ----------------- | -------- | -------------------------------------------- |
| id                | EntityId          | ✓        | e.g., "claim_001"                            |
| billId            | EntityId          | ✓        | FK to Bill                                   |
| insuranceProvider | string            |          | Insurance company name                       |
| policyNumber      | string            |          | Patient policy number                        |
| claimedAmount     | Money             | ✓        | Amount claimed                               |
| approvedAmount    | Money             |          | Amount approved by insurer                   |
| status            | string            | ✓        | SUBMITTED \| APPROVED \| REJECTED \| PARTIAL |
| submittedAt       | ISODateTimeString |          |                                              |
| decidedAt         | ISODateTimeString |          | When approved/rejected                       |
| notes             | string            |          | Rejection reason, etc.                       |
| createdAt         | ISODateTimeString | ✓        |                                              |

**Note**: No live insurer integration. Status is manual/mock.

---

## 8. Discharge

### 8.1 Discharge Summary

| Field                | Type              | Required | Notes                                      |
| -------------------- | ----------------- | -------- | ------------------------------------------ |
| id                   | EntityId          | ✓        | e.g., "discharge_001"                      |
| patientId            | EntityId          | ✓        | FK to Patient                              |
| admissionId          | EntityId          | ✓        | FK to Admission                            |
| dischargeDate        | ISODateTimeString | ✓        | Discharge date                             |
| dischargedBy         | EntityId          |          | FK to User (DOCTOR)                        |
| diagnosis            | string            |          | Clinical diagnosis on discharge            |
| procedures           | string            |          | Procedures performed                       |
| medications          | string            |          | Post-discharge medication list             |
| labResults           | string            |          | Relevant lab findings                      |
| followUpInstructions | string            |          | Next steps, appointments                   |
| restrictions         | string            |          | Activity restrictions, diet, etc.          |
| pdfUrl               | string            |          | URL to download PDF (generated by backend) |
| status               | string            | ✓        | DRAFT \| FINALIZED \| SENT                 |
| createdAt            | ISODateTimeString | ✓        |                                            |
| updatedAt            | ISODateTimeString | ✓        |                                            |

---

## 9. Notifications

### 9.1 Notification

| Field     | Type              | Required | Notes                                                                       |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------- |
| id        | EntityId          | ✓        | e.g., "notif_001"                                                           |
| userId    | EntityId          | ✓        | FK to User (recipient)                                                      |
| type      | string            | ✓        | PRESCRIPTION_READY \| SOS_ALERT \| PATIENT_UPDATE \| BILL_GENERATED \| etc. |
| title     | string            | ✓        | e.g., "Prescription Ready"                                                  |
| message   | string            | ✓        | Notification text                                                           |
| link      | string            |          | Internal link (e.g., "/pharmacy/prescriptions/rx_001")                      |
| isRead    | boolean           | ✓        | Whether user has seen                                                       |
| createdAt | ISODateTimeString | ✓        |                                                                             |
| readAt    | ISODateTimeString |          | When marked read                                                            |

**Note**: In-app Notification Center only. Backend responsible for actual SMS/email dispatch (not in scope of frontend integration).

---

## 10. Audit & Logs

### 10.1 Audit Log

| Field        | Type              | Required | Notes                                                               |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------- |
| id           | EntityId          | ✓        |                                                                     |
| userId       | EntityId          | ✓        | FK to User (who did it)                                             |
| action       | string            | ✓        | e.g., "CREATE_PRESCRIPTION", "DISPENSE_MEDICATION", "FINALIZE_BILL" |
| resourceType | string            | ✓        | e.g., "Prescription", "Bill"                                        |
| resourceId   | EntityId          |          | FK to affected resource                                             |
| result       | string            | ✓        | SUCCESS \| FAILURE                                                  |
| errorMessage | string            |          | If FAILURE                                                          |
| ipAddress    | string            |          | Client IP                                                           |
| timestamp    | ISODateTimeString | ✓        | When action occurred                                                |

**Retention**: Minimum 7 years for medical/billing records. Can be archived after retention period.

---

## 11. Entity Lifecycle Expectations

### 11.1 Patient Admission Lifecycle

```
Patient created
  ↓
Admission created (patient assigned to bed)
  ↓
Vitals recorded (by NURSE)
  ↓
Daily updates written (by DOCTOR/NURSE)
  ↓
Discharge summary prepared
  ↓
Bill generated
  ↓
Insurance claim submitted
  ↓
Discharge finalized
```

### 11.2 Prescription Lifecycle

```
Prescription created by DOCTOR (status: DRAFT)
  ↓
Safety check performed (allergy, drug interactions)
  ↓
Prescription submitted (status: SUBMITTED)
  ↓
PHARMACIST views in queue
  ↓
PHARMACIST dispenses (status: DISPENSED, inventory deducted)
  ↓
Prescription expires (status: EXPIRED) after N days if not used
```

### 11.3 Organ Matching Lifecycle

```
Living donor registers (public)
  ↓
Donor passes screening (staff only)
  ↓
Donor added to staff registry
  ↓
Organ retrieved (timestamp recorded)
  ↓
Match algorithm runs (calculates compatibility score)
  ↓
Match presented to transplant team
  ↓
Transplantation or expiration
```

---

## 12. Data Integrity Constraints

- **No orphan records**: Foreign keys should cascade appropriately or restrict deletion
- **Unique fields**: email (User), anonymousId (LivingDonor), medicineId+hospitalId (PharmacyInventory)
- **Status enums**: Values must be exact strings (e.g., "ACTIVE", "DRAFT", "APPROVED")
- **Timestamps**: All timestamps ISO-8601; use UTC server time
- **IDs**: Strings with meaningful prefixes; stable and unique within entity type
- **Relationships**: One-to-many and many-to-one as documented; no implicit many-to-many

---

## 13. Known Out-of-Scope

- National organ registry integration
- Live insurance provider API integration
- Real SMS/email sending (backend can simulate)
- External geospatial services (backend calculates distance)
- Video consultation platform
- Native mobile database

---

**Last Updated**: 2026-09-13  
**For Questions**: See `docs/BACKEND_HANDOFF.md` and frontend feature services (`src/features/*/services/`)
