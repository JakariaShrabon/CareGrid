import type { EntityId, ISODateTimeString, Money } from "./common";

export type BillItemCategory = "ROOM" | "PHARMACY" | "SURGERY" | "CONSULTATION" | "OTHER";

export type BillItem = {
  id: EntityId;
  category: BillItemCategory;
  description: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
};

export type BillStatus = "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";

export type Bill = {
  id: EntityId;
  patientId: EntityId;
  admissionId: EntityId;
  items: BillItem[];
  subtotal: Money;
  insuranceAdjustment?: Money;
  patientPayable: Money;
  status: BillStatus;
  generatedAt: ISODateTimeString;
};

export type ClaimStatus = "PENDING" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export type InsuranceClaim = {
  id: EntityId;
  patientId: EntityId;
  billId: EntityId;
  providerName: string;
  claimNumber: string;
  status: ClaimStatus;
  submittedAt?: ISODateTimeString;
  decidedAt?: ISODateTimeString;
  approvedAmount?: Money;
  decisionMessage?: string;
  updatedAt: ISODateTimeString;
};

export type DischargeStatus = "DRAFT" | "FINALIZED";

export type DischargeSummary = {
  id: EntityId;
  patientId: EntityId;
  admissionId: EntityId;
  generatedAt: ISODateTimeString;
  generatedByUserId: EntityId;
  staySummary: string;
  labResults: string; // Summarized lab results
  medicationSchedule: string;
  downloadUrl?: string;
  status: DischargeStatus;
};
