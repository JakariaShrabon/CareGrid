# Backend Handoff — Phase 11 Finalized

**Status**: Ready for backend implementation  
**Frontend Version**: Phase 11 Complete  
**Target API Version**: v1 (http://localhost:8000/api/v1)  
**Date**: 2026-09-13

---

## Executive Summary

The CareGrid frontend is production-ready to integrate with a secure backend. This handoff specifies the contract, authority boundaries, and security model the backend must implement.

**Core Principle**: Frontend RBAC and validation are UX guards only. **Backend must enforce all security and business rules.**

---

## 1. Authentication & Session Management

### 1.1 Recommended Approach

- **HttpOnly secure cookies** for session tokens
- Cryptographically signed session tokens or tamper-proof JWTs
- Server-side session validation on every request
- No auth tokens exposed to JavaScript

### 1.2 Required Endpoints

```
POST   /auth/login
  Input:  { identifier, password }
  Output: { data: { user: AuthUser }, meta: { requestId, timestamp } }
  Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict

POST   /auth/logout
  Output: { data: {}, meta: { requestId, timestamp } }
  Clear session cookie

GET    /auth/me
  Requires: Valid session cookie
  Output: { data: { user: AuthUser }, meta: { requestId, timestamp } }
  Returns: 401 if session invalid

POST   /auth/forgot-password
  Input:  { email }
  Output: { data: { message: "Reset link sent" }, meta: { ... } }

POST   /auth/reset-password
  Input:  { token, newPassword }
  Output: { data: { message: "Password reset" }, meta: { ... } }
```

### 1.3 Canonical User Roles

**Exactly these 7 roles (no others):**

- DOCTOR
- NURSE
- BLOOD_BANK_COORDINATOR
- PHARMACIST
- BILLING_OFFICER
- PATIENT
- FAMILY_ATTENDANT

**No Admin role. No invented roles.**

---

## 2. Authorization & RBAC

### 2.1 On Every Request

1. Validate session is valid (not expired, not tampered)
2. Resolve user identity and role from session
3. Check if user has required permission for action
4. Check if user has access to specific resource (object-level authorization)
5. Log the action for audit trail
6. Return 401 Unauthorized or 403 Forbidden if checks fail

### 2.2 Permission Enforcement

| Permission                  | Allowed Roles                              | Responsibility                               |
| --------------------------- | ------------------------------------------ | -------------------------------------------- |
| `patient.read`              | DOCTOR, NURSE, PATIENT, FAMILY_ATTENDANT   | Scope to owned/assigned/linked patient       |
| `patient.update.write`      | DOCTOR, NURSE                              | Verify resource access                       |
| `patient.vitals.write`      | NURSE                                      | Verify patient resource access               |
| `ward.read`                 | DOCTOR, NURSE, BLOOD_BANK_COORDINATOR      | Scope to authorized wards                    |
| `ward.manage`               | NURSE                                      | Verify bed resource access                   |
| `organ.match.read`          | DOCTOR, BLOOD_BANK_COORDINATOR             | No scope restriction                         |
| `organ.waitlist.read`       | DOCTOR, BLOOD_BANK_COORDINATOR             | No scope restriction                         |
| `prescription.create`       | DOCTOR                                     | Verify patient context                       |
| `prescription.read`         | DOCTOR, PHARMACIST, PATIENT                | Scope to visible prescriptions               |
| `prescription.dispense`     | PHARMACIST                                 | Verify prescription access, deduct inventory |
| `pharmacy.inventory.manage` | PHARMACIST                                 | No scope restriction                         |
| `blood.inventory.manage`    | BLOOD_BANK_COORDINATOR                     | No scope restriction                         |
| `blood.sos.create`          | BLOOD_BANK_COORDINATOR                     | No scope restriction                         |
| `billing.read`              | BILLING_OFFICER, PATIENT, FAMILY_ATTENDANT | Scope to owned/linked patient                |
| `billing.manage`            | BILLING_OFFICER                            | No scope restriction                         |
| `insurance.manage`          | BILLING_OFFICER                            | No scope restriction                         |
| `discharge.manage`          | BILLING_OFFICER                            | No scope restriction                         |

### 2.3 Resource-Level Authorization

**Patient Records:**

- PATIENT → own record only
- DOCTOR/NURSE → assigned patients only
- FAMILY_ATTENDANT → linked patient only
- Prevent access to unrelated patients' data

**Notifications:**

- Only recipient's own notifications
- No cross-user notification access

**Bills/Discharge:**

- Only authorized user's patient
- FAMILY_ATTENDANT read-only (no write)

**Living Donor Records:**

- Anonymous registry (no auth required to create)
- Staff registry access restricted to authorized coordinators

---

## 3. Authority Boundaries (Backend Responsibility)

### 3.1 Clinical Authority

**Organ Matching:**

- Compatibility score calculation (blood group, HLA, urgency, distance)
- Ranked result ordering
- Waiting-list priority assignment
- MELD/PELD urgency scores
- Cold-ischemia countdown status (SAFE/WARNING/CRITICAL)

**Blood Bank:**

- Donor 56-day interval eligibility
- Low-stock threshold determination
- Emergency SOS donor matching
- Geospatial proximity calculations

**Pharmacy:**

- Allergy conflict detection
- Drug-drug interaction evaluation
- Dose safety validation
- Inventory deduction on dispense (not on create)

**Frontend limitation**: Cannot calculate or authorize these. Displays backend values only.

### 3.2 Financial Authority

**Billing:**

- Bill line-item totals
- Room/pharmacy/surgery/consultation charge lookup
- Bill finalization and locking

**Insurance:**

- Claim approval/rejection decision
- Coverage determination
- Copay/deductible calculations

**Frontend limitation**: Cannot calculate billing. Displays backend totals only.

### 3.3 Data Generation Authority

**PDF Generation:**

- Backend generates discharge summary PDF
- Frontend requests and downloads (no client-side PDF generation)

**Anonymous Reference:**

- Backend generates unique anonymous ID for living donor registration
- Frontend displays but cannot forge

---

## 4. API Endpoints (Complete Specification)

### Response Format (Required)

All responses:

```json
{
  "data": <response_data>,
  "meta": {
    "requestId": "unique-request-id",
    "timestamp": "2026-09-13T10:00:00Z"
  }
}
```

Errors:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "status": 400,
  "details": { "field": "error-info" }
}
```

### Auth Endpoints

```
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
```

### Patient Endpoints

```
GET    /patients                (filtered by user role/scope)
GET    /patients/:patientId
PUT    /patients/:patientId
GET    /patients/:patientId/vitals
POST   /patients/:patientId/vitals (NURSE only)
GET    /patients/:patientId/updates
POST   /patients/:patientId/updates (DOCTOR/NURSE only)
GET    /patients/:patientId/labs
```

### Ward Endpoints

```
GET    /wards
GET    /wards/:wardId
PUT    /wards/:wardId/beds/:bedId (NURSE only)
```

### Organ Endpoints

```
GET    /organ/matches
GET    /organ/matches/:matchId
GET    /organ/waiting-list
GET    /organ/ischemia (includes expiresAt for countdown)
GET    /organ/living-donors
POST   /organ/living-donors (no auth required)
POST   /organ/living-donors/screen (no auth required)
```

### Blood Bank Endpoints

```
GET    /blood-bank/inventory
GET    /blood-bank/donors
POST   /blood-bank/sos (BLOOD_BANK_COORDINATOR only)
GET    /blood-bank/map
```

### Pharmacy Endpoints

```
GET    /pharmacy/prescriptions (filtered by role)
GET    /pharmacy/prescriptions/:id
POST   /pharmacy/prescriptions (DOCTOR only, returns safety warnings)
POST   /pharmacy/prescriptions/:id/dispense (PHARMACIST only, deducts inventory)
GET    /pharmacy/inventory
```

### Billing Endpoints

```
GET    /billing/bills (filtered by authorization)
GET    /billing/bills/:billId
GET    /billing/claims
GET    /billing/discharge/:patientId
GET    /billing/discharge/:patientId/pdf (triggers PDF download)
```

### Notification Endpoints

```
GET    /notifications (current user only)
```

---

## 5. Type Contracts (Alignment)

**Frontend contracts**: `src/contracts/*.ts`

Key types backend must provide:

- `EntityId`: string (e.g., "patient_001")
- `ISODateString`: string (e.g., "2026-09-13")
- `ISODateTimeString`: string (e.g., "2026-09-13T10:00:00Z")
- `Money`: { amount, currency, precision }
- `BloodGroup`: O_POSITIVE | O_NEGATIVE | A_POSITIVE | A_NEGATIVE | B_POSITIVE | B_NEGATIVE | AB_POSITIVE | AB_NEGATIVE
- `Gender`: MALE | FEMALE | OTHER
- `BloodComponent`: WHOLE_BLOOD | RBC | PLATELETS | PLASMA
- `BedStatus`: AVAILABLE | OCCUPIED | CLEANING | RESERVED (not MAINTENANCE)
- `UserRole`: DOCTOR | NURSE | BLOOD_BANK_COORDINATOR | PHARMACIST | BILLING_OFFICER | PATIENT | FAMILY_ATTENDANT

---

## 6. API Switching (No Code Changes Required)

**Current (mock):**

```
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

**When backend ready (remote):**

```
NEXT_PUBLIC_API_MODE=remote
NEXT_PUBLIC_API_BASE_URL=<backend-url>
```

No React component changes needed. Feature services abstract the backend seamlessly.

---

## 7. Audit & Compliance

**Backend must log:**

- All auth attempts (success/failure)
- All authorization decisions (success/failure with reason)
- All business-critical actions (patient write, organ match, prescription, billing, discharge)
- Timestamp, user ID, action, resource, result, client IP

**Retention:**

- Sessions: Expire after N hours inactivity (recommend 1-2 hours)
- Audit logs: Retain per compliance (recommend 7 years for medical records)
- Patient data: HIPAA/GDPR compliant encryption at rest

---

## 8. Testing Checklist

- [ ] All auth endpoints implemented
- [ ] RBAC enforced on all endpoints
- [ ] Resource-level authorization verified
- [ ] Business rule authority implemented (see Section 3)
- [ ] API contract responses match format
- [ ] Timestamps ISO-8601
- [ ] Enums match canonical values
- [ ] Pagination for list endpoints
- [ ] Error responses meaningful
- [ ] 401/403 returned appropriately
- [ ] Audit logging in place
- [ ] Session validation on every request
- [ ] E2E test suite passes (no frontend code changes needed)

---

## 9. Contract Stability

Backend integration conforms to `src/contracts` and `docs/API_CONTRACT.md`.

If backend needs contract changes:

1. Update TypeScript contracts first
2. Adjust feature services
3. Update API handlers in MSW (for testing)
4. Update UI if needed

---

## 10. Known Out-of-Scope

- Native mobile applications
- Live national organ registry integration
- Live external insurance-provider integration
- Telemedicine/video consultation
- Payment gateway integration
- Admin super-dashboard

---

**Last Updated**: 2026-09-13  
**For Questions**: See `docs/API_CONTRACT.md`, `docs/FRONTEND_ARCHITECTURE.md`, or `src/contracts/`
