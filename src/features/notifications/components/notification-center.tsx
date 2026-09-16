/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../hooks/use-notifications";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Bell, Check, CircleAlert, CircleCheck, Info, MessageSquare, Pill, FileText, Droplets, Clock } from "lucide-react";
import type { NotificationType } from "@/contracts/notification";

function getIconForType(type: NotificationType) {
  switch (type) {
    case "PATIENT_UPDATE":
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case "BLOOD_LOW_STOCK":
    case "BLOOD_EXPIRY":
    case "SOS":
      return <Droplets className="h-5 w-5 text-red-500" />;
    case "ORGAN_TIMER":
      return <Clock className="h-5 w-5 text-orange-500" />;
    case "PRESCRIPTION":
      return <Pill className="h-5 w-5 text-purple-500" />;
    case "CLAIM":
    case "DISCHARGE":
      return <FileText className="h-5 w-5 text-emerald-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
}

export function NotificationCenter() {
  const router = useRouter();
  const { data: response, isLoading, isError, error, refetch } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Notifications" />
        <LoadingState label="Loading notifications..." />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Notifications" />
        <ErrorState title="Error" description={error?.message || "An unexpected error occurred."}
          action={<button onClick={() => refetch()} className="text-sm underline text-red-800">Retry</button>}
        />
      </PageContainer>
    );
  }

  const notifications = (response as any)?.data?.items ?? [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 && "s"}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications right now"
          description="You're all caught up! New alerts will appear here."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border flex gap-4 transition-colors ${
                notification.read ? "bg-card" : "bg-muted/30 border-primary/20"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                {getIconForType(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                  <h3 className={`text-base font-semibold ${!notification.read && "text-foreground"}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3">
                  {notification.targetPath && (
                    <button
                      onClick={() => {
                        if (!notification.read) {
                          markRead(notification.id);
                        }
                        
                        // Safe Internal Navigation Validation
                        const target = notification.targetPath as string;
                        if (target && target.startsWith("/") && !target.startsWith("//")) {
                          router.push(target);
                        }
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View details
                    </button>
                  )}
                  {!notification.read && (
                    <button
                      onClick={() => markRead(notification.id)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              {!notification.read && (
                <div className="flex-shrink-0 flex items-start">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2" aria-label="Unread" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
