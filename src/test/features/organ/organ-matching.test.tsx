import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrganOverviewCards } from "@/features/organ/components/organ-overview-cards";
import { OrganMatchList } from "@/features/organ/components/organ-match-list";
import { MatchFactorBreakdown } from "@/features/organ/components/match-factor-breakdown";
import { WaitingListTable } from "@/features/organ/components/waiting-list-table";
import { IschemiaCountdown } from "@/features/organ/components/ischemia-countdown";
import { LivingDonorTable } from "@/features/organ/components/living-donor-table";
import { organHandlers } from "@/mocks/handlers/organ";
import { setupServer } from "msw/node";
import { resetMockDatabase } from "@/mocks/database/store";

// Fix for Next.js Link component in tests
vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const server = setupServer(...organHandlers);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

function wrap(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
beforeEach(() => {
  resetMockDatabase();
  queryClient.clear();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("Organ matching and operations", () => {
  describe("OrganOverviewCards", () => {
    it("renders loading state", () => {
      wrap(<OrganOverviewCards />);
      expect(screen.getByRole("generic", { busy: true })).toBeInTheDocument();
    });

    it("renders metrics from API", async () => {
      wrap(<OrganOverviewCards />);
      
      // Wait for data to load
      expect(await screen.findByText("Active Matches")).toBeInTheDocument();
      expect(screen.getByText("Waiting List")).toBeInTheDocument();
      expect(screen.getByText("Living Donors")).toBeInTheDocument();
      expect(screen.getByText("Organs In Transit")).toBeInTheDocument();
    });
  });

  describe("OrganMatchList", () => {
    it("renders table with match data", async () => {
      wrap(<OrganMatchList />);
      
      // wait for table to load
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Rank")).toBeInTheDocument();
      
      // Look for the "Compatibility" column header
      const headers = screen.getAllByRole("columnheader");
      expect(headers.map(h => h.textContent)).toContain("Compatibility");
    });
  });

  describe("MatchFactorBreakdown", () => {
    it("renders the four clinical factors and overall score", () => {
      const factors = {
        bloodGroup: { compatible: true, score: 100 },
        hla: { score: 85 },
        urgency: { score: 90 },
        distance: { distanceKm: 45, score: 95 },
        overallScore: 92,
      };

      render(<MatchFactorBreakdown factors={factors} />);
      
      expect(screen.getByText("Blood Group")).toBeInTheDocument();
      expect(screen.getByText("Compatible")).toBeInTheDocument();
      expect(screen.getByText("HLA Compatibility")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("Clinical Urgency")).toBeInTheDocument();
      expect(screen.getByText("90")).toBeInTheDocument();
      expect(screen.getByText("Logistics & Distance")).toBeInTheDocument();
      expect(screen.getByText("45")).toBeInTheDocument();
      expect(screen.getByText("Overall Compatibility Score")).toBeInTheDocument();
      expect(screen.getByText("92")).toBeInTheDocument();
    });
  });

  describe("WaitingListTable", () => {
    it("renders patients with priority rank", async () => {
      wrap(<WaitingListTable />);
      
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Clinical Urgency")).toBeInTheDocument();
      expect(screen.getByText("Time Waiting")).toBeInTheDocument();
    });
  });

  describe("IschemiaCountdown", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Set current time to a known point
      vi.setSystemTime(new Date("2026-09-12T10:00:00Z"));
    });
    
    afterEach(() => {
      vi.useRealTimers();
    });

    it("displays API-provided SAFE status when time remains", () => {
      // 4 hours away
      const expiresAt = new Date("2026-09-12T14:00:00Z").toISOString();
      render(<IschemiaCountdown expiresAt={expiresAt} initialStatus="SAFE" />);
      
      expect(screen.getByText("Preservation Safe")).toBeInTheDocument();
      expect(screen.getByText("04:00:00")).toBeInTheDocument();
    });

    it("displays API-provided WARNING status when time remains", () => {
      // 2 hours away
      const expiresAt = new Date("2026-09-12T12:00:00Z").toISOString();
      render(<IschemiaCountdown expiresAt={expiresAt} initialStatus="WARNING" />);
      
      expect(screen.getByText("Window Approaching")).toBeInTheDocument();
      expect(screen.getByText("02:00:00")).toBeInTheDocument();
    });

    it("displays API-provided CRITICAL status when time remains", () => {
      // 30 mins away
      const expiresAt = new Date("2026-09-12T10:30:00Z").toISOString();
      render(<IschemiaCountdown expiresAt={expiresAt} initialStatus="CRITICAL" />);
      
      expect(screen.getByText("Critical Window")).toBeInTheDocument();
      expect(screen.getByText("00:30:00")).toBeInTheDocument();
    });

    it("displays EXPIRED when time is past", () => {
      const expiresAt = new Date("2026-09-12T09:00:00Z").toISOString();
      render(<IschemiaCountdown expiresAt={expiresAt} initialStatus="EXPIRED" />);
      
      expect(screen.getByText("Expired")).toBeInTheDocument();
      expect(screen.getByText("00:00:00")).toBeInTheDocument();
    });
    
    it("updates timer when time passes and transitions to EXPIRED overriding API status", () => {
      const expiresAt = new Date("2026-09-12T10:00:01Z").toISOString();
      render(<IschemiaCountdown expiresAt={expiresAt} initialStatus="SAFE" />);
      
      expect(screen.getByText("Preservation Safe")).toBeInTheDocument();
      expect(screen.getByText("00:00:01")).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(1000); // advance 1s
      });
      
      expect(screen.getByText("Expired")).toBeInTheDocument();
      expect(screen.getByText("00:00:00")).toBeInTheDocument();
    });
  });

  describe("LivingDonorTable", () => {
    it("renders staff registry view with anonymous references", async () => {
      wrap(<LivingDonorTable />);
      
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Anonymous Reference")).toBeInTheDocument();
      expect(screen.getByText("Screening Status")).toBeInTheDocument();
    });
  });
});
