"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center luxury-card p-8 md:p-10 space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          An unexpected error occurred. This is usually temporary — try
          refreshing the page.
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
            Try again
          </Button>
          <Button
            variant="outline"
            className="border-gold-200"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
