"use client";

import { motion } from "framer-motion";

type Phase = { label: string; range: string; blurb: string };

function buildPhases(birth: Date, death: Date): Phase[] {
  const startDecade = Math.floor(birth.getFullYear() / 10) * 10;
  const endDecade = Math.floor(death.getFullYear() / 10) * 10;
  const phases: Phase[] = [];
  for (let y = startDecade; y <= endDecade; y += 10) {
    const end = y + 9;
    phases.push({
      label: `${y}s`,
      range: `${y}–${end}`,
      blurb:
        y < 1960
          ? "Roots, family, and first lessons in faith and work."
          : y < 1980
            ? "Building a career and a home filled with laughter."
            : y < 2000
              ? "Mentoring others and deepening lifelong friendships."
              : y < 2020
                ? "Grandchildren, travel, and quiet joys."
                : "Golden years spent in gratitude and gentle presence.",
    });
  }
  return phases.slice(0, 8);
}

export function MemorialLifeArc({
  birth,
  death,
  firstName,
}: {
  birth: string;
  death: string;
  firstName: string;
}) {
  const b = new Date(birth);
  const d = new Date(death);
  const phases = buildPhases(b, d);
  const years = d.getFullYear() - b.getFullYear();

  return (
    <section
      id="journey"
      className="relative scroll-mt-24 py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gold-50/40 via-background to-background dark:from-gold-950/20"
    >
      <div className="container mx-auto px-4 sm:px-5 max-w-6xl">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gold-700/80">A life in motion</p>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display text-foreground">
            {years} years of {firstName}&apos;s journey
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-serif italic px-2">
            Scroll through the decades—each era a chapter of love, work, and wonder.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-300/80 to-transparent -translate-y-1/2 pointer-events-none" />
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-1 px-1 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
            {phases.map((phase, i) => (
              <motion.article
                key={phase.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="snap-center shrink-0 w-[min(78vw,280px)] md:w-auto rounded-2xl border border-gold-200/60 bg-white/90 dark:bg-card/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-gold-300/80 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-display text-gold-700 dark:text-gold-400">{phase.label}</div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{phase.range}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{phase.blurb}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
