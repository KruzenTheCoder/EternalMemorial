"use client";

import { BookHeart, CalendarDays, Clapperboard, Flame, Heart, ImageIcon, Menu, MessageCircle, Sparkles, X } from "lucide-react";
import { useCallback, useState } from "react";

type Item = { id: string; label: string; icon: typeof Heart };

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MemorialQuickNav({
  hasStream,
  hasProgram,
  hasEvents,
  hasMedia,
}: {
  hasStream: boolean;
  hasProgram: boolean;
  hasEvents: boolean;
  hasMedia: boolean;
}) {
  const [open, setOpen] = useState(false);

  const items: Item[] = [
    { id: "journey", label: "Journey", icon: Sparkles },
    { id: "story", label: "Story", icon: BookHeart },
    ...(hasStream ? [{ id: "live", label: "Live", icon: Clapperboard }] as Item[] : []),
    ...(hasProgram ? [{ id: "program", label: "Program", icon: CalendarDays }] as Item[] : []),
    ...(hasEvents ? [{ id: "events", label: "Events", icon: CalendarDays }] as Item[] : []),
    ...(hasMedia ? [{ id: "gallery", label: "Photos", icon: ImageIcon }] as Item[] : []),
    { id: "comfort", label: "Messages", icon: MessageCircle },
    { id: "tribute", label: "Candle", icon: Flame },
  ];

  const go = useCallback((id: string) => {
    scrollToId(id);
    setOpen(false);
  }, []);

  return (
    <>
      {/* Desktop / tablet rail */}
      <nav
        className="hidden md:flex fixed right-3 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 p-2 rounded-2xl border border-gold-200/50 bg-background/90 backdrop-blur-md shadow-lg max-h-[80vh] overflow-y-auto"
        aria-label="Memorial sections"
      >
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-foreground/80 hover:bg-gold-100/80 hover:text-gold-900 transition-colors w-full min-w-[9rem]"
          >
            <Icon className="h-4 w-4 shrink-0 text-gold-600" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile sheet trigger */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 px-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-background/95 backdrop-blur-md px-5 py-3 text-sm font-semibold text-gold-900 shadow-lg shadow-gold-900/10"
          >
            <Menu className="h-4 w-4" />
            Explore this memorial
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm" role="dialog" aria-modal>
          <button type="button" className="flex-1 min-h-[30vh]" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="rounded-t-3xl border-t border-gold-200/60 bg-background p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_40px_rgba(0,0,0,0.12)] max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-display font-semibold text-foreground">Where would you like to go?</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {items.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => go(id)}
                    className="flex w-full items-center gap-2 rounded-xl border border-gold-200/50 bg-gold-50/40 dark:bg-gold-950/20 px-3 py-3 text-left text-sm font-medium"
                  >
                    <Icon className="h-4 w-4 text-gold-600 shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
