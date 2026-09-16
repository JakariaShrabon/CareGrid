import type { EntityId, ISODateTimeString } from "./common";

export type Medicine = {
  id: EntityId;
  genericName: string;
  brandName?: string;
  strength: string;
  form: string;
  activeIngredient?: string;
};

export type PharmacyInventoryItem = {
  medicineId: EntityId;
  hospitalId: EntityId;
  availableQuantity: number;
  reservedQuantity?: number;
  lowStockThreshold: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
  updatedAt: ISODateTimeString;
};

export type PrescriptionStatus = "DRAFT" | "PENDING" | "REVIEWED" | "READY" | "DISPENSED" | "CANCELLED";

export type PrescriptionItem = {
  id: EntityId;
  medicineId: EntityId;
  medicineDisplay: string;
  dosage: string;
  frequency: string;
  route?: string;
  duration: string;
  instructions?: string;
};

export type PrescriptionSafetyResult = {
  status: "SAFE" | "ALLERGY_WARNING" | "INTERACTION_WARNING" | "MULTIPLE_WARNINGS";
  warnings: Array<{
    code: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    message: string;
    medicineIds: EntityId[];
  }>;
};

export type Prescription = {
  id: EntityId;
  patientId: EntityId;
  admissionId: EntityId;
  prescriberUserId: EntityId;
  status: PrescriptionStatus;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  items: PrescriptionItem[];
  safetySummary?: PrescriptionSafetyResult;
};

export type DispenseRecord = {
  id: EntityId;
  prescriptionId: EntityId;
  patientId: EntityId;
  dispensedByUserId: EntityId;
  dispensedAt: ISODateTimeString;
  items: Array<{
    medicineId: EntityId;
    quantity: number;
  }>;
};
