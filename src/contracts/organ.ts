import type { EntityId, ISODateTimeString, BloodGroup } from "./common";

export type OrganType = "KIDNEY" | "LIVER" | "HEART" | "LUNG" | "PANCREAS" | "CORNEA";

export type OrganDonor = {
  id: EntityId;
  patientId: EntityId; // For deceased donors, links to their patient record
  bloodGroup: BloodGroup;
  organType: OrganType;
  status: "AVAILABLE" | "MATCHED" | "TRANSIT" | "TRANSPLANTED" | "EXPIRED";
  registeredAt: ISODateTimeString;
};

export type OrganRecipient = {
  id: EntityId;
  patientId: EntityId;
  bloodGroup: BloodGroup;
  organType: OrganType;
  urgencyLabel: string;
  meldScore?: number;
  peldScore?: number;
  status: "WAITING" | "MATCHED" | "TRANSPLANTED" | "REMOVED";
  registeredAt: ISODateTimeString;
};

export type CompatibilityFactorBreakdown = {
  bloodGroup: { compatible: boolean; score: number };
  hla: { score: number };
  urgency: { score: number };
  distance: { distanceKm: number; score: number };
  overallScore: number;
};

export type OrganMatch = {
  id: EntityId;
  donorId: EntityId;
  recipientId: EntityId;
  organType: OrganType;
  bloodGroupCompatible: boolean;
  hlaCompatibilityPercent: number;
  urgencyScore: number;
  distanceKm: number;
  overallCompatibilityScore: number;
  factors: CompatibilityFactorBreakdown;
  rank: number;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED";
  createdAt: ISODateTimeString;
};

export type WaitingListEntry = {
  id: EntityId;
  recipientId: EntityId;
  organType: OrganType;
  bloodGroup: BloodGroup;
  urgencyLabel: string;
  meldScore?: number;
  peldScore?: number;
  waitingSince: ISODateTimeString;
  daysWaiting: number;
  priorityRank: number;
  status: "ACTIVE" | "ON_HOLD" | "MATCHED" | "TRANSPLANTED";
};

export type OrganTransitStatus = "SAFE" | "WARNING" | "CRITICAL" | "EXPIRED" | "DELIVERED";

export type OrganTransit = {
  id: EntityId;
  organType: OrganType;
  donorId: EntityId;
  recipientId?: EntityId;
  retrievedAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
  originHospitalId: EntityId;
  destinationHospitalId: EntityId;
  status: OrganTransitStatus;
};

export type LivingDonorRegistration = {
  id: EntityId;
  anonymousReference: string;
  bloodGroup?: BloodGroup;
  organInterest: OrganType;
  screeningStatus: "PENDING" | "ELIGIBLE" | "INELIGIBLE";
  registeredAt: ISODateTimeString;
};
