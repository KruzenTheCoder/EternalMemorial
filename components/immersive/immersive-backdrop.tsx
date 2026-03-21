"use client";

import dynamic from "next/dynamic";

const EtherCanvas = dynamic(() => import("./ether-canvas").then((m) => m.EtherCanvas), {
  ssr: false,
  loading: () => null,
});

export function ImmersiveBackdrop({
  variant = "home",
  className = "",
}: {
  variant?: "home" | "auth";
  className?: string;
}) {
  const subtle = variant === "auth";
  return (
    <div
      className={`pointer-events-none overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-transparent to-stone-100/40" />
      <EtherCanvas subtle={subtle} className="opacity-[0.85] mix-blend-plus-lighter" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/82 via-transparent to-gold-50/20" />
    </div>
  );
}
