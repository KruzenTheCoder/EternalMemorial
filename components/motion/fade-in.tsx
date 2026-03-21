"use client";

import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("opacity-0 animate-fade-in-up", className)}
      style={{ animationDelay: `${delayMs}ms`, animationFillMode: "forwards" }}
    >
      {children}
    </div>
  );
}
