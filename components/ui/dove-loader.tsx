import React from "react";

/**
 * Peace dove in flight with olive branch — clear silhouette (not abstract blobs).
 */
export function DoveLoader({ label = "Preparing memorial..." }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl dove-glow-ring scale-110" aria-hidden />
        <svg
          className="relative w-full h-full dove-glide drop-shadow-lg"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="doveBody" x1="20" y1="40" x2="100" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d4af37" />
              <stop offset="1" stopColor="#8b6914" />
            </linearGradient>
            <linearGradient id="doveWing" x1="30" y1="20" x2="90" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f5efc9" stopOpacity="0.95" />
              <stop offset="1" stopColor="#c9a227" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Tail — layered feathers */}
          <path
            d="M18 58c4-8 12-14 22-16-6 6-10 14-10 24-4-3-8-5-12-8z"
            fill="url(#doveBody)"
            opacity="0.88"
          />
          <path d="M26 52c6-4 14-6 22-5-4 5-6 12-5 20-6-4-11-9-17-15z" fill="url(#doveBody)" opacity="0.72" />

          {/* Lower body & chest */}
          <path
            d="M38 54c12-4 28-2 40 8 8 7 10 18 4 26-14 18-42 20-62 8-8-5-12-12-14-20 10 8 24 8 36-2 2-4 3-9 4-14l-8-6z"
            fill="url(#doveBody)"
          />

          {/* Far wing (rear) */}
          <path
            className="dove-wing-flap"
            d="M48 38c18-16 44-22 58-8 6 6 5 16-2 22-10 9-32 12-50 4-8-4-12-10-14-18 4 6 10 10 18 10 10 0 18-5 22-12-8-6-20-4-32 2z"
            fill="url(#doveWing)"
            stroke="#a67c00"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />

          {/* Near wing (front, slightly lighter) */}
          <path
            d="M52 48c14-6 32-4 44 6 5 4 6 11 2 16-8 10-28 12-44 2-6-4-9-10-8-16 4 4 10 6 16 4 8-2 12-8 10-12z"
            fill="#fdfbf5"
            fillOpacity="0.92"
            stroke="#c9a227"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />

          {/* Head */}
          <ellipse cx="88" cy="44" rx="10" ry="9" fill="url(#doveBody)" />
          {/* Beak */}
          <path d="M97 42l12-2-8 8-4-6z" fill="#c9a227" />
          {/* Eye */}
          <circle cx="91" cy="42" r="2" fill="#1c1917" opacity="0.75" />
          <circle cx="90.5" cy="41.3" r="0.7" fill="#fff" opacity="0.9" />

          {/* Olive branch in beak */}
          <path
            d="M104 40c4 2 8 1 11-2M106 38c3 3 7 3 10 0M108 36c2 4 6 5 9 3"
            stroke="#4a7c59"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <ellipse cx="116" cy="34" rx="4" ry="2.5" fill="#5c9e6e" opacity="0.85" transform="rotate(25 116 34)" />
          <ellipse cx="112" cy="31" rx="3.5" ry="2" fill="#6daf7e" opacity="0.8" transform="rotate(-15 112 31)" />
        </svg>
      </div>

      <div className="mt-8 space-y-3 max-w-xs">
        <p className="font-display text-lg sm:text-xl text-base-content font-medium tracking-tight">{label}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="dove-dot" />
          <span className="dove-dot" />
          <span className="dove-dot" />
        </div>
        <div className="flex flex-col gap-2 pt-2 w-full max-w-[240px] mx-auto">
          <div className="h-2 w-full rounded-full bg-base-300/90 overflow-hidden shadow-inner">
            <div className="h-full w-[38%] rounded-full bg-primary/85 animate-pulse" />
          </div>
          <div className="skeleton h-2 w-full rounded-full bg-base-300/70" />
        </div>
      </div>
    </div>
  );
}
