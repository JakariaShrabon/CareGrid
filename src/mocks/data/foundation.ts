import type { PatientSummary } from "@/contracts/patient";
import type { NotificationEvent } from "@/contracts/notification";
import type { Ward } from "@/contracts/ward";

export const foundationMockData: {
  meta: { requestId: string; timestamp: string };
  patients: PatientSummary[];
  wards: Ward[];
  notifications: NotificationEvent[];
} = {
  meta: {
    requestId: "mock_req_foundation",
    timestamp: "2026-09-12T00:00:00.000Z",
  },
  patients: [
    {
      id: "patient_001",
      hospitalNumber: "CG-2026-0001",
      fullName: "Amina Chowdhury",
      wardId: "ward_icu",
      bedId: "bed_icu_01",
      primaryDoctorId: "user_doctor_001",
      latestUpdateAt: "2026-09-12T08:00:00.000Z",
    },
  ],
  wards: [
    {
      id: "ward_icu",
      hospitalId: "h1",
      name: "ICU",
      code: "ICU",
      floor: "4",
    },
  ],
  notifications: [
    {
      id: "notification_001",
      channel: "IN_APP",
      subject: "Foundation mock event",
      body: "Mock API is available for frontend integration.",
      sentAt: "2026-09-12T08:10:00.000Z",
    },
  ],
};
