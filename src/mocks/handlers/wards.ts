import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const wardHandlers = [
  http.get(`${apiBaseUrl}/wards`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.wards,
        page: 1,
        pageSize: db.wards.length,
        totalItems: db.wards.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/wards/:id`, ({ params }) => {
    const db = getMockDatabase();
    const ward = db.wards.find(w => w.id === params.id);
    if (!ward) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Ward not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: ward });
  }),

  http.get(`${apiBaseUrl}/wards/:id/beds`, ({ params }) => {
    const db = getMockDatabase();
    const beds = db.beds.filter(b => b.wardId === params.id);
    return HttpResponse.json({ data: beds });
  }),

  http.patch(`${apiBaseUrl}/beds/:id/status`, async ({ params, request }) => {
    const db = getMockDatabase();
    const bed = db.beds.find(b => b.id === params.id);
    if (!bed) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Bed not found", status: 404 } }, { status: 404 });
    
    const body = await request.json() as { status: "AVAILABLE" | "OCCUPIED" | "CLEANING" | "RESERVED" };
    bed.status = body.status;
    bed.updatedAt = new Date().toISOString();
    return HttpResponse.json({ data: bed });
  }),
];
