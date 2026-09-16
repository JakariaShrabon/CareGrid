import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const organHandlers = [
  http.get(`${apiBaseUrl}/organ/overview`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        activeMatches: db.organMatches.length,
        waitingListCount: db.waitingList.length,
        donorsAvailable: db.organDonors.filter(d => d.status === "AVAILABLE").length,
        organsInTransit: db.organTransits.filter(t => t.status !== "DELIVERED").length
      }
    });
  }),

  http.get(`${apiBaseUrl}/organ/matches`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.organMatches,
        page: 1,
        pageSize: db.organMatches.length,
        totalItems: db.organMatches.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/organ/matches/:id`, ({ params }) => {
    const db = getMockDatabase();
    const match = db.organMatches.find(m => m.id === params.id);
    if (!match) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Match not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: match });
  }),

  http.get(`${apiBaseUrl}/organ/waiting-list`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.waitingList,
        page: 1,
        pageSize: db.waitingList.length,
        totalItems: db.waitingList.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/organ/transit`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.organTransits,
        page: 1,
        pageSize: db.organTransits.length,
        totalItems: db.organTransits.length,
        totalPages: 1
      }
    });
  }),

  http.get(`${apiBaseUrl}/organ/living-donors`, () => {
    const db = getMockDatabase();
    return HttpResponse.json({
      data: {
        items: db.livingDonors,
        page: 1,
        pageSize: db.livingDonors.length,
        totalItems: db.livingDonors.length,
        totalPages: 1
      }
    });
  }),
  
  http.post(`${apiBaseUrl}/organ/living-donors/register`, async ({ request }) => {
    const db = getMockDatabase();
    const body = await request.json() as Record<string, unknown>;
    
    // Generate an anonymous reference
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const anonymousReference = `LD-${timestamp}-${random}`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRegistration: any = {
      id: `ld_${db.livingDonors.length + 1}`,
      anonymousReference,
      bloodGroup: body.bloodGroup as string,
      organInterest: body.organInterest as string,
      screeningStatus: "PENDING" as const,
      registeredAt: new Date().toISOString()
    };
    
    db.livingDonors.push(newRegistration);
    return HttpResponse.json({ data: newRegistration }, { status: 201 });
  }),
];
