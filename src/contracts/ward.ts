import type { EntityId, ISODateTimeString } from "./common";

export type Hospital = {
  id: EntityId;
  name: string;
  code: string;
  addressDisplay?: string;
};

export type Ward = {
  id: EntityId;
  hospitalId: EntityId;
  name: string;
  code: string;
  floor?: string;
};

export type Room = {
  id: EntityId;
  wardId: EntityId;
  name: string;
  number: string;
};

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "RESERVED";

export type Bed = {
  id: EntityId;
  roomId: EntityId;
  wardId: EntityId;
  label: string;
  status: BedStatus;
  currentAdmissionId?: EntityId;
  updatedAt: ISODateTimeString;
};

// Kept for backward compatibility with phase 0 components if any still exist
export type WardBed = {
  id: EntityId;
  wardId: EntityId;
  label: string;
  state: BedStatus;
  patientId?: EntityId;
};
