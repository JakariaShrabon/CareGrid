import { Suspense } from "react";
import { DonorSuccessPage } from "@/features/organ/components/donor-registration/success-page";

export default function Page() {
  return (
    <Suspense>
      <DonorSuccessPage />
    </Suspense>
  );
}
