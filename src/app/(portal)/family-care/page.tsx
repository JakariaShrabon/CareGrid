"use client";

import React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/auth-provider";
import { ReadOnlyPortalTabs } from "@/features/patients/components/read-only-portal/portal-tabs";
import { usePatient, usePatientAdmission } from "@/features/patients/hooks/use-patients";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, CalendarDays, FileText, HeartPulse, LockKeyhole, MessageSquareText, UserRound } from "lucide-react";
import { unwrapReadOnlyData } from "@/features/patients/utils/read-only-data";
import type { Patient, PatientAdmission } from "@/contracts/patient";

function formatAdmissionStatus(status?: string) {
  if (status === "ADMITTED") return "Currently admitted";
  if (status === "DISCHARGED") return "Discharged";
  if (status === "TRANSFERRED") return "Transferred";
  return "No current admission";
}

function formatDate(date?: string) {
  if (!date) return "Not available";
  return new Date(date).toLocaleDateString();
}

export default function FamilyCarePage() {
  const { session } = useAuth();
  const user = session?.user;
  
  const patientId = user?.patientId; // This links the family account to the patient
  const { data: patientResponse, isLoading: loadingPatient, error: errorPatient } = usePatient(patientId || "");
  const { data: admissionResponse, isLoading: loadingAdmission } = usePatientAdmission(patientId || "");

  if (!patientId) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Family portal"
          title="Family Care Dashboard"
          description="Read-only access for family attendants is enabled after the hospital links your account to a patient profile."
        />
        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-white to-amber-50/60 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <LockKeyhole className="h-5 w-5" aria-hidden />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">No linked patient profile</h2>
              <p className="max-w-2xl text-sm leading-6 text-amber-900">
                Your account is not linked to a patient profile. The hospital team
                controls patient linking and family access.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (loadingPatient || loadingAdmission) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Family portal"
          title="Family Care Dashboard"
          description="Loading the linked patient context for this family account."
        />
        <ReadOnlyPortalTabs basePath="/family-care" />
        <LoadingState label="Loading care context..." />
      </PageContainer>
    );
  }

  const patient = unwrapReadOnlyData<Patient>(patientResponse as Patient | { data?: Patient } | undefined);
  const admission = unwrapReadOnlyData<PatientAdmission>(
    admissionResponse as PatientAdmission | { data?: PatientAdmission } | undefined,
  );

  if (errorPatient || !patient) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Family portal"
          title="Family Care Dashboard"
          description="We could not load the linked patient context for this account."
        />
        <ReadOnlyPortalTabs basePath="/family-care" />
        <ErrorState title="Error" description="Could not load care context." />
      </PageContainer>
    );
  }

  const statusLabel = formatAdmissionStatus(admission?.status);

  const quickLinks = [
    {
      title: "Overview",
      description: "Review the linked care context and current admission status.",
      href: "/family-care",
      Icon: Activity,
    },
    {
      title: "Updates",
      description: "Read family-visible updates shared by the care team.",
      href: "/family-care/updates",
      Icon: MessageSquareText,
    },
    {
      title: "Discharge",
      description: "View available discharge information and documents.",
      href: "/family-care/discharge",
      Icon: FileText,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Family portal"
        title="Family Care Dashboard"
        description="A read-only view of the linked patient's shared care context for family attendants."
        actions={
          <Button asChild variant="outline">
            <Link href="/family-care/updates">
              View Updates
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        }
      />
      
      <ReadOnlyPortalTabs basePath="/family-care" />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="overflow-hidden rounded-lg border border-cyan-100 bg-gradient-to-br from-white via-white to-cyan-50/70 shadow-sm">
          <div className="border-b border-cyan-100/80 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-800 text-white shadow-sm shadow-cyan-800/20">
                  <UserRound className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Linked patient
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-950">{patient.displayName}</h2>
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-white px-3 py-1 text-sm font-semibold text-cyan-800">
                Family access is read-only
              </span>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <HeartPulse className="h-4 w-4" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">Admission status</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{statusLabel}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
                <CalendarDays className="h-4 w-4" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">Admission date</p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {formatDate(admission?.admittedAt)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                <LockKeyhole className="h-4 w-4" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">Access mode</p>
              <p className="mt-1 text-base font-semibold text-slate-950">Read-only</p>
            </div>
          </div>

          <div className="border-t border-cyan-100/80 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-6">
            Family attendants can view hospital-shared information here. Care
            records and relationship links remain managed by hospital staff.
          </div>
        </section>

        <section className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Family Care sections</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Move between the read-only overview, updates, and discharge information.
          </p>
          <div className="mt-4 grid gap-3">
            {quickLinks.map(({ title, description, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-lg border border-slate-200 bg-slate-50/70 p-4 transition hover:border-cyan-200 hover:bg-cyan-50/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-cyan-700 shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
