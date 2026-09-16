import type { AuthUser } from "@/contracts/auth";

export const DEMO_USERS: Record<string, AuthUser> = {
  "doctor@caregrid.demo": {
    id: "usr_doctor_001",
    name: "Dr. Farhana Rahman",
    email: "doctor@caregrid.demo",
    role: "DOCTOR",
    hospitalId: "hosp_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "nurse@caregrid.demo": {
    id: "usr_nurse_001",
    name: "Nurse Sarah Jenkins",
    email: "nurse@caregrid.demo",
    role: "NURSE",
    hospitalId: "hosp_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "blood@caregrid.demo": {
    id: "usr_blood_001",
    name: "Marcus Chen",
    email: "blood@caregrid.demo",
    role: "BLOOD_BANK_COORDINATOR",
    hospitalId: "hosp_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "pharmacist@caregrid.demo": {
    id: "usr_pharm_001",
    name: "Priya Patel",
    email: "pharmacist@caregrid.demo",
    role: "PHARMACIST",
    hospitalId: "hosp_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "billing@caregrid.demo": {
    id: "usr_billing_001",
    name: "James Wilson",
    email: "billing@caregrid.demo",
    role: "BILLING_OFFICER",
    hospitalId: "hosp_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "patient@caregrid.demo": {
    id: "usr_patient_001",
    name: "Emma Thompson",
    email: "patient@caregrid.demo",
    role: "PATIENT",
    patientId: "pat_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
  "family@caregrid.demo": {
    id: "usr_family_001",
    name: "Michael Thompson",
    email: "family@caregrid.demo",
    role: "FAMILY_ATTENDANT",
    patientId: "pat_001",
    createdAt: "2026-09-01T10:00:00Z",
  },
};

export const DEMO_PASSWORD = "CareGrid123!";
