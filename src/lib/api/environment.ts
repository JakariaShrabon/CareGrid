export type ApiMode = "mock" | "remote";

export type ApiEnvironment = {
  mode: ApiMode;
  baseUrl: string;
};

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export function getApiEnvironment(): ApiEnvironment {
  const rawMode = process.env.NEXT_PUBLIC_API_MODE;

  return {
    mode: rawMode === "remote" ? "remote" : "mock",
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  };
}
