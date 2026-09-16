import type { Gender, BloodGroup } from "@/contracts/common";
import type { MockDatabase } from "../database/store";
import { DEMO_USERS } from "../data/demo-users";
import { addDays, subDays, addHours, subHours } from "date-fns";

export function generateMockData(now: Date): MockDatabase {
  const db: MockDatabase = {
    hospitals: [],
    wards: [],
    rooms: [],
    beds: [],
    users: Object.values(DEMO_USERS),
    patients: [],
    admissions: [],
    vitals: [],
    dailyUpdates: [],
    labResults: [],
    patientAllergies: [],
    organDonors: [],
    organRecipients: [],
    organMatches: [],
    waitingList: [],
    organTransits: [],
    livingDonors: [],
    bloodDonors: [],
    bloodDonations: [],
    bloodUnits: [],
    bloodSos: [],
    medicines: [],
    pharmacyInventory: [],
    prescriptions: [],
    dispenseRecords: [],
    bills: [],
    insuranceClaims: [],
    dischargeSummaries: [],
    notifications: [],
  };

  const nowIso = now.toISOString();

  // 1. Hospital
  db.hospitals.push({ id: "h1", name: "CareGrid General Hospital", code: "CGH", addressDisplay: "123 Health Ave" });

  // 2. Wards, Rooms, Beds
  const wardNames = ["ICU", "Cardiology", "Neurology", "Pediatrics"];
  wardNames.forEach((wName, wIdx) => {
    const wardId = `w${wIdx + 1}`;
    db.wards.push({ id: wardId, hospitalId: "h1", name: wName, code: wName.substring(0, 3).toUpperCase(), floor: `${wIdx + 1}` });

    for (let rIdx = 1; rIdx <= 2; rIdx++) {
      const roomId = `${wardId}_r${rIdx}`;
      db.rooms.push({ id: roomId, wardId, name: `Room ${rIdx}`, number: `10${rIdx}` });

      for (let bIdx = 1; bIdx <= 3; bIdx++) {
        const bedId = `${roomId}_b${bIdx}`;
        db.beds.push({ id: bedId, roomId, wardId, label: `Bed ${bIdx}`, status: "AVAILABLE", updatedAt: nowIso });
      }
    }
  });

  // 3. Patients & Admissions
  // First and last names removed as they were unused
  const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders: Gender[] = ["MALE", "FEMALE"];
  
  // Create specific demo patient for PATIENT and FAMILY roles
  const demoPatientId = "pat_001";
  const demoAdmissionId = "adm_001";
  
  db.patients.push({
    id: demoPatientId,
    patientNumber: "CG-2026-0001",
    firstName: "Emma",
    lastName: "Thompson",
    displayName: "Emma Thompson",
    dateOfBirth: subDays(now, 12000).toISOString(),
    gender: "FEMALE",
    bloodGroup: "O+",
    allergies: ["Penicillin"],
    createdAt: subDays(now, 30).toISOString(),
  });
  
  // Occupy a bed for demo patient
  const demoBed = db.beds[0];
  demoBed.status = "OCCUPIED";
  demoBed.currentAdmissionId = demoAdmissionId;
  
  db.admissions.push({
    id: demoAdmissionId,
    patientId: demoPatientId,
    hospitalId: "h1",
    wardId: demoBed.wardId,
    roomId: demoBed.roomId,
    bedId: demoBed.id,
    primaryDoctorId: db.users[0].id,
    admittedAt: subDays(now, 5).toISOString(),
    status: "ADMITTED",
  });
  
  db.dailyUpdates.push({
    id: "du_001",
    patientId: demoPatientId,
    admissionId: demoAdmissionId,
    content: "Patient is recovering well. Vitals are stable.",
    authorUserId: db.users[0].id,
    authorRole: "DOCTOR",
    createdAt: subDays(now, 1).toISOString(),
    visibility: "FAMILY"
  });
  
  for (let pIdx = 1; pIdx <= 25; pIdx++) {
    const pId = `p${pIdx}`;
    db.patients.push({
      id: pId,
      patientNumber: `CG-2026-${pIdx.toString().padStart(4, "0")}`,
      firstName: `PatientFirst${pIdx}`,
      lastName: `Last${pIdx}`,
      displayName: `PatientFirst${pIdx} Last${pIdx}`,
      dateOfBirth: subDays(now, 10000 + pIdx).toISOString(),
      gender: genders[pIdx % 2],
      bloodGroup: bloodGroups[pIdx % 4],
      allergies: pIdx % 3 === 0 ? ["Penicillin"] : [],
      createdAt: subDays(now, 30).toISOString(),
    });

    if (pIdx <= 15) { // 15 Active admissions
      const aId = `a${pIdx}`;
      const bed = db.beds[pIdx - 1]; // We have 24 beds, so first 15 get one
      bed.status = "OCCUPIED";
      bed.currentAdmissionId = aId;
      
      db.admissions.push({
        id: aId,
        patientId: pId,
        hospitalId: "h1",
        wardId: bed.wardId,
        roomId: bed.roomId,
        bedId: bed.id,
        primaryDoctorId: db.users[0].id,
        admittedAt: subDays(now, pIdx).toISOString(),
        status: "ADMITTED",
      });

      // Add Vitals
      db.vitals.push({
        id: `v${pIdx}`,
        patientId: pId,
        admissionId: aId,
        recordedAt: subHours(now, 1).toISOString(),
        temperatureCelsius: 37 + (pIdx % 2),
        systolicBp: 120,
        diastolicBp: 80,
        oxygenSaturationPercent: 98,
        recordedByUserId: db.users[1].id,
      });

      // Add Bills
      const bId = `bill${pIdx}`;
      db.bills.push({
        id: bId,
        patientId: pId,
        admissionId: aId,
        items: [{ id: `bi${pIdx}`, category: "ROOM", description: "ICU Room", quantity: 1, unitPrice: { amount: "10000", currency: "BDT" }, totalPrice: { amount: "10000", currency: "BDT" } }],
        subtotal: { amount: "10000", currency: "BDT" },
        patientPayable: { amount: "10000", currency: "BDT" },
        status: "DRAFT",
        generatedAt: nowIso
      });
    }
  }

  // 4. Blood Donors & Units
  for (let bdIdx = 1; bdIdx <= 20; bdIdx++) {
    db.bloodDonors.push({
      id: `bd${bdIdx}`,
      displayName: `BloodDonor ${bdIdx}`,
      bloodGroup: bloodGroups[bdIdx % 4],
      eligible: bdIdx % 2 === 0,
      lastDonationAt: subDays(now, 100).toISOString(),
      distanceKm: 5
    });

    db.bloodUnits.push({
      id: `bu${bdIdx}`,
      bloodGroup: bloodGroups[bdIdx % 4],
      component: "WHOLE_BLOOD",
      collectedAt: subDays(now, 10).toISOString(),
      expiresAt: addDays(now, 20).toISOString(),
      status: "AVAILABLE",
      hospitalId: "h1"
    });
  }

  db.bloodSos.push({
    id: "sos1",
    hospitalId: "h1",
    bloodGroup: "O+",
    component: "RBC",
    requiredUnits: 5,
    urgency: "CRITICAL",
    requiredBy: addHours(now, 2).toISOString(),
    reason: "Emergency Surgery",
    status: "ACTIVE",
    createdByUserId: db.users[0].id,
    createdAt: nowIso,
    matchedEligibleDonorCount: 3
  });

  // 5. Pharmacy
  for (let mIdx = 1; mIdx <= 20; mIdx++) {
    const mId = `m${mIdx}`;
    db.medicines.push({
      id: mId,
      genericName: `GenericMed${mIdx}`,
      strength: "500mg",
      form: "Tablet",
    });
    db.pharmacyInventory.push({
      medicineId: mId,
      hospitalId: "h1",
      availableQuantity: 100,
      lowStockThreshold: 20,
      status: "SAFE",
      updatedAt: nowIso
    });
  }

  const presId = "pres1";
  db.prescriptions.push({
    id: presId,
    patientId: "p1",
    admissionId: "a1",
    prescriberUserId: db.users[0].id,
    status: "PENDING",
    createdAt: subHours(now, 2).toISOString(),
    updatedAt: subHours(now, 2).toISOString(),
    items: [{ id: "pi1", medicineId: "m1", medicineDisplay: "GenericMed1 500mg Tablet", dosage: "1 tab", frequency: "BD", duration: "5 days" }]
  });

  // 6. Organ Matches
  for (let oIdx = 1; oIdx <= 10; oIdx++) {
    db.organDonors.push({
      id: `od${oIdx}`,
      patientId: `p${oIdx}`,
      bloodGroup: bloodGroups[oIdx % 4],
      organType: "KIDNEY",
      status: "AVAILABLE",
      registeredAt: subDays(now, 2).toISOString(),
    });
    db.organRecipients.push({
      id: `or${oIdx}`,
      patientId: `p${oIdx + 10}`,
      bloodGroup: bloodGroups[oIdx % 4],
      organType: "KIDNEY",
      urgencyLabel: "High",
      status: "WAITING",
      registeredAt: subDays(now, 30).toISOString(),
    });
    db.organMatches.push({
      id: `om${oIdx}`,
      donorId: `od${oIdx}`,
      recipientId: `or${oIdx}`,
      organType: "KIDNEY",
      bloodGroupCompatible: true,
      hlaCompatibilityPercent: 90,
      urgencyScore: 80,
      distanceKm: 10,
      overallCompatibilityScore: 85,
      factors: {
        bloodGroup: { compatible: true, score: 100 },
        hla: { score: 90 },
        urgency: { score: 80 },
        distance: { distanceKm: 10, score: 90 },
        overallScore: 85
      },
      rank: 1,
      status: "PROPOSED",
      createdAt: nowIso
    });
    db.waitingList.push({
      id: `wl${oIdx}`,
      recipientId: `or${oIdx}`,
      organType: "KIDNEY",
      bloodGroup: bloodGroups[oIdx % 4],
      urgencyLabel: "High",
      waitingSince: subDays(now, 40).toISOString(),
      daysWaiting: 40,
      priorityRank: oIdx,
      status: "ACTIVE"
    });
    db.livingDonors.push({
      id: `ld${oIdx}`,
      anonymousReference: `LD-${oIdx}XXXXX`,
      bloodGroup: bloodGroups[oIdx % 4],
      organInterest: "KIDNEY",
      screeningStatus: "PENDING",
      registeredAt: subDays(now, 10).toISOString()
    });
  }

  // 7. Organ Transit
  db.organTransits.push({
    id: "ot1",
    organType: "KIDNEY",
    donorId: "od1",
    recipientId: "or1",
    retrievedAt: subHours(now, 4).toISOString(),
    expiresAt: addHours(now, 8).toISOString(),
    originHospitalId: "h1",
    destinationHospitalId: "h1",
    status: "SAFE"
  });

  // 8. Billing, Claims, and Discharges
  db.bills.push({
    id: "bill_1",
    patientId: "p1",
    admissionId: "a1",
    status: "ISSUED",
    generatedAt: nowIso,
    items: [
      { id: "bi1", description: "General Ward", category: "ROOM", quantity: 3, unitPrice: { amount: "100", currency: "USD" }, totalPrice: { amount: "300", currency: "USD" } },
      { id: "bi2", description: "Paracetamol", category: "PHARMACY", quantity: 1, unitPrice: { amount: "50", currency: "USD" }, totalPrice: { amount: "50", currency: "USD" } },
      { id: "bi3", description: "Appendectomy", category: "SURGERY", quantity: 1, unitPrice: { amount: "1000", currency: "USD" }, totalPrice: { amount: "1000", currency: "USD" } },
      { id: "bi4", description: "Specialist Visit", category: "CONSULTATION", quantity: 1, unitPrice: { amount: "150", currency: "USD" }, totalPrice: { amount: "150", currency: "USD" } }
    ],
    subtotal: { amount: "1500", currency: "USD" },
    insuranceAdjustment: { amount: "1000", currency: "USD" },
    patientPayable: { amount: "500", currency: "USD" }
  });

  db.insuranceClaims.push({
    id: "claim_1",
    billId: "bill_1",
    patientId: "p1",
    providerName: "HealthPlus",
    claimNumber: "CLM-12345",
    status: "PENDING",
    submittedAt: nowIso,
    updatedAt: nowIso
  });

  db.dischargeSummaries.push({
    id: "ds_1",
    patientId: "p1",
    admissionId: "a1",
    generatedByUserId: db.users[0].id,
    generatedAt: nowIso,
    status: "FINALIZED",
    staySummary: "Recovered from fever after 3 days of stay.",
    labResults: "CBC normal. Blood culture negative.",
    medicationSchedule: "Paracetamol 500mg BD for 3 days."
  });

  db.dischargeSummaries.push({
    id: "ds_2",
    patientId: demoPatientId,
    admissionId: demoAdmissionId,
    generatedByUserId: db.users[0].id,
    generatedAt: nowIso,
    status: "FINALIZED",
    staySummary: "Emma was admitted for observation following mild symptoms. Recovered well.",
    labResults: "All blood panels within normal ranges.",
    medicationSchedule: "No post-discharge medication needed."
  });

  // 9. Notifications
  db.notifications.push({
    id: "n1",
    userId: db.users[0].id,
    type: "SOS",
    title: "Urgent Blood Needed",
    message: "O+ RBC needed at CareGrid Hospital",
    read: false,
    createdAt: nowIso
  });
  
  db.notifications.push({
    id: "n2",
    userId: db.users[5].id, // PATIENT demo user
    type: "PATIENT_UPDATE",
    title: "New Care Update",
    message: "A new update has been posted by your care team.",
    read: false,
    createdAt: nowIso,
    targetPath: "/my-care/updates"
  });

  db.notifications.push({
    id: "n3",
    userId: db.users[6].id, // FAMILY demo user
    type: "PATIENT_UPDATE",
    title: "New Care Update",
    message: "A new update has been posted for Emma Thompson.",
    read: false,
    createdAt: nowIso,
    targetPath: "/family-care/updates"
  });

  return db;
}
