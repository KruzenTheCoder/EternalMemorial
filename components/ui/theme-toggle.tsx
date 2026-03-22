"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("em-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("em-theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold-200/60 bg-background/80 ${className}`}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 text-gold-600" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold-200/60 bg-background/80 hover:bg-gold-50 dark:hover:bg-gold-950/30 transition-colors ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-gold-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-gold-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
