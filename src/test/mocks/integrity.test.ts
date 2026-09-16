import { describe, it, expect, beforeEach } from "vitest";
import { getMockDatabase, resetMockDatabase } from "@/mocks/database/store";

describe("Mock Database Integrity", () => {
  beforeEach(() => {
    resetMockDatabase(new Date("2026-09-12T00:00:00Z"));
  });

  it("should have all admissions refer to existing patients", () => {
    const db = getMockDatabase();
    db.admissions.forEach((admission) => {
      const patientExists = db.patients.some((p) => p.id === admission.patientId);
      expect(patientExists).toBe(true);
    });
  });

  it("should have all admissions refer to existing ward, room, and bed", () => {
    const db = getMockDatabase();
    db.admissions.forEach((admission) => {
      expect(db.wards.some((w) => w.id === admission.wardId)).toBe(true);
      expect(db.rooms.some((r) => r.id === admission.roomId)).toBe(true);
      expect(db.beds.some((b) => b.id === admission.bedId)).toBe(true);
    });
  });

  it("should have all vitals refer to existing patient and user", () => {
    const db = getMockDatabase();
    db.vitals.forEach((vital) => {
      expect(db.patients.some((p) => p.id === vital.patientId)).toBe(true);
      expect(db.users.some((u) => u.id === vital.recordedByUserId)).toBe(true);
    });
  });

  it("should have all occupied beds refer to an active admission", () => {
    const db = getMockDatabase();
    db.beds.filter((b) => b.status === "OCCUPIED").forEach((bed) => {
      expect(bed.currentAdmissionId).toBeDefined();
      expect(db.admissions.some((a) => a.id === bed.currentAdmissionId)).toBe(true);
    });
  });

  it("should have all organ matches refer to valid donor and recipient", () => {
    const db = getMockDatabase();
    db.organMatches.forEach((match) => {
      expect(db.organDonors.some((d) => d.id === match.donorId)).toBe(true);
      expect(db.organRecipients.some((r) => r.id === match.recipientId)).toBe(true);
    });
  });

  it("should have all blood donations refer to valid donors", () => {
    const db = getMockDatabase();
    db.bloodDonations.forEach((donation) => {
      expect(db.bloodDonors.some((d) => d.id === donation.donorId)).toBe(true);
    });
  });

  it("should have all prescriptions refer to valid patient and prescriber", () => {
    const db = getMockDatabase();
    db.prescriptions.forEach((rx) => {
      expect(db.patients.some((p) => p.id === rx.patientId)).toBe(true);
      expect(db.users.some((u) => u.id === rx.prescriberUserId)).toBe(true);
      rx.items.forEach((item) => {
        expect(db.medicines.some((m) => m.id === item.medicineId)).toBe(true);
      });
    });
  });

  it("should have all bills refer to valid patient and admission", () => {
    const db = getMockDatabase();
    db.bills.forEach((bill) => {
      expect(db.patients.some((p) => p.id === bill.patientId)).toBe(true);
      expect(db.admissions.some((a) => a.id === bill.admissionId)).toBe(true);
    });
  });

  it("should have all notifications refer to valid users", () => {
    const db = getMockDatabase();
    db.notifications.forEach((notification) => {
      expect(db.users.some((u) => u.id === notification.userId)).toBe(true);
    });
  });
});
