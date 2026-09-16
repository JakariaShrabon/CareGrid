import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const pharmacyHandlers = [
  http.get(`${apiBaseUrl}/medicines`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.medicines,
        page: 1,
        pageSize: db.medicines.length,
        totalItems: db.medicines.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/prescriptions`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.prescriptions,
        page: 1,
        pageSize: db.prescriptions.length,
        totalItems: db.prescriptions.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/prescriptions/:id`, ({ params }) => {
    const db = getMockDatabase();
    const rx = db.prescriptions.find(p => p.id === params.id);
    if (!rx) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Prescription not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: rx });
  }),

  http.post(`${apiBaseUrl}/prescriptions`, async ({ request }) => {
    const db = getMockDatabase();
    const body = await request.json() as Record<string, unknown>;
    const rx = {
      id: `rx_${Date.now()}`,
      patientId: body.patientId || "p1",
      admissionId: body.admissionId || "a1",
      prescriberUserId: body.prescriberUserId || "user1",
      items: body.items || [],
      ...body,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    db.prescriptions.push(rx);
    return HttpResponse.json({ data: rx });
  }),

  http.post(`${apiBaseUrl}/prescriptions/check-safety`, async ({ request }) => {
    const body = await request.json() as { medicineIds: string[] };
    const hasPenicillin = body.medicineIds.some(id => id.includes("penicillin")); // dummy logic
    
    return HttpResponse.json({
      data: {
        status: hasPenicillin ? "ALLERGY_WARNING" : "SAFE",
        warnings: hasPenicillin ? [{ code: "ALG01", severity: "HIGH", message: "Patient allergic to penicillin", medicineIds: body.medicineIds }] : []
      }
    });
  }),

  http.get(`${apiBaseUrl}/pharmacy/inventory`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.pharmacyInventory,
        page: 1,
        pageSize: db.pharmacyInventory.length,
        totalItems: db.pharmacyInventory.length,
        totalPages: 1
      }
    });
  }),

  http.post(`${apiBaseUrl}/pharmacy/dispense`, async ({ request }) => {
    const db = getMockDatabase();
    const body = await request.json() as { prescriptionId: string, dispensedByUserId: string };
    
    const rx = db.prescriptions.find(p => p.id === body.prescriptionId);
    if (rx) rx.status = "DISPENSED";

    const dispenseRecord = {
      id: `disp_${Date.now()}`,
      prescriptionId: body.prescriptionId,
      patientId: rx ? rx.patientId : "p_unknown",
      dispensedByUserId: body.dispensedByUserId,
      dispensedAt: new Date().toISOString(),
      items: rx ? rx.items.map(item => ({ medicineId: item.medicineId, quantity: 1 })) : []
    };
    db.dispenseRecords.push(dispenseRecord);
    return HttpResponse.json({ data: dispenseRecord });
  }),
];
