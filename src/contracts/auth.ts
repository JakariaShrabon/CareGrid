import type { EntityId, ISODateTimeString } from "./common";

export const USER_ROLES = [
  "DOCTOR",
  "NURSE",
  "BLOOD_BANK_COORDINATOR",
  "PHARMACIST",
  "BILLING_OFFICER",
  "PATIENT",
  "FAMILY_ATTENDANT",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AuthUser = {
  id: EntityId;
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: EntityId;
  patientId?: EntityId;
  createdAt: ISODateTimeString;
};

export type AuthSession = {
  user: AuthUser;
  authenticatedAt: ISODateTimeString;
};

export type LoginCredentials = {
  identifier: string;
  password: string;
  rememberMe?: boolean;
};

export type PublicRegistrationRole = "PATIENT" | "FAMILY_ATTENDANT";

export type RegisterAccountRequest = {
  name: string;
  email: string;
  password: string;
  role: PublicRegistrationRole;
};
