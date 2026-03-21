"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function ShimmerButton(
  { className, children, ...props },
  ref
) {
  return (
    <span className="relative inline-flex w-full overflow-hidden rounded-2xl align-top">
      <Button
        ref={ref}
        {...props}
        className={cn(
          "relative z-10 w-full border-0 bg-gradient-to-r from-gold-800 via-gold-500 to-amber-600 text-white shadow-lg shadow-gold-600/25 hover:brightness-[1.05] hover:shadow-gold-500/30",
          className
        )}
      >
        {children}
      </Button>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[12] -translate-x-full skew-x-[-12deg] animate-btn-shine bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    </span>
  );
});
ShimmerButton.displayName = "ShimmerButton";
