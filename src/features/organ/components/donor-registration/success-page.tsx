"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DonorSuccessPage() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");

  if (!refId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="mb-4">No reference found. Please start over.</p>
        <Button asChild><Link href="/donor">Go Back</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
        Registration Received
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        Thank you for taking this profound first step. Your preliminary registration has been recorded successfully.
      </p>

      <div className="bg-card border rounded-2xl p-8 mb-8 max-w-md mx-auto shadow-sm">
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
          Your Anonymous Reference ID
        </p>
        <div className="text-3xl font-mono font-bold text-primary tracking-widest bg-muted/50 p-4 rounded-lg inline-block">
          {refId}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Please save this reference ID. It will be used to identify your registration without exposing personal information.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
        <p className="text-sm text-muted-foreground">
          Your registration will be reviewed by our transplant coordination team. Note that this submission does not represent final medical approval. A clinical team member will reach out if there is a potential matching need.
        </p>
      </div>

      <Button asChild size="default" variant="outline">
        <Link href="/login">
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
