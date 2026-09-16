import { http, HttpResponse } from "msw";
import { getApiEnvironment } from "@/lib/api/environment";
import { getMockDatabase } from "@/mocks/database/store";
import { mockSessionAdapter } from "@/lib/api/mock-session";

const apiBaseUrl = getApiEnvironment().baseUrl;

export const notificationHandlers = [
  http.get(`${apiBaseUrl}/notifications`, () => {
    const db = getMockDatabase();
    const session = mockSessionAdapter.getSession();
    const userId = session?.user?.id;
    if (!userId) return HttpResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized", status: 401 } }, { status: 401 });
    
    const items = db.notifications.filter(n => n.userId === userId);
    return HttpResponse.json({
      data: {
        items,
        page: 1,
        pageSize: items.length,
        totalItems: items.length,
        totalPages: 1
      }
    });
  }),

  http.patch(`${apiBaseUrl}/notifications/:id/read`, ({ params }) => {
    const db = getMockDatabase();
    const session = mockSessionAdapter.getSession();
    const notification = db.notifications.find(n => n.id === params.id && n.userId === session?.user?.id);
    if (!notification) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Notification not found", status: 404 } }, { status: 404 });
    
    notification.read = true;
    return HttpResponse.json({ data: notification });
  }),

  http.post(`${apiBaseUrl}/notifications/mark-all-read`, () => {
    const db = getMockDatabase();
    const session = mockSessionAdapter.getSession();
    db.notifications.filter(n => n.userId === session?.user?.id).forEach(n => { n.read = true; });
    return HttpResponse.json({ data: { success: true } });
  }),
];
