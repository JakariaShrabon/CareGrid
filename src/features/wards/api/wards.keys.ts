export const wardKeys = {
  all: ["wards"] as const,
  lists: () => [...wardKeys.all, "list"] as const,
  details: () => [...wardKeys.all, "detail"] as const,
  detail: (id: string) => [...wardKeys.details(), id] as const,
  beds: (id: string) => [...wardKeys.detail(id), "beds"] as const,
};
