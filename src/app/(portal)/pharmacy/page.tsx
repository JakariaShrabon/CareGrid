"use client";

import Link from "next/link";
import { Pill, FileText, Package } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";
import { PharmacyOverviewCards } from "@/features/pharmacy/components/pharmacy-overview-cards";

export default function PharmacyOverviewPage() {
  const { session } = useAuth();
  const user = session?.user;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Pharmacy Operations"
          description="Overview of prescriptions, dispensing queue, and medication inventory."
          eyebrow="Pharmacy"
        />

        <PharmacyOverviewCards />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/pharmacy/prescriptions"
            className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-card-foreground">Prescription Queue</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage active prescriptions.
            </p>
          </Link>

          {user && hasPermission(user.role, "prescription.create") && (
            <Link
              href="/pharmacy/prescriptions/new"
              className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-card-foreground">Create Prescription</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Write a new digital prescription for a patient.
              </p>
            </Link>
          )}

          {user && hasPermission(user.role, "pharmacy.inventory.read") && (
            <Link
              href="/pharmacy/inventory"
              className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-card-foreground">Pharmacy Inventory</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Check medication stock and low-stock alerts.
              </p>
            </Link>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
