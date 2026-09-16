import type { AuthUser } from "@/contracts/auth";
import type { Hospital, Ward, Room, Bed } from "@/contracts/ward";
import type {
  Patient,
  PatientAdmission,
  VitalsRecord,
  DailyPatientUpdate,
  LabResult,
  PatientAllergy,
} from "@/contracts/patient";
import type {
  OrganDonor,
  OrganRecipient,
  OrganMatch,
  WaitingListEntry,
  OrganTransit,
  LivingDonorRegistration,
} from "@/contracts/organ";
import type {
  BloodDonor,
  BloodDonation,
  BloodUnit,
  EmergencySOS,
} from "@/contracts/blood";
import type {
  Medicine,
  PharmacyInventoryItem,
  Prescription,
  DispenseRecord,
} from "@/contracts/pharmacy";
import type {
  Bill,
  InsuranceClaim,
  DischargeSummary,
} from "@/contracts/billing";
import type { Notification } from "@/contracts/notification";

import { generateMockData } from "../factories";

export type MockDatabase = {
  hospitals: Hospital[];
  wards: Ward[];
  rooms: Room[];
  beds: Bed[];

  users: AuthUser[];

  patients: Patient[];
  admissions: PatientAdmission[];
  vitals: VitalsRecord[];
  dailyUpdates: DailyPatientUpdate[];
  labResults: LabResult[];
  patientAllergies: PatientAllergy[];

  organDonors: OrganDonor[];
  organRecipients: OrganRecipient[];
  organMatches: OrganMatch[];
  waitingList: WaitingListEntry[];
  organTransits: OrganTransit[];
  livingDonors: LivingDonorRegistration[];

  bloodDonors: BloodDonor[];
  bloodDonations: BloodDonation[];
  bloodUnits: BloodUnit[];
  bloodSos: EmergencySOS[];

  medicines: Medicine[];
  pharmacyInventory: PharmacyInventoryItem[];
  prescriptions: Prescription[];
  dispenseRecords: DispenseRecord[];

  bills: Bill[];
  insuranceClaims: InsuranceClaim[];
  dischargeSummaries: DischargeSummary[];

  notifications: Notification[];
};

let db: MockDatabase | null = null;

export function createMockDatabase(now: Date = new Date()): MockDatabase {
  return generateMockData(now);
}

export function getMockDatabase(): MockDatabase {
  if (!db) {
    db = createMockDatabase();
  }
  return db;
}

export function resetMockDatabase(now: Date = new Date()): void {
  db = createMockDatabase(now);
}
