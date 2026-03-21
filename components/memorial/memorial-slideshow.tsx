"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Media } from "@prisma/client";

export function MemorialSlideshow({ media }: { media: Partial<Media>[] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !media || media.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % media.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, media]);

  if (!media || media.length === 0) return null;

  const currentUrl = media[current].url;

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-neutral-950 rounded-2xl overflow-hidden group luxury-ring">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied gallery URLs from any host
          <img
            src={currentUrl}
            alt={media[current].caption || "Memorial image"}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : null}
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => setCurrent((c) => (c - 1 + media.length) % media.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/45 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => setCurrent((c) => (c + 1) % media.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/45 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
        {media[current].caption ? (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white text-center pointer-events-none">
            <p className="font-serif text-base md:text-lg">{media[current].caption}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {media.map((item, index) => (
          <button
            key={item.id ?? `${item.url}-${index}`}
            type="button"
            onClick={() => {
              setCurrent(index);
              setAutoplay(false);
            }}
            className={`relative h-14 w-20 md:h-16 md:w-24 overflow-hidden rounded-lg border transition ${
              current === index
                ? "border-gold-500 ring-1 ring-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.45)]"
                : "border-gold-200/50 hover:border-gold-400/70"
            }`}
          >
            {item.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.caption || `Memory ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
