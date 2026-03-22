"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, ZoomIn, X } from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  type: string;
  caption: string | null;
};

export function MemorialSlideshow({ media }: { media: MediaItem[] }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);

  const photos = media.filter((m) => m.type === "PHOTO");
  const total = photos.length;

  const go = useCallback(
    (dir: "next" | "prev") => {
      setDirection(dir);
      setIdx((prev) =>
        dir === "next"
          ? (prev + 1) % total
          : (prev - 1 + total) % total
      );
    },
    [total]
  );

  /* Autoplay */
  useEffect(() => {
    if (!playing || total <= 1) return;
    const timer = setInterval(() => go("next"), 5000);
    return () => clearInterval(timer);
  }, [playing, total, go]);

  /* Keyboard */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === "ArrowRight") go("next");
      if (e.key === "Escape" && lightbox) setLightbox(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go, lightbox]);

  if (total === 0) return null;

  const current = photos[idx];
  const prevPhoto = photos[(idx - 1 + total) % total];
  const nextPhoto = photos[(idx + 1) % total];

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl group select-none"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) {
            go(diff > 0 ? "next" : "prev");
          }
        }}
      >
        {/* Crossfade Layer */}
        {photos.map((photo, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.caption || `Memory ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Caption */}
        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6">
            <p
              key={`caption-${idx}`}
              className="text-white/95 text-sm sm:text-base font-serif italic max-w-xl animate-fade-in-up"
            >
              {current.caption}
            </p>
          </div>
        )}

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go("prev")}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go("next")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Controls Bar */}
        <div className="absolute top-3 right-3 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {total > 1 && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 flex items-center justify-center hover:bg-black/50 transition-colors"
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="View fullscreen"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dot Indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > idx ? "next" : "prev");
                  setIdx(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === idx
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="absolute top-3 left-3 z-30 text-[10px] text-white/70 font-mono bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
          {idx + 1} / {total}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go("prev");
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go("next");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.caption || "Memorial photo"}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {current.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-serif italic text-center max-w-lg px-4">
              {current.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
