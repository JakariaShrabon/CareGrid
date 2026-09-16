import React from "react";
import Link from "next/link";
import { HeartPulse, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DonorLandingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <HeartPulse className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Living Donor Registration
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          CareGrid supports voluntary living-donor registration. Your information will be submitted for a preliminary screening review.
        </p>
      </div>

      <div className="bg-muted/50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Important Information
        </h2>
        <ul className="space-y-4 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Submitting this form <strong>does NOT</strong> mean you are clinically approved to donate. It is the first step in a thorough evaluation process.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Registration is completely anonymous. Your privacy is our priority. We only collect basic information needed for initial matching potential.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>You may withdraw your registration at any time without any questions asked.</span>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Button asChild size="default" className="h-14 px-8 text-lg font-medium shadow-md hover:shadow-lg transition-all">
          <Link href="/donor/register">
            Start Registration
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
