import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { useOrganMatches } from "@/features/organ/hooks/use-organ";
import { useBloodInventory } from "@/features/blood-bank/hooks/use-blood-bank";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe("API Hooks", () => {
  it("usePatients fetches patients successfully", async () => {
    const { result } = renderHook(() => usePatients(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toBeDefined();
  });

  it("useOrganMatches fetches organ matches successfully", async () => {
    const { result } = renderHook(() => useOrganMatches(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toBeDefined();
  });

  it("useBloodInventory fetches blood inventory successfully", async () => {
    const { result } = renderHook(() => useBloodInventory(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
