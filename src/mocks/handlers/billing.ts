import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const billingHandlers = [
  http.get(`${apiBaseUrl}/bills`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.bills,
        page: 1,
        pageSize: db.bills.length,
        totalItems: db.bills.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/bills/:id`, ({ params }) => {
    const db = getMockDatabase();
    const bill = db.bills.find(b => b.id === params.id);
    if (!bill) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Bill not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: bill });
  }),

  http.get(`${apiBaseUrl}/insurance/claims`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.insuranceClaims,
        page: 1,
        pageSize: db.insuranceClaims.length,
        totalItems: db.insuranceClaims.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/insurance/claims/:id`, ({ params }) => {
    const db = getMockDatabase();
    const claim = db.insuranceClaims.find(c => c.id === params.id);
    if (!claim) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Claim not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: claim });
  }),

  http.patch(`${apiBaseUrl}/insurance/claims/:id`, async ({ params, request }) => {
    const db = getMockDatabase();
    const claim = db.insuranceClaims.find(c => c.id === params.id);
    if (!claim) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Claim not found", status: 404 } }, { status: 404 });
    
    const body = await request.json() as Record<string, unknown>;
    Object.assign(claim, body);
    claim.updatedAt = new Date().toISOString();
    return HttpResponse.json({ data: claim });
  }),

  http.get(`${apiBaseUrl}/discharges`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.dischargeSummaries,
        page: 1,
        pageSize: db.dischargeSummaries.length,
        totalItems: db.dischargeSummaries.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/discharges/:patientId`, ({ params }) => {
    const db = getMockDatabase();
    const summaries = db.dischargeSummaries.filter(d => d.patientId === params.patientId);
    return HttpResponse.json({ data: summaries });
  }),

  http.get(`${apiBaseUrl}/discharges/:patientId/pdf`, async () => {
    // Return a mock PDF blob
    const mockPdfContent = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 194, 165, 194, 177, 195, 170, 10]); // Mock `%PDF-1.4...`
    return new HttpResponse(mockPdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"discharge-summary.pdf\"",
      },
    });
  }),
];
