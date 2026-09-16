export const organKeys = {
  all: ["organ"] as const,
  overview: () => [...organKeys.all, "overview"] as const,
  matches: () => [...organKeys.all, "matches"] as const,
  match: (id: string) => [...organKeys.matches(), id] as const,
  waitingList: () => [...organKeys.all, "waiting-list"] as const,
  transit: () => [...organKeys.all, "transit"] as const,
  livingDonors: () => [...organKeys.all, "living-donors"] as const,
};
