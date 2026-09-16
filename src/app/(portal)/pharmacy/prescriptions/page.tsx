"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";
import { PrescriptionQueueTable } from "@/features/pharmacy/components/prescription-queue-table";

export default function PrescriptionQueuePage() {
  const { session } = useAuth();
  const user = session?.user;
  const canCreate = user && hasPermission(user.role, "prescription.create");

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Prescription Queue"
          description="Manage active prescriptions across the hospital."
          eyebrow="Pharmacy"
          actions={
            canCreate ? (
              <Link
                href="/pharmacy/prescriptions/new"
                className="inline-flex h-9 items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-sky-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Prescription
              </Link>
            ) : undefined
          }
        />
        <PrescriptionQueueTable />
      </div>
    </PageContainer>
  );
}
