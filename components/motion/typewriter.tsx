"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Typewriter({
  phrases,
  className,
  typingMs = 48,
  deletingMs = 32,
  pauseMs = 2200,
}: {
  phrases: string[];
  className?: string;
  typingMs?: number;
  deletingMs?: number;
  pauseMs?: number;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = phrases.length ? phrases[phraseIndex % phrases.length] ?? "" : "";

  useEffect(() => {
    if (!phrases.length || !current) return;

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), typingMs);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), deletingMs);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }
  }, [charIndex, current, deleting, deletingMs, pauseMs, phraseIndex, phrases.length, typingMs]);

  if (!phrases.length) return null;

  return (
    <span className={cn("inline-block", className)}>
      <span>{current.slice(0, charIndex)}</span>
      <span className="inline-block w-0.5 h-[1em] ml-0.5 align-[-0.15em] bg-gold-500 animate-pulse" aria-hidden />
    </span>
  );
}
