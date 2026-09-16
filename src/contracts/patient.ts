import type { EntityId, ISODateString, ISODateTimeString, BloodGroup, Gender } from "./common";

export type Patient = {
  id: EntityId;
  patientNumber: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: ISODateString;
  gender: Gender;
  bloodGroup: BloodGroup;
  phoneDisplay?: string;
  allergies: string[];
  createdAt: ISODateTimeString;
};

export type PatientAdmissionStatus = "ADMITTED" | "DISCHARGED" | "TRANSFERRED";

export type PatientAdmission = {
  id: EntityId;
  patientId: EntityId;
  hospitalId: EntityId;
  wardId: EntityId;
  roomId: EntityId;
  bedId: EntityId;
  primaryDoctorId: EntityId;
  admittedAt: ISODateTimeString;
  dischargedAt?: ISODateTimeString;
  status: PatientAdmissionStatus;
};

export type VitalsRecord = {
  id: EntityId;
  patientId: EntityId;
  admissionId?: EntityId;
  recordedAt: ISODateTimeString;
  temperatureCelsius: number;
  systolicBp: number;
  diastolicBp: number;
  oxygenSaturationPercent: number;
  recordedByUserId: EntityId;
  note?: string;
};

export type DailyPatientUpdate = {
  id: EntityId;
  patientId: EntityId;
  admissionId?: EntityId;
  content: string;
  authorUserId: EntityId;
  authorRole: string;
  createdAt: ISODateTimeString;
  updatedAt?: ISODateTimeString;
  visibility: "STAFF" | "FAMILY";
};

export type PatientAllergy = {
  id: EntityId;
  patientId: EntityId;
  allergen: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  identifiedAt: ISODateTimeString;
};

export type LabResult = {
  id: EntityId;
  patientId: EntityId;
  admissionId?: EntityId;
  testName: string;
  resultDisplay: string;
  referenceRange?: string;
  flag?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
  performedAt: ISODateTimeString;
};

// Kept for backward-compatibility with phase 0 components if any still exist,
// but new feature code should map Patient+Admission to this UI shape.
export type PatientSummary = {
  id: EntityId;
  hospitalNumber: string;
  fullName: string;
  wardId: EntityId;
  bedId: EntityId;
  primaryDoctorId: EntityId;
  latestUpdateAt: ISODateTimeString;
};
