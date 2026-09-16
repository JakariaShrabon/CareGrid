export const pharmacyKeys = {
  all: ["pharmacy"] as const,
  prescriptions: () => [...pharmacyKeys.all, "prescriptions"] as const,
  prescription: (id: string) => [...pharmacyKeys.prescriptions(), id] as const,
  inventory: () => [...pharmacyKeys.all, "inventory"] as const,
  medicines: () => [...pharmacyKeys.all, "medicines"] as const,
};
