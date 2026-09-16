# Phase 11 — Final Frontend Completion & Backend Handoff

**Status**: IN PROGRESS  
**Target Date**: 2026-09-13  
**Scope**: Final audit and handoff for production-ready frontend

---

## Executive Summary

Phase 11 is **NOT** introducing new business features or redesigning working modules. Instead, it systematically:

1. Audits all source requirements against implementation
2. Identifies gaps and confirms intentional out-of-scope decisions
3. Performs targeted, justified fixes only
4. Ensures architecture consistency and security boundaries
5. Validates responsive design and accessibility
6. Completes backend/database handoff documentation

**Guardrail**: Maximum 2 focused repair cycles per issue. No endless fix/test loops.

---

## Section 1: Source Requirement Audit

### 1.1 Scope

Read all original CareGrid source documents and create a requirement matrix tracking:

- Source requirement
- Implemented route/component
- API/hook
- Test coverage
- Status (PASS | IMPLEMENTATION_EXTENSION | OUT_OF_SCOPE | GAP)

### 1.2 Modules to Audit

**Shared Platform**

- Authentication and session management
- Role-based access control (RBAC)
- Central navigation and layout
- User profile/logout
- Session persistence and rehydration

**Auth/RBAC**

- Login/logout flow
- Protected route handling
- Mock session adapter
- Permission helpers (`can()`, `hasPermission()`)
- No auth token exposure in UI

**Patient Care**

- Patient list view (authorized scope)
- Patient detail view
- Vitals display and charting
- Daily updates (doctor/nurse write, family read-only)
- Lab results display

**Ward & Bed Management**

- Ward list
- Room/bed status display
- Exact statuses: AVAILABLE, OCCUPIED, CLEANING, RESERVED
- No MAINTENANCE status

**Organ Donation & Matching**

- Compatibility matching display
- Blood group, HLA, urgency, distance factors
- Ranked results and overall assessment
- Recipient waiting list
- MELD/PELD urgency information
- Cold-ischemia countdown
- Living donor registry
- Public living donor registration flow

**Blood Bank & Emergency SOS**

- WHOLE_BLOOD, RBC, PLATELETS, PLASMA inventory
- Low-stock and expiry indication
- Donor directory
- 56-day eligibility eligibility indicator
- Emergency SOS workflow
- SMS/email simulation boundary
- Geofenced donor map or distance calculation

**Pharmacy & E-Prescriptions**

- Digital prescription creation
- Patient context
- Multi-medication workflow
- Allergy warning display
- Drug-interaction warning display
- Pharmacist queue
- Dispensing workflow
- Inventory stock deduction

**Billing & Insurance**

- Room, pharmacy, surgery, consultation charges
- Itemized bill display
- Insurance claim tracking (APPROVED, REJECTED)
- Bill totals as API authority
- Discharge summary with PDF download

**Patient & Family Portals**

- Patient: own scoped care only, read-only content, discharge access
- Family: linked patient only, read-only updates, discharge information
- No Family clinical writes
- No hospital-wide patient list exposure

**Living Donor Flow**

- Anonymous public registration
- Preliminary/demo screening
- Backend-generated anonymous reference
- UI discloses screening is NOT final medical clearance

**Notifications**

- In-app Notification Center (implementation support feature)
- Current-user API scoping
- Safe internal deep links

**Role Dashboards**

- DOCTOR, NURSE, BLOOD_BANK_COORDINATOR, PHARMACIST, BILLING_OFFICER, PATIENT, FAMILY_ATTENDANT
- One canonical `/dashboard` route with role-specific composition
- No duplicated role-specific routes

---

## Section 2: Architecture Consistency Audit

### 2.1 Data Flow Pattern

```
UI Component
  ↓
Feature Hook (useFeatureQuery, useFeatureAction)
  ↓
Feature API Service
  ↓
Central API Client
  ↓
MSW (mock) / Backend (production)
```

**Audit**: No business UI directly imports mock data or calls network APIs.

### 2.2 Role & Permission Architecture

- Centralized permission helpers (e.g., `can()`, `hasPermission()`)
- Minimal scattered role checks in components
- Role switching only at dashboard-composition boundary

### 2.3 API Architecture

- Central API client configuration
- Consistent error handling
- No hardcoded API URLs in component logic
- NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_API_MODE environment variables

### 2.4 Contract Duplication

- Single canonical definitions for common types:
  - EntityId, ISODateString, ISODateTimeString
  - Money, BloodGroup, Gender
  - BedStatus, BloodComponent

### 2.5 Shared Component Duplication

- One implementation per generic UI: PageContainer, PageHeader, StatCard, StatusBadge, DataTableShell, LoadingState, EmptyState, ErrorState, Alert, Dialog, FormField, SearchInput

---

## Section 3: Responsive & UI Polish

### 3.1 Breakpoint Testing

Test all core routes at:

- 375px (mobile)
- 768px (tablet)
- 1280px (desktop)

**Routes to audit**:

- /dashboard
- /patients, /patients/[id]
- /wards
- /organ, /organ/matches, /organ/ischemia
- /blood-bank, /blood-bank/inventory, /blood-bank/sos, /blood-bank/map
- /pharmacy, /pharmacy/prescriptions, /pharmacy/prescriptions/new
- /billing, /billing/bills, /billing/claims, /billing/discharge
- /my-care, /family-care, /donor
- /notifications

### 3.2 Quality Targets

- No page-level horizontal overflow
- Tables intentionally scrollable when dense
- Forms usable on mobile
- Dialogs usable on mobile
- Charts responsive
- Maps usable
- Dashboard cards appropriate size
- Quick actions touch-friendly
- Status labels not truncated

### 3.3 Visual Consistency

- Consistent page headers
- Consistent page spacing and card styling
- Uniform form spacing
- Consistent section heading hierarchy
- Consistent status badges
- Consistent empty/error/loading views

---

## Section 4: Accessibility Polish

### 4.1 WCAG Fundamentals

- [ ] One meaningful H1 per page
- [ ] Logical heading hierarchy
- [ ] Labels for all inputs
- [ ] Form errors semantically associated
- [ ] Keyboard-accessible actions
- [ ] Dialog focus behavior
- [ ] Icon button aria-labels
- [ ] Links with meaningful names
- [ ] Semantic tables
- [ ] Status not color-only
- [ ] Read/unread not color-only
- [ ] Images/maps have textual context

---

## Section 5: Security & RBAC Boundary Audit

### 5.1 Auth Flow Audit

- [ ] Protected routes wait for session hydration
- [ ] No protected-content flash
- [ ] Full browser reload preserves mock authentication
- [ ] Logout clears mock session
- [ ] Safe `returnTo` handling (internal only)
- [ ] No auth tokens exposed through UI state
- [ ] Mock session persistence isolated behind adapter

### 5.2 RBAC Audit

- [ ] Centralized permission architecture
- [ ] No scattered role checks (except dashboard boundary)
- [ ] Use `can()` / `hasPermission()` helpers
- [ ] Frontend RBAC is UX protection only

### 5.3 Object-Level Security Documentation

- PATIENT → own resources only
- FAMILY_ATTENDANT → linked patient only
- Notification recipient → authenticated recipient only
- Bills → permitted patient/resource only
- Discharge → permitted patient/family/resource only

**Production documentation**: Backend must enforce these at API/database level.

### 5.4 Direct Mock Import Audit

- [ ] Search `src/app/` and `src/features/*/components/` for `@mocks/` or `src/mocks/` imports
- [ ] Business UI must NOT import mock database
- [ ] Exceptions: test files, mock infrastructure

---

## Section 6: Test Quality & Stability

### 6.1 Lint Warnings Cleanup

**Previous Phase 10 result**:

- 0 lint errors
- 2 exhaustive-deps warnings

**Phase 11 goal**:

- Find and fix those exact warnings properly
- Do NOT disable react-hooks/exhaustive-deps globally
- Use correct dependency stability/memoization

### 6.2 Playwright Stability

- [ ] Replace hard-coded `waitForTimeout()` with web-first assertions where possible
- [ ] Prefer: `getByRole()`, `getByLabel()`, `data-testid` when semantically appropriate
- [ ] Avoid brittle CSS paths and arbitrary sleeps
- [ ] Use proper Playwright synchronization

### 6.3 E2E Critical Flows

Retain deterministic coverage for:

- AUTH: login + reload
- DOCTOR: patient/vitals workflow representative flow
- NURSE: patient/ward workflow
- ORGAN: matching/waiting/ischemia representative flow
- BLOOD: inventory/SOS representative flow
- PHARMACY: Doctor prescription → Pharmacist dispense
- BILLING: bill → claim → discharge/PDF
- PATIENT: own care
- FAMILY: read-only linked care
- PUBLIC DONOR: anonymous donor flow
- DASHBOARDS: all seven roles

### 6.4 Mock Data Quality

- [ ] Deterministic data suitable for all module demonstrations
- [ ] Foreign-key integrity
- [ ] `resetMockDatabase()` restores baseline state
- [ ] No real personal data

### 6.5 Test Structure

- Vitest: unit, component, integration specs
- Playwright: E2E tests (intentionally excluded from Vitest)

---

## Section 7: Code Quality & Hygiene

### 7.1 Console & TODO Audit

- [ ] Remove debugging `console.log()`, `console.debug()`
- [ ] Resolve trivial TODOs/FIXMEs in-scope
- [ ] Document out-of-scope TODOs as known limitations

### 7.2 Debug/Scratch Artifact Cleanup

- [ ] Remove temporary development files
- [ ] Ensure generated folders are gitignored
- [ ] Do NOT delete legitimate source files

### 7.3 Repository Hygiene

- [ ] Confirm `.gitignore` includes: `.next/`, `node_modules/`, `playwright-report/`, `test-results/`, `coverage/`
- [ ] Verify `git status` is clean or only has intentional uncommitted changes

---

## Section 8: API & Contract Finalization

### 8.1 API Contract Audit

- [ ] Verify `docs/API_CONTRACT.md` lists all implemented endpoints
- [ ] No stale endpoint names
- [ ] No documented endpoint never used by UI
- [ ] Actual feature services match documentation

### 8.2 Endpoint Verification

```
GET   /patients
GET   /patients/:patientId
GET   /wards
GET   /organ/matches
GET   /organ/waiting-list
GET   /organ/ischemia
GET   /organ/living-donors
GET   /blood-bank/inventory
GET   /blood-bank/donors
POST  /blood-bank/sos
GET   /pharmacy/prescriptions
POST  /pharmacy/prescriptions
GET   /pharmacy/prescriptions/:id
POST  /pharmacy/prescriptions/:id/dispense
GET   /pharmacy/inventory
GET   /billing/bills
GET   /billing/bills/:id
GET   /billing/claims
GET   /billing/discharge/:patientId
GET   /billing/discharge/:patientId/pdf
GET   /notifications
```

### 8.3 Backend Authority Documentation

Explicitly document backend authority for:

- Organ compatibility score/rank, waiting-list priority, ischemia operational status
- Blood donor eligibility, inventory threshold, SOS donor matching
- Prescription allergy safety, drug interactions, inventory deduction
- Billing calculations, insurance decisions, discharge/PDF generation
- Patient/family resource authorization
- Notification recipient scoping
- SMS/email sending

---

## Section 9: Environmental & Configuration Audit

### 9.1 Environment Variables

- [ ] `.env.example` or equivalent documents:
  - `NEXT_PUBLIC_API_MODE=mock` vs `remote`
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`
- [ ] No secrets in NEXT_PUBLIC variables

### 9.2 Mock Mode Integration Switch

Document the intended switch remains:

```
NEXT_PUBLIC_API_MODE=remote
NEXT_PUBLIC_API_BASE_URL=<backend /api/v1>
```

No React component rewrite required. Document any blocker.

---

## Section 10: Role Audit

### 10.1 Canonical Roles

Must remain exactly:

- DOCTOR
- NURSE
- BLOOD_BANK_COORDINATOR
- PHARMACIST
- BILLING_OFFICER
- PATIENT
- FAMILY_ATTENDANT

### 10.2 Accidental Role Audit

Search for unintended roles such as:

- ADMIN
- ORGAN_COORDINATOR
- BLOOD_BANK_TECHNICIAN

Unless clearly marked as historical documentation only. **Do not create Admin.**

---

## Section 11: Feature-Specific Audits

### 11.1 Organ Matching

- [ ] Blood group, HLA, urgency, distance factors displayed
- [ ] Ranked results and overall assessment shown
- [ ] Cold-ischemia countdown displayed
- [ ] Waiting list and MELD/PELD urgency shown
- [ ] Living donor registry accessible
- [ ] No authoritative matching logic in React

### 11.2 Blood Bank

- [ ] WHOLE_BLOOD, RBC, PLATELETS, PLASMA categories
- [ ] Low-stock and expiry indication
- [ ] Donor directory
- [ ] 56-day eligibility indicator
- [ ] SOS emergency workflow
- [ ] Geofenced/distance-based donor search
- [ ] No authoritative eligibility or SOS matching in React

### 11.3 Patient & Vitals

- [ ] Temperature, Blood Pressure, O2 Saturation displayed
- [ ] Trend visualization
- [ ] Daily updates (doctor/nurse write, family read-only)
- [ ] Patient list shows authorized scope only

### 11.4 Ward & Bed

- [ ] Bed statuses: AVAILABLE, OCCUPIED, CLEANING, RESERVED
- [ ] No MAINTENANCE status

### 11.5 Pharmacy

- [ ] Prescription creation, queue, dispensing workflow
- [ ] Allergy and drug-interaction warnings displayed
- [ ] No authoritative safety calculations in React

### 11.6 Billing

- [ ] Room, pharmacy, surgery, consultation charges
- [ ] Itemized bills
- [ ] Bill totals from API/backend
- [ ] Insurance claim states: APPROVED, REJECTED
- [ ] PDF download workflow

### 11.7 Discharge

- [ ] Complete stay information
- [ ] Lab results included
- [ ] Post-discharge medication schedule
- [ ] PDF download
- [ ] Backend authority for PDF generation

### 11.8 Living Donor

- [ ] Anonymous public registration
- [ ] Preliminary/demo screening
- [ ] Backend-generated anonymous reference
- [ ] UI discloses screening is NOT final medical clearance

### 11.9 Patient/Family Portals

- [ ] PATIENT: own resources only, read-only
- [ ] FAMILY: linked patient only, read-only
- [ ] Discharge information accessible where permitted
- [ ] No Family clinical writes

### 11.10 Dashboards

- [ ] One `/dashboard` route
- [ ] Correct view for each of 7 roles
- [ ] Dashboard business logic does not create authoritative clinical/financial/eligibility/inventory/matching logic
- [ ] Optional: document future `GET /dashboard` backend endpoint

---

## Section 12: Dead Links & Route Audit

### 12.1 Route Inventory

Audit all visible navigation:

- [ ] Sidebar navigation
- [ ] Dashboard quick actions
- [ ] Breadcrumbs
- [ ] Notification target links

**Goal**: Every internal link points to a valid, implemented, and authorized route.

### 12.2 Route Completeness

From ROUTES_AND_RBAC.md:

```
/dashboard
/patients, /patients/[patientId]
/wards
/organ, /organ/matches, /organ/matches/[matchId], /organ/waiting-list, /organ/ischemia, /organ/living-donors
/blood-bank, /blood-bank/inventory, /blood-bank/donors, /blood-bank/sos, /blood-bank/map
/pharmacy, /pharmacy/prescriptions, /pharmacy/prescriptions/new, /pharmacy/prescriptions/[id], /pharmacy/inventory
/billing, /billing/bills, /billing/bills/[id], /billing/claims, /billing/discharge, /billing/discharge/[patientId]
/notifications
/profile
/unauthorized
/my-care
/family-care
/donor, /donor/register, /donor/screening, /donor/success
```

---

## Section 13: Medical Copy & Unsafe Claim Audit

### 13.1 Search for Unsafe Phrases

- [ ] "completely safe"
- [ ] "guaranteed safe"
- [ ] "approved donor"
- [ ] "best transplant"
- [ ] "medically approved"
- [ ] "normal because..."

Remove unsupported medical authority claims. CareGrid is operational/decision-support software.

---

## Section 14: Standardization Audits

### 14.1 Date/Time Consistency

- [ ] Reuse established date utility
- [ ] Clinically important records show clear absolute timestamps
- [ ] Relative time may supplement, not replace critical timestamps
- [ ] Fix inconsistent formatting

### 14.2 Money Consistency

- [ ] All financial views use canonical Money formatter
- [ ] No hardcoded ৳ or $ formatting in components
- [ ] Search: `৳`, `$`, `BDT` outside canonical formatter

### 14.3 Status Consistency

- [ ] Review StatusBadge mappings across modules
- [ ] Same semantic meaning = consistent tone
- [ ] No status relying on color alone
- [ ] Focus on misleading cases only

---

## Section 15: Backend Handoff Documentation

### 15.1 Create `docs/BACKEND_HANDOFF.md` (Updated)

Must include:

- Production auth recommendation (HttpOnly secure cookies/session)
- Backend enforcement requirements:
  - Authentication
  - Role permission
  - Resource-level authorization
- Frontend guards are UX-only
- Authority boundaries (as per Section 12 of main plan)

### 15.2 Create `docs/DATABASE_HANDOFF.md`

Must NOT dictate SQL schema. Document entity relationships:

```
Hospital → Ward → Room → Bed
Patient → Admission → Vitals → Daily Updates → Lab Results
Organ Donor/Recipient → Match → Waiting List → Transit
Blood Donor → Donation → Blood Unit → Inventory/SOS
Patient/Admission → Prescription → Prescription Items → Dispense
Patient/Admission → Bill → Bill Items → Insurance Claim
Patient/Admission → Discharge Summary
User → Notifications
```

Document important references, identifiers, and lifecycle expectations.

---

## Section 16: Final Documentation

### 16.1 Create `docs/FINAL_REQUIREMENTS_AUDIT.md`

Matrix for each module:

- SOURCE REQUIREMENT
- IMPLEMENTED ROUTE/COMPONENT
- API/HOOK
- TEST
- STATUS (PASS | IMPLEMENTATION_EXTENSION | OUT_OF_SCOPE | GAP)

### 16.2 Update/Create `README.md`

Developer runbook must include:

- Project purpose
- Prerequisites
- Install & development start
- Mock mode
- Test commands
- Playwright
- Production build
- Environment variables
- Major route/module overview
- Backend integration pointer
- Link to detailed docs

### 16.3 Create `docs/FRONTEND_COMPLETION_REPORT.md`

Final report covering:

- Completed phases 0–11
- Implemented modules
- Source-faithful features
- Implementation extensions
- Intentionally out-of-scope features
- Test results summary
- Responsive/accessibility audit summary
- Backend integration readiness
- Known limitations (explicit, no concealment)
- Remaining blockers before real backend replacement

---

## Section 17: Final Verification

### 17.1 Execution Guardrail (MAX 2 REPAIR CYCLES PER ISSUE)

After all fixes:

```bash
npm run lint          # Target: 0 errors, 0 warnings
npm run typecheck     # Target: PASS
npm run test          # Target: 0 failed
npx playwright test   # Target: 0 failed
npm run build         # Target: PASS
```

If any fails:

1. Identify exact root cause
2. Make ONE focused fix
3. Rerun only that command

**Maximum 2 focused attempts per issue.**

### 17.2 Final Verification Output

Report:

- lint: errors/warnings count
- typecheck: PASS/FAIL
- Vitest: passed/failed count
- Playwright: passed/failed count
- build: PASS/FAIL

---

## Section 18: Known Limitations (Explicit)

Legitimate out-of-scope items:

- Mock medical/safety logic is demonstration-only
- No real SMS/email provider
- No live insurance provider
- No national organ registry integration
- Frontend RBAC is UX protection only, not security boundary
- Mock data is NOT production clinical data
- PDF generation (frontend simulation; backend authority in production)

---

## Section 19: Checklist & Execution

### Phase 11 Execution Order

- [ ] 1. Create this plan (✓ DONE)
- [ ] 2. Read all source documents and create requirement matrix
- [ ] 3. Create FINAL_REQUIREMENTS_AUDIT.md
- [ ] 4. Audit and document canonical roles
- [ ] 5. Auth/session audit and documentation
- [ ] 6. RBAC centralization audit
- [ ] 7. Data architecture audit (no direct mock imports)
- [ ] 8. API base URL and contract audit
- [ ] 9. Common contract deduplication
- [ ] 10. Shared component deduplication
- [ ] 11. Lint warning cleanup (exhaustive-deps)
- [ ] 12. Playwright hard-coded wait replacement
- [ ] 13. Debug/scratch artifact cleanup
- [ ] 14. Console/TODO audit
- [ ] 15. Organ source audit
- [ ] 16. Blood bank source audit
- [ ] 17. Patient/Ward source audit
- [ ] 18. Pharmacy source audit
- [ ] 19. Billing/Insurance/Discharge audit
- [ ] 20. Patient/Family/Living Donor audit
- [ ] 21. Notification/Dashboard audit
- [ ] 22. Route/dead-link audit
- [ ] 23. Status consistency audit
- [ ] 24. Date/time consistency audit
- [ ] 25. Money consistency audit
- [ ] 26. Responsive audit (375px, 768px, 1280px)
- [ ] 27. Accessibility audit
- [ ] 28. Medical copy audit
- [ ] 29. Mock data quality audit
- [ ] 30. Test suite structure audit
- [ ] 31. E2E critical flows verification
- [ ] 32. Environment/configuration audit
- [ ] 33. Make focused Phase 11 fixes (cycle 1)
- [ ] 34. Targeted test run
- [ ] 35. Make focused Phase 11 fixes (cycle 2, if needed)
- [ ] 36. Final verification: `npm run lint`, `typecheck`, `test`, `playwright`, `build`
- [ ] 37. Update backend/database handoff docs
- [ ] 38. Create README updates
- [ ] 39. Cleanup repository hygiene
- [ ] 40. Create FRONTEND_COMPLETION_REPORT.md
- [ ] 41. STOP — No new phases

---

## Success Criteria

**Phase 11 is complete when**:

1. ✓ Requirement audit matrix complete and documented
2. ✓ Architecture is consistent (no direct mock imports, centralized permissions)
3. ✓ All audits documented (role, auth, RBAC, UI, API, routes, medical copy)
4. ✓ Security boundaries correctly understood and documented for backend
5. ✓ Responsive and accessible fundamentals verified
6. ✓ Test suite stable and covering critical flows
7. ✓ Final verification: `lint`, `typecheck`, `test`, `playwright test`, `build` all pass
8. ✓ Backend/database handoff documentation complete
9. ✓ README and completion report created
10. ✓ No new business features introduced
11. ✓ No new product scope added
12. ✓ Repository clean and ready for backend handoff

---

**Last Updated**: 2026-09-13  
**Next Phase**: NONE — This is the final frontend completion phase before backend integration.
