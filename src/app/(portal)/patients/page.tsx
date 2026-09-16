import { PatientList } from "@/features/patients/components/patient-list";
import { PageContainer, PageHeader } from "@/components/layout/page-container";

export const metadata = {
  title: "Patients | CareGrid",
  description: "Clinical patient list and admissions overview",
};

export default function PatientsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Patients"
        description="Active admissions, clinical status, and patient records."
      />
      <PatientList />
    </PageContainer>
  );
}
