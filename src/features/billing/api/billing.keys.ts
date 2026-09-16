export const billingKeys = {
  all: ["billing"] as const,
  bills: () => [...billingKeys.all, "bills"] as const,
  bill: (id: string) => [...billingKeys.bills(), id] as const,
  claims: () => [...billingKeys.all, "claims"] as const,
  claim: (id: string) => [...billingKeys.claims(), id] as const,
  discharges: () => [...billingKeys.all, "discharges"] as const,
};
