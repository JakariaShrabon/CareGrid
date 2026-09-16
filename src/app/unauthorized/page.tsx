import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-950">Access unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your current CareGrid role does not include this workspace. Return to an available area or contact the hospital system owner.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
