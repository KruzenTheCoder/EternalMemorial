"use client";

import Link from "next/link";
import { Typewriter } from "@/components/motion/typewriter";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function HomeHeroClient() {
  return (
    <>
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 font-serif text-sm">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
          <h1
            data-immersive-hero
            className="opacity-0 text-[clamp(2.5rem,10vw,4.5rem)] lg:text-7xl font-bold font-display tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-700 via-gold-500 to-amber-500 drop-shadow-sm leading-tight"
          >
            {BRAND.wordmark}
          </h1>
          <p
            data-immersive-hero
            className="opacity-0 text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mb-4 font-sans leading-relaxed min-h-[3.5rem] md:min-h-[4rem]"
          >
            <Typewriter
              phrases={[
                "A sanctuary to honor those we love.",
                "Where every chapter stays beautifully alive.",
                "Dignity, warmth, and remembrance—always.",
              ]}
              typingMs={36}
              deletingMs={24}
              pauseMs={2600}
            />
          </p>
          <p
            data-immersive-hero
            className="opacity-0 text-sm text-muted-foreground/90 max-w-md mb-6 sm:mb-8 font-serif italic leading-relaxed"
          >
            Create lasting tributes with photos, live services, and quiet moments shared across the world.
          </p>
          <div
            data-immersive-hero
            className="opacity-0 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-stretch sm:justify-center lg:justify-start w-full sm:w-auto"
          >
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold-300/80 text-gold-900 hover:bg-gold-50/90 px-8 bg-white/40 backdrop-blur-sm"
                >
                  Sign in
                </Button>
              </Link>
              <ShimmerButton asChild size="lg" className="w-full sm:w-auto px-8 font-medium">
                <Link href="/auth/register" className="inline-flex w-full sm:w-auto justify-center">
                  Create account
                </Link>
              </ShimmerButton>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-gold-900/90 hover:bg-gold-100/40 px-8 border border-gold-200/50"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
        </div>

        <div data-immersive-hero className="opacity-0 w-full max-w-sm sm:max-w-md">
          <div data-immersive-float className="relative w-full aspect-square lg:w-[min(100%,500px)] flex items-center justify-center shrink-0 mx-auto">
            <div className="absolute inset-0 bg-gradient-radial from-gold-200/35 to-transparent blur-2xl rounded-full animate-glow-pulse" />
            <div className="relative z-10 w-full p-6 sm:p-8 border border-gold-200/90 bg-white/55 backdrop-blur-md rounded-2xl shadow-xl rotate-2 sm:rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="space-y-3 sm:space-y-4 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-gold-100 to-gold-200/80 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                  🕊️
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gold-900 to-gold-600 bg-clip-text text-transparent">
                  Digital tributes
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Memorial pages, guest books, candles, and livestreams—woven into one gentle story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 sm:mt-24 max-w-3xl mx-auto px-1 sm:px-4 text-center">
        <p data-immersive-scroll className="opacity-0 text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4 font-sans">The journey</p>
        <h2 data-immersive-scroll className="opacity-0 font-display text-2xl sm:text-3xl text-gold-950 mb-6">From first light to lasting legacy</h2>
        <div className="space-y-4 text-muted-foreground font-serif text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          {[
            "We begin with a name—spoken softly, written in gold—and build a space that feels like home.",
            "Family and friends add voices, images, and small rituals that make the page breathe.",
            "What remains is not a website, but a living archive: calm, respectful, and always within reach.",
          ].map((text) => (
            <p key={text.slice(0, 20)} data-immersive-scroll className="opacity-0">
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 max-w-6xl w-full px-1 sm:px-4">
        {[
          { title: "Create memorials", desc: "Build tribute pages with events, programs, and guest books.", icon: "🕯️" },
          { title: "Livestream services", desc: "Bring family together from anywhere with a calm, reliable stream.", icon: "🎥" },
          { title: "Share memories", desc: "Gather photos, messages, and moments in one sacred archive.", icon: "❤️" },
        ].map((item) => (
          <div
            key={item.title}
            data-immersive-scroll
            className="opacity-0 group relative h-full p-6 sm:p-8 rounded-2xl border border-gold-100/90 bg-white/55 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold-200/15 via-transparent to-amber-200/10"
            />
            <div className="relative text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
            <h3 className="relative text-lg sm:text-xl font-semibold font-display mb-2 text-gold-900">{item.title}</h3>
            <p className="relative text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <footer className="relative z-10 mt-16 sm:mt-20 py-6 text-center text-[11px] sm:text-xs text-muted-foreground font-sans px-4">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </footer>
    </>
  );
}
