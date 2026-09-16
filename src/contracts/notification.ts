import type { EntityId, ISODateTimeString } from "./common";

export type NotificationType =
  | "PATIENT_UPDATE"
  | "BLOOD_LOW_STOCK"
  | "BLOOD_EXPIRY"
  | "SOS"
  | "ORGAN_TIMER"
  | "PRESCRIPTION"
  | "CLAIM"
  | "DISCHARGE";

export type Notification = {
  id: EntityId;
  userId: EntityId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: ISODateTimeString;
  targetPath?: string;
};

// Kept for backward compatibility with phase 0 components if any still exist
export type NotificationChannel = "SMS" | "EMAIL" | "IN_APP";

export type NotificationEvent = {
  id: EntityId;
  channel: NotificationChannel;
  subject: string;
  body: string;
  recipientUserId?: EntityId;
  sentAt?: ISODateTimeString;
};
