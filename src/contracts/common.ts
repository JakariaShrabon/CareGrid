export type ISODateTimeString = string;
export type ISODateString = string;

export type EntityId = string;

export type Money = {
  amount: string;
  currency: string;
};

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type ApiResponse<T> = {
  data: T;
  meta: {
    requestId: string;
    timestamp?: ISODateTimeString;
  };
};

export type ApiError = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type StatusTone = "neutral" | "info" | "success" | "warning" | "critical";
