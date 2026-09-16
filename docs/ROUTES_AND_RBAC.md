# Routes And RBAC

## Route Strategy

CareGrid uses shared functional routes. Pages should alter available actions by permission instead of duplicating full pages by role.

Planned routes:

- `/dashboard`
- `/patients`
- `/patients/[patientId]`
- `/wards`
- `/organ`
- `/organ/matches`
- `/organ/matches/[matchId]`
- `/organ/waiting-list`
- `/organ/ischemia`
- `/organ/living-donors`
- `/blood-bank`
- `/blood-bank/inventory`
- `/blood-bank/donors`
- `/blood-bank/sos`
- `/blood-bank/map`
- `/pharmacy`
- `/pharmacy/prescriptions`
- `/pharmacy/prescriptions/new`
- `/pharmacy/prescriptions/[id]`
- `/pharmacy/inventory`
- `/billing`
- `/billing/bills`
- `/billing/bills/[id]`
- `/billing/claims`
- `/billing/discharge`
- `/billing/discharge/[patientId]`
- `/notifications`
- `/profile`
- `/unauthorized`
- `/my-care`
- `/family-care`
- `/donor`
- `/donor/register`
- `/donor/screening`
- `/donor/success`

This foundation implements public, auth, dashboard shell, read-only portals for Patient and Family roles, public living donor registration, and unauthorized pages. Full read-write business module dashboards (Doctor, Nurse, etc.) are intentionally left for later phases.

## Permissions

- `patient.read`
- `patient.vitals.write`
- `patient.update.write`
- `ward.read`
- `ward.manage`
- `organ.match.read`
- `organ.waitlist.read`
- `prescription.create`
- `prescription.read`
- `prescription.dispense`
- `pharmacy.inventory.manage`
- `blood.inventory.manage`
- `blood.sos.create`
- `billing.read`
- `billing.manage`
- `insurance.manage`
- `discharge.manage`

## Role Mapping

- DOCTOR: patient read/update, organ match and waiting list read, prescription create/read.
- NURSE: patient read, vitals write, update write, ward read/manage.
- BLOOD_BANK_COORDINATOR: blood inventory, SOS creation, organ match read.
- PHARMACIST: prescription read/dispense, pharmacy inventory manage.
- BILLING_OFFICER: billing read/manage, insurance manage, discharge manage.
- PATIENT: patient read and billing read.
- FAMILY_ATTENDANT: patient read only.

## Security Rule

Frontend RBAC is UX protection only. The backend must enforce authorization for every API endpoint and persist audit context for sensitive actions.
