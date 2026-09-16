import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const bloodHandlers = [
  http.get(`${apiBaseUrl}/blood/overview`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        totalUnits: db.bloodUnits.length,
        availableUnits: db.bloodUnits.filter(u => u.status === "AVAILABLE").length,
        activeSos: db.bloodSos.filter(s => s.status === "ACTIVE").length,
        donors: db.bloodDonors.length
      }
    });
  }),

  http.get(`${apiBaseUrl}/blood/inventory`, () => {
    const summary = [
      { bloodGroup: "O+", component: "WHOLE_BLOOD", availableUnits: 50, reservedUnits: 10, expiringSoonUnits: 2, safeThreshold: 20, status: "SAFE" }
    ];
    return HttpResponse.json({ data: summary });
  }),

  http.get(`${apiBaseUrl}/blood/units`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.bloodUnits,
        page: 1,
        pageSize: db.bloodUnits.length,
        totalItems: db.bloodUnits.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/blood/donors`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.bloodDonors,
        page: 1,
        pageSize: db.bloodDonors.length,
        totalItems: db.bloodDonors.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/blood/donors/:id`, ({ params }) => {
    const db = getMockDatabase();
    const donor = db.bloodDonors.find(d => d.id === params.id);
    if (!donor) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Donor not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: donor });
  }),

  http.get(`${apiBaseUrl}/blood/sos`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.bloodSos,
        page: 1,
        pageSize: db.bloodSos.length,
        totalItems: db.bloodSos.length,
        totalPages: 1
      }
    });
  }),

  http.post(`${apiBaseUrl}/blood/sos`, async ({ request }) => {
    const db = getMockDatabase();
    const body = await request.json() as Record<string, unknown>;
    const sos = {
      id: `sos_${Date.now()}`,
      hospitalId: body.hospitalId || "h1",
      bloodGroup: body.bloodGroup || "O+",
      component: body.component || "WHOLE_BLOOD",
      requiredUnits: body.requiredUnits || 1,
      severity: body.severity || "HIGH",
      ...body,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      matchedEligibleDonorCount: 0,
    } as unknown as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    db.bloodSos.push(sos);
    return HttpResponse.json({ data: sos });
  }),
];
