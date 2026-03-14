import React from "react";

export function DoveLoader({ label = "Preparing memorial..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-2xl bg-gold-200/40 dove-glow" />
        <svg
          className="relative h-20 w-20 text-gold-700 dove-float"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className="dove-wing"
            d="M39 10c-6 2-10 7-11 14-1 6 1 10 5 14-5 1-10-2-12-8-2-7 1-18 9-24 4-3 9-3 9 4z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M28 30c7-2 15-1 22 6 3 3 4 7 1 9-5 4-16 6-28 2-5-2-7-4-9-7 3 2 8 2 12-2 1-2 1-5 2-8z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M16 42c3 8 12 14 22 14 10 0 18-5 22-13-4 5-13 9-22 9-9 0-17-3-22-10z"
            fill="currentColor"
            opacity="0.35"
          />
          <circle cx="44" cy="34" r="1" fill="#0f172a" opacity="0.6" />
        </svg>
      </div>
      <div className="mt-6 space-y-2">
        <p className="font-display text-xl text-foreground">{label}</p>
        <div className="flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-[0.35em] text-gold-700/70">
          <span className="dove-dot" />
          <span className="dove-dot" />
          <span className="dove-dot" />
        </div>
      </div>
    </div>
  );
}

