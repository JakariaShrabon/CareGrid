import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";
import { mockSessionAdapter } from "@/lib/api/mock-session";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const patientHandlers = [
  http.get(`${apiBaseUrl}/patients`, ({ request }) => {
    const session = mockSessionAdapter.getSession();
    if (session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const db = getMockDatabase();

    const results = db.patients.filter(p => 
      !search || p.displayName.toLowerCase().includes(search) || p.patientNumber.toLowerCase().includes(search)
    );

    return HttpResponse.json({
      data: {
        items: results,
        page: 1,
        pageSize: results.length,
        totalItems: results.length,
        totalPages: 1
      },
      meta: { requestId: "req_" + Date.now() }
    });
  }),

  http.get(`${apiBaseUrl}/patients/:id`, ({ params }) => {
    const session = mockSessionAdapter.getSession();
    if ((session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") && session.user.patientId !== params.id) {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const db = getMockDatabase();
    const patient = db.patients.find(p => p.id === params.id);
    if (!patient) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Patient not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: patient });
  }),

  http.get(`${apiBaseUrl}/patients/:id/admission`, ({ params }) => {
    const session = mockSessionAdapter.getSession();
    if ((session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") && session.user.patientId !== params.id) {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const db = getMockDatabase();
    const admission = db.admissions.find(a => a.patientId === params.id && a.status === "ADMITTED");
    if (!admission) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Admission not found", status: 404 } }, { status: 404 });
    return HttpResponse.json({ data: admission });
  }),

  http.get(`${apiBaseUrl}/patients/:id/vitals`, ({ params }) => {
    const session = mockSessionAdapter.getSession();
    if ((session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") && session.user.patientId !== params.id) {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const db = getMockDatabase();
    const vitals = db.vitals.filter(v => v.patientId === params.id).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return HttpResponse.json({ data: vitals });
  }),

  http.post(`${apiBaseUrl}/patients/:id/vitals`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    const db = getMockDatabase();
    const vital = {
      id: `v_${Date.now()}`,
      patientId: params.id,
      temperatureCelsius: body.temperatureCelsius || 37.0,
      systolicBp: body.systolicBp || 120,
      diastolicBp: body.diastolicBp || 80,
      oxygenSaturationPercent: body.oxygenSaturationPercent || 98,
      recordedByUserId: body.recordedByUserId || "user1",
      ...body,
      recordedAt: new Date().toISOString(),
    } as unknown as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    db.vitals.push(vital);
    return HttpResponse.json({ data: vital });
  }),

  http.get(`${apiBaseUrl}/patients/:id/updates`, ({ params }) => {
    const session = mockSessionAdapter.getSession();
    if ((session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") && session.user.patientId !== params.id) {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const db = getMockDatabase();
    let updates = db.dailyUpdates.filter(u => u.patientId === params.id);
    if (session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") {
      updates = updates.filter(u => u.visibility === "FAMILY");
    }
    updates = updates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return HttpResponse.json({ data: updates });
  }),

  http.post(`${apiBaseUrl}/patients/:id/updates`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    const db = getMockDatabase();
    const update = {
      id: `update_${Date.now()}`,
      patientId: params.id,
      content: body.content || "",
      authorUserId: body.authorUserId || "user1",
      authorRole: body.authorRole || "NURSE",
      visibility: body.visibility || "INTERNAL",
      ...body,
      createdAt: new Date().toISOString(),
    } as unknown as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    db.dailyUpdates.push(update);
    return HttpResponse.json({ data: update });
  }),

  http.get(`${apiBaseUrl}/patients/:id/lab-results`, ({ params }) => {
    const session = mockSessionAdapter.getSession();
    if ((session?.user?.role === "PATIENT" || session?.user?.role === "FAMILY_ATTENDANT") && session.user.patientId !== params.id) {
      return HttpResponse.json({ error: { code: "FORBIDDEN", message: "Access denied", status: 403 } }, { status: 403 });
    }
    const db = getMockDatabase();
    const results = db.labResults.filter(r => r.patientId === params.id);
    return HttpResponse.json({ data: results });
  }),
];
