import { prisma } from "@/lib/prisma";
import { getGuestAndCandleCounts } from "@/lib/get-checkin-counts";
import { MemorialHero } from "@/components/memorial/memorial-hero";
import { MemorialSlideshow } from "@/components/memorial/memorial-slideshow";
import { VirtualCandle } from "@/components/memorial/virtual-candle";
import { CheckinForm } from "@/components/memorial/memorial-checkin";
import { TributeForm } from "@/components/memorial/tribute-form";
import { EventRsvp } from "@/components/memorial/event-rsvp";
import { MemorialScrollProgress } from "@/components/memorial/memorial-scroll-progress";
import { MemorialLifeArc } from "@/components/memorial/memorial-life-arc";
import { MemorialQuickNav } from "@/components/memorial/memorial-quick-nav";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BRAND } from "@/lib/brand";

const StreamPlayer = dynamic(
  () =>
    import("@/components/livestream/stream-player").then((m) => m.StreamPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full rounded-xl bg-neutral-900/80 animate-pulse border border-gold-500/20" />
    ),
  }
);

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-10 sm:py-14 opacity-60">
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />
      <div className="h-2.5 w-2.5 rotate-45 border border-gold-600/70 mx-3 sm:mx-4 shrink-0" />
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const memorial = await prisma.memorial.findFirst({
    where: { slug: params.slug, isPublished: true },
    select: {
      firstName: true,
      lastName: true,
      obituary: true,
      coverImage: true,
      profileImage: true,
      slug: true,
    },
  });

  if (!memorial) return { title: `Memorial | ${BRAND.name}` };

  const fullName = `${memorial.firstName} ${memorial.lastName}`.trim();
  const description = (memorial.obituary || "A memorial page to honor and remember a loved one.")
    .replace(/\s+/g, " ")
    .slice(0, 160);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/${memorial.slug}`;
  const image = memorial.coverImage || memorial.profileImage || undefined;

  return {
    title: `${fullName} Memorial | ${BRAND.name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${fullName} Memorial | ${BRAND.name}`,
      description,
      url,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${fullName} Memorial | ${BRAND.name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const memorialQuery = prisma.memorial.findFirst({
    where: { slug: params.slug, isPublished: true },
    include: {
      media: true,
      events: true,
      program: true,
      tributes: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  let memorial: Awaited<typeof memorialQuery>;
  try {
    memorial = await memorialQuery;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-display">Memorial Portal Temporarily Unavailable</h1>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            We are unable to reach the database right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  if (!memorial) notFound();

  const [guestCount, candleCount] = await getGuestAndCandleCounts(memorial.id);

  const born = formatLongDate(memorial.dateOfBirth);
  const passed = formatLongDate(memorial.dateOfDeath);
  const age = new Date(memorial.dateOfDeath).getFullYear() - new Date(memorial.dateOfBirth).getFullYear();
  const upcomingEvents = [...memorial.events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const serviceProgram = [...memorial.program].sort((a, b) => a.order - b.order);

  const hasStream = Boolean(memorial.isStreaming || memorial.streamKey);
  const hasProgram = serviceProgram.length > 0;
  const hasEvents = upcomingEvents.length > 0;
  const hasMedia = memorial.media.length > 0;

  return (
    <div className="bg-background min-h-screen selection:bg-gold-200 selection:text-gold-900 pb-28 md:pb-0">
      <MemorialScrollProgress />
      <MemorialQuickNav
        hasStream={hasStream}
        hasProgram={hasProgram}
        hasEvents={hasEvents}
        hasMedia={hasMedia}
      />

      <MemorialHero memorial={memorial} />

      <section className="container mx-auto px-4 sm:px-5 -mt-12 sm:-mt-16 relative z-20 scroll-mt-24">
        <div className="luxury-panel max-w-5xl mx-auto px-4 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gold-200/50">
            <div className="p-4 sm:p-5 text-center">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Born</p>
              <p className="font-display text-2xl sm:text-3xl text-foreground leading-tight">{born}</p>
            </div>
            <div className="p-4 sm:p-5 text-center">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Rested</p>
              <p className="font-display text-2xl sm:text-3xl text-foreground leading-tight">{passed}</p>
            </div>
            <div className="p-4 sm:p-5 text-center">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Legacy</p>
              <p className="font-display text-2xl sm:text-3xl text-foreground leading-tight">{age} years of love</p>
            </div>
          </div>
        </div>
      </section>

      <MemorialLifeArc
        birth={memorial.dateOfBirth.toISOString()}
        death={memorial.dateOfDeath.toISOString()}
        firstName={memorial.firstName}
      />

      <section id="story" className="relative py-16 sm:py-20 md:py-24 container mx-auto px-4 sm:px-5 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold-600 font-serif italic tracking-wide mb-3 sm:mb-4 block text-lg sm:text-xl">
            In Loving Memory
          </span>
          <h2 className="text-[clamp(2rem,6vw,3.75rem)] font-display text-foreground mb-8 sm:mb-12 drop-shadow-sm leading-tight px-1">
            Obituary
          </h2>
          <div className="luxury-panel px-5 py-9 sm:px-8 sm:py-12 md:px-14 md:py-16 text-left bg-white/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient" />
            <div className="prose prose-stone dark:prose-invert prose-base sm:prose-lg max-w-none font-serif leading-relaxed text-foreground/85 first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-display first-letter:text-gold-600 first-letter:float-left first-letter:mr-3 first-letter:mt-0 sm:first-letter:mr-4 sm:first-letter:mt-[-0.1em] whitespace-pre-wrap">
              {memorial.obituary || "No obituary content provided."}
            </div>
            <div className="mt-10 sm:mt-12 flex justify-center opacity-40">
              <div className="h-px w-24 bg-gold-300" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {hasStream ? (
        <section id="live" className="py-16 sm:py-20 md:py-24 bg-neutral-950 text-white relative overflow-hidden scroll-mt-24">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-gold-600/20 to-transparent blur-3xl" />
          <div className="container mx-auto max-w-6xl px-4 sm:px-5 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gold-200/70">
                Worldwide Memorial Broadcast
              </p>
              <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-display text-gold-100">Live Service</h2>
              <p className="mt-2 sm:mt-3 font-serif text-gold-100/70 italic text-sm sm:text-base px-2">
                Join us in celebrating the life of {memorial.firstName}
              </p>
            </div>
            <StreamPlayer streamKey={memorial.streamKey || ""} isLive={memorial.isStreaming} />
          </div>
        </section>
      ) : null}

      {hasProgram ? (
        <section id="program" className="py-16 sm:py-20 md:py-24 bg-secondary/25 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Order of Service</p>
              <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-display text-foreground">Service Book</h2>
              <p className="mt-2 sm:mt-3 font-serif italic text-muted-foreground text-sm sm:text-base px-2">
                A guided itinerary for the memorial service.
              </p>
            </div>

            <div className="max-w-5xl mx-auto luxury-panel p-4 sm:p-6 md:p-10">
              <div className="space-y-4">
                {serviceProgram.map((item, index) => (
                  <div key={item.id} className="relative flex gap-3 sm:gap-5 md:gap-6">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-mono text-[10px] sm:text-xs text-gold-800 px-1 text-center leading-tight">
                        {(item.time || String(index + 1)).slice(0, 8)}
                      </div>
                      {index !== serviceProgram.length - 1 ? (
                        <div className="w-px flex-1 bg-gradient-to-b from-gold-300/70 to-transparent mt-2 sm:mt-3 min-h-[1.5rem]" />
                      ) : null}
                    </div>

                    <div className="flex-1 pb-2 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-200 w-fit">
                              {item.type}
                            </span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-display text-foreground break-words">
                              {item.title}
                            </h3>
                          </div>
                          {item.speakerName ? (
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{item.speakerName}</p>
                          ) : null}
                        </div>
                        {item.time ? (
                          <div className="text-xs sm:text-sm font-mono text-muted-foreground shrink-0">{item.time}</div>
                        ) : null}
                      </div>

                      {item.description ? (
                        <div className="mt-3 sm:mt-4 rounded-xl border border-gold-200/60 bg-white/70 dark:bg-black/20 p-3 sm:p-4">
                          <p className="whitespace-pre-wrap font-serif leading-relaxed text-foreground/80 text-sm sm:text-base">
                            {item.description}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hasEvents ? (
        <section id="events" className="py-14 sm:py-20 bg-background scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Schedule</p>
              <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-display text-foreground">Service Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="luxury-panel luxury-ring p-5 sm:p-6 flex flex-col min-h-0">
                  <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-700/70">{event.type}</p>
                  <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold break-words">{event.title}</h3>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {event.location ? (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">{event.location}</p>
                  ) : null}
                  <EventRsvp memorialId={memorial.id} eventId={event.id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasMedia ? (
        <section id="gallery" className="py-16 sm:py-20 md:py-24 bg-secondary/35 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Memories</p>
              <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-display text-foreground">Cherished Moments</h2>
              <p className="mt-2 text-sm text-muted-foreground font-serif italic max-w-xl mx-auto">
                Swipe through photographs on your phone—each frame a borrowed minute of joy.
              </p>
            </div>
            <div className="max-w-6xl mx-auto p-3 sm:p-4 luxury-panel luxury-ring">
              <MemorialSlideshow media={memorial.media} />
            </div>
          </div>
        </section>
      ) : null}

      <section id="comfort" className="py-16 sm:py-20 md:py-24 bg-secondary/20 scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-5 max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Messages</p>
            <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-display text-foreground">Words of comfort</h2>
            <p className="mt-2 sm:mt-3 font-serif italic text-muted-foreground text-sm sm:text-base px-2">
              Share a memory. Messages appear after a brief review.
            </p>
          </div>

          {memorial.tributes.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12">
              {memorial.tributes.map((t) => (
                <div key={t.id} className="luxury-panel p-5 sm:p-6 text-left border-l-4 border-l-gold-400/80">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gold-700/70">{t.authorName}</p>
                  <p className="mt-2 sm:mt-3 font-serif leading-relaxed text-foreground/90 whitespace-pre-wrap text-sm sm:text-base">
                    {t.content}
                  </p>
                  <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-serif italic mb-10 text-sm sm:text-base">
              Be the first to leave a message of condolence.
            </p>
          )}

          <div className="luxury-panel luxury-ring p-6 sm:p-8 md:p-10">
            <TributeForm memorialId={memorial.id} />
          </div>
        </div>
      </section>

      <section id="tribute" className="py-16 sm:py-20 md:py-24 relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold-50/50 dark:to-gold-900/10 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch max-w-6xl mx-auto">
            <div className="text-center p-6 sm:p-10 md:p-12 luxury-panel luxury-ring">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Tribute</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mt-3 sm:mt-4 mb-6 sm:mb-8 text-foreground">
                Light a Candle
              </h2>
              <VirtualCandle memorialId={memorial.id} candleCount={candleCount} guestCount={guestCount} />
            </div>
            <div className="text-center p-6 sm:p-10 md:p-12 luxury-panel luxury-ring">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-700/70">Gathering</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mt-3 sm:mt-4 mb-4 sm:mb-6 text-foreground">
                Guest Book
              </h2>
              <p className="font-serif text-muted-foreground mb-6 sm:mb-8 italic max-w-md mx-auto text-sm sm:text-base px-1">
                Please sign the guest book to share your condolences and let the family know you are here.
              </p>
              <div className="rounded-2xl border border-gold-200/50 bg-white/70 dark:bg-black/20 p-4 sm:p-6">
                <CheckinForm memorialId={memorial.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16 sm:h-24 bg-gradient-to-t from-gold-100/30 to-transparent dark:from-gold-900/20" />
    </div>
  );
}
