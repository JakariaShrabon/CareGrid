export const bloodBankKeys = {
  all: ["blood-bank"] as const,
  overview: () => [...bloodBankKeys.all, "overview"] as const,
  inventory: () => [...bloodBankKeys.all, "inventory"] as const,
  units: () => [...bloodBankKeys.all, "units"] as const,
  donors: () => [...bloodBankKeys.all, "donors"] as const,
  donor: (id: string) => [...bloodBankKeys.donors(), id] as const,
  sos: () => [...bloodBankKeys.all, "sos"] as const,
};
