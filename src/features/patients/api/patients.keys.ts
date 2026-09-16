export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...patientKeys.lists(), filters] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  vitals: (id: string) => [...patientKeys.detail(id), "vitals"] as const,
  updates: (id: string) => [...patientKeys.detail(id), "updates"] as const,
  labResults: (id: string) => [...patientKeys.detail(id), "labResults"] as const,
  admission: (id: string) => [...patientKeys.detail(id), "admission"] as const,
};
