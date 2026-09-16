import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { Notification } from "@/contracts/notification";

export const getNotifications = () => {
  return apiClient.get<PaginatedResponse<Notification>>(`/notifications`);
};

export const markNotificationRead = (id: string) => {
  return apiClient.patch<Record<string, never>, Notification>(`/notifications/${id}/read`, {});
};

export const markAllNotificationsRead = () => {
  return apiClient.post<Record<string, never>, { success: true }>(`/notifications/mark-all-read`, {});
};
