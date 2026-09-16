"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { AuthSession } from "@/contracts/auth";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getPostRegistrationPath(session: AuthSession) {
  if (session.user.role === "PATIENT") {
    return "/my-care";
  }

  if (session.user.role === "FAMILY_ATTENDANT") {
    return "/family-care";
  }

  return "/dashboard";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, session, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && session) {
      router.replace(getPostRegistrationPath(session));
    }
  }, [isAuthenticated, isLoading, router, session]);

  function handleRegistered(newSession: AuthSession) {
    router.push(getPostRegistrationPath(newSession));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-3">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 text-sm font-semibold tracking-[0.18em] text-slate-950 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-teal-200 bg-teal-50 text-sm font-bold tracking-normal text-primary shadow-sm"
            >
              C
            </span>
            CAREGRID.IO
          </Link>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Create your CareGrid account
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              For patients and family attendants accessing CareGrid services.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm onRegistered={handleRegistered} registerAccount={register} />

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">Already have an account?</p>
            <Button variant="outline" asChild className="mt-3 h-10 bg-white">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
