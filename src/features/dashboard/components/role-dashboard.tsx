"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { DoctorDashboard } from "./roles/doctor-dashboard";
import { NurseDashboard } from "./roles/nurse-dashboard";
import { BloodBankDashboard } from "./roles/blood-bank-dashboard";
import { PharmacistDashboard } from "./roles/pharmacist-dashboard";
import { BillingDashboard } from "./roles/billing-dashboard";
import { PatientDashboard } from "./roles/patient-dashboard";
import { FamilyDashboard } from "./roles/family-dashboard";
import { PageHeader } from "@/components/layout/page-container";

export function RoleDashboard() {
  const { session } = useAuth();
  const role = session?.user.role;

  if (!role) {
    return null;
  }

  let DashboardComponent = null;

  switch (role) {
    case "DOCTOR":
      DashboardComponent = <DoctorDashboard />;
      break;
    case "NURSE":
      DashboardComponent = <NurseDashboard />;
      break;
    case "BLOOD_BANK_COORDINATOR":
      DashboardComponent = <BloodBankDashboard />;
      break;
    case "PHARMACIST":
      DashboardComponent = <PharmacistDashboard />;
      break;
    case "BILLING_OFFICER":
      DashboardComponent = <BillingDashboard />;
      break;
    case "PATIENT":
      DashboardComponent = <PatientDashboard />;
      break;
    case "FAMILY_ATTENDANT":
      DashboardComponent = <FamilyDashboard />;
      break;
    default:
      DashboardComponent = <div>Unknown Role</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${role.replace(/_/g, " ")} VIEW`}
        title="Dashboard"
        description="Your tailored daily overview and quick actions."
      />
      {DashboardComponent}
    </div>
  );
}
