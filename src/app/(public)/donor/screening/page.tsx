import { Suspense } from "react";
import { DonorScreeningForm } from "@/features/organ/components/donor-registration/screening-form";

export default function Page() {
  return (
    <Suspense>
      <DonorScreeningForm />
    </Suspense>
  );
}
