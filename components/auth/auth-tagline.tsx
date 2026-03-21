"use client";

import { Typewriter } from "@/components/motion/typewriter";
import { cn } from "@/lib/utils";

export function AuthTagline({ phrases, className }: { phrases: string[]; className?: string }) {
  return (
    <p className={cn("text-center text-gold-800/90 font-serif text-sm min-h-[1.5rem] mb-2", className)}>
      <Typewriter phrases={phrases} typingMs={42} deletingMs={28} pauseMs={2000} />
    </p>
  );
}
