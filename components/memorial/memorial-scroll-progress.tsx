"use client";

import { useEffect, useState } from "react";

export function MemorialScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      const next = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0;
      setP(Math.min(100, Math.max(0, next)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gold-900/10 pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(212,175,55,0.5)]"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
