import type { EntityId, ISODateTimeString, BloodGroup } from "./common";

export const BLOOD_COMPONENTS = ["WHOLE_BLOOD", "RBC", "PLATELETS", "PLASMA"] as const;
export type BloodComponent = (typeof BLOOD_COMPONENTS)[number];

export type BloodDonor = {
  id: EntityId;
  displayName: string;
  bloodGroup: BloodGroup;
  lastDonationAt?: ISODateTimeString;
  eligible: boolean;
  nextEligibleAt?: ISODateTimeString;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
};

export type BloodDonation = {
  id: EntityId;
  donorId: EntityId;
  hospitalId: EntityId;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  volumeMl: number;
  donatedAt: ISODateTimeString;
};

export type BloodUnitStatus = "AVAILABLE" | "RESERVED" | "EXPIRED" | "DISCARDED";

export type BloodUnit = {
  id: EntityId;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  collectedAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
  status: BloodUnitStatus;
  hospitalId: EntityId;
  reservedForPatientId?: EntityId;
};

export type BloodInventorySummary = {
  bloodGroup: BloodGroup;
  component: BloodComponent;
  availableUnits: number;
  reservedUnits: number;
  expiringSoonUnits: number;
  safeThreshold: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
};

export type EmergencySOSStatus = "ACTIVE" | "FULFILLED" | "CANCELLED";

export type EmergencySOS = {
  id: EntityId;
  hospitalId: EntityId;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  requiredUnits: number;
  urgency: "HIGH" | "CRITICAL";
  requiredBy: ISODateTimeString;
  reason: string;
  status: EmergencySOSStatus;
  createdByUserId: EntityId;
  createdAt: ISODateTimeString;
  matchedEligibleDonorCount: number;
  deliverySummary?: string;
};
