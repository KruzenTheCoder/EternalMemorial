import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";
import { BRAND } from "@/lib/brand";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  immersive = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  immersive?: boolean;
}) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          immersive
            ? "bg-gradient-to-br from-gold-50/55 via-background/70 to-amber-50/35"
            : "bg-gradient-to-br from-gold-50/95 via-background to-amber-50/40"
        )}
      />
      <div className={cn("absolute inset-0 pointer-events-none", immersive ? "opacity-35" : "opacity-50")}>
        <div className="absolute top-[12%] -left-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-gold-200/30 to-transparent blur-3xl animate-soft-float" />
        <div
          className="absolute bottom-[8%] -right-16 w-[22rem] h-[22rem] rounded-full bg-gradient-to-tl from-amber-300/25 to-transparent blur-3xl animate-soft-float"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      <Link
        href="/"
        className="relative z-10 mb-8 text-xs uppercase tracking-[0.25em] text-gold-700/80 hover:text-gold-900 transition-colors font-sans"
      >
        ← {BRAND.name}
      </Link>

      <div
        className={cn(
          "relative z-10 w-full max-w-md luxury-card p-8 md:p-10 border shadow-2xl backdrop-blur-md",
          immersive
            ? "border-gold-200/60 bg-white/70 shadow-gold-900/10"
            : "border-gold-200/80 bg-white/85 shadow-gold-900/5"
        )}
      >
        {eyebrow ? (
          <FadeIn delayMs={0}>
            <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-3 font-sans">{eyebrow}</p>
          </FadeIn>
        ) : null}
        <FadeIn delayMs={80}>
          <h1 className="text-center text-3xl font-display font-bold text-foreground mb-2">{title}</h1>
        </FadeIn>
        {description ? (
          <FadeIn delayMs={160}>
            <p className="text-center text-muted-foreground font-serif italic text-sm mb-8">{description}</p>
          </FadeIn>
        ) : null}
        {children}
      </div>
    </div>
  );
}
