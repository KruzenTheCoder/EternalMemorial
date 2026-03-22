"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="container mx-auto py-12 px-6 text-center">
      <div className="max-w-lg mx-auto luxury-card p-8 space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
          🔧
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Dashboard Error
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Something went wrong loading this section. This may be a temporary
          database issue.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 text-left overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button
            onClick={reset}
            className="bg-gold-600 hover:bg-gold-700 text-white"
          >
            Retry
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="border-gold-200 w-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
