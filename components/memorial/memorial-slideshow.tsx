"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-neutral-950 rounded-2xl overflow-hidden group luxury-ring">
        {media[current].url && (
          <Image
            src={media[current].url}
            alt={media[current].caption || "Memorial image"}
            fill
            className="object-contain"
          />
        )}
        <button
          onClick={() => setCurrent((c) => (c - 1 + media.length) % media.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/45 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % media.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/45 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
        {media[current].caption && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white text-center">
            <p className="font-serif text-base md:text-lg">{media[current].caption}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {media.map((item, index) => (
          <button
            key={item.id ?? `${item.url}-${index}`}
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
            {item.url && (
              <Image
                src={item.url}
                alt={item.caption || `Memory ${index + 1}`}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
