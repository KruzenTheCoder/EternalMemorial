import { prisma } from "@/lib/prisma";
import { MemorialHero } from "@/components/memorial/memorial-hero";
import { MemorialSlideshow } from "@/components/memorial/memorial-slideshow";
import { VirtualCandle } from "@/components/memorial/virtual-candle";
import { StreamPlayer } from "@/components/livestream/stream-player";
import { CheckinForm } from "@/components/memorial/memorial-checkin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-14 opacity-60">
      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />
      <div className="h-2.5 w-2.5 rotate-45 border border-gold-600/70 mx-4" />
      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const memorial = await prisma.memorial.findUnique({
    where: { slug: params.slug },
    select: {
      firstName: true,
      lastName: true,
      obituary: true,
      coverImage: true,
      profileImage: true,
      slug: true,
    },
  });

  if (!memorial) return {};

  const fullName = `${memorial.firstName} ${memorial.lastName}`.trim();
  const description = (memorial.obituary || "A memorial page to honor and remember a loved one.")
    .replace(/\s+/g, " ")
    .slice(0, 160);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/${memorial.slug}`;
  const image = memorial.coverImage || memorial.profileImage || undefined;

  return {
    title: `${fullName} Memorial | Eternal Memory`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${fullName} Memorial | Eternal Memory`,
      description,
      url,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${fullName} Memorial | Eternal Memory`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const memorialQuery = prisma.memorial.findUnique({
    where: { slug: params.slug },
    include: {
      media: true,
      events: true,
      program: true,
      _count: { select: { checkins: true } },
    },
  });

  let memorial: Awaited<typeof memorialQuery>;
  try {
    memorial = await memorialQuery;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl">
          <h1 className="text-3xl font-display">Memorial Portal Temporarily Unavailable</h1>
          <p className="mt-4 text-muted-foreground">
            We are unable to reach the database right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  if (!memorial) notFound();

  const born = formatLongDate(memorial.dateOfBirth);
  const passed = formatLongDate(memorial.dateOfDeath);
  const age = new Date(memorial.dateOfDeath).getFullYear() - new Date(memorial.dateOfBirth).getFullYear();
  const upcomingEvents = [...memorial.events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const serviceProgram = [...memorial.program].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-background min-h-screen selection:bg-gold-200 selection:text-gold-900">
      <MemorialHero memorial={memorial} />

      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="luxury-panel max-w-5xl mx-auto px-6 py-8 md:px-10 md:py-10 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="grid gap-6 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gold-200/50">
            <div className="p-5 text-center">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Born</p>
              <p className="font-display text-3xl text-foreground">{born}</p>
            </div>
            <div className="p-5 text-center">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Rested</p>
              <p className="font-display text-3xl text-foreground">{passed}</p>
            </div>
            <div className="p-5 text-center">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-600/70 mb-2">Legacy</p>
              <p className="font-display text-3xl text-foreground">{age} years of love</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold-600 font-serif italic tracking-wide mb-4 block text-xl">In Loving Memory</span>
          <h2 className="text-5xl md:text-6xl font-display text-foreground mb-12 drop-shadow-sm">Obituary</h2>
          <div className="luxury-panel px-8 py-12 md:px-16 md:py-16 text-left bg-white/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient" />
            <div className="prose prose-stone dark:prose-invert prose-lg max-w-none font-serif leading-loose text-foreground/80 first-letter:text-6xl first-letter:font-display first-letter:text-gold-600 first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.1em]">
              {memorial.obituary || "No obituary content provided."}
            </div>
            <div className="mt-12 flex justify-center opacity-40">
              <div className="h-px w-24 bg-gold-300" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {(memorial.isStreaming || memorial.streamKey) && (
        <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-gold-600/20 to-transparent blur-3xl" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-200/70">Worldwide Memorial Broadcast</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-display text-gold-100">Live Service</h2>
              <p className="mt-3 font-serif text-gold-100/70 italic">Join us in celebrating the life of {memorial.firstName}</p>
            </div>
            <StreamPlayer streamKey={memorial.streamKey || ""} isLive={memorial.isStreaming} />
          </div>
        </section>
      )}

      {serviceProgram.length > 0 && (
        <section className="py-24 bg-secondary/25">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-700/70">Order of Service</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-display text-foreground">Service Book</h2>
              <p className="mt-3 font-serif italic text-muted-foreground">A guided itinerary for the memorial service.</p>
            </div>

            <div className="max-w-5xl mx-auto luxury-panel p-6 md:p-10">
              <div className="space-y-4">
                {serviceProgram.map((item, index) => (
                  <div key={item.id} className="relative flex gap-4 md:gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-mono text-xs text-gold-800">
                        {(item.time || String(index + 1)).slice(0, 8)}
                      </div>
                      {index !== serviceProgram.length - 1 ? (
                        <div className="w-px flex-1 bg-gradient-to-b from-gold-300/70 to-transparent mt-3" />
                      ) : null}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-200">
                              {item.type}
                            </span>
                            <h3 className="text-xl md:text-2xl font-display text-foreground">{item.title}</h3>
                          </div>
                          {item.speakerName ? (
                            <p className="mt-1 text-sm text-muted-foreground">{item.speakerName}</p>
                          ) : null}
                        </div>
                        {item.time ? (
                          <div className="text-sm font-mono text-muted-foreground whitespace-nowrap">{item.time}</div>
                        ) : null}
                      </div>

                      {item.description ? (
                        <div className="mt-4 rounded-xl border border-gold-200/60 bg-white/70 dark:bg-black/20 p-4">
                          <p className="whitespace-pre-wrap font-serif leading-relaxed text-foreground/80">{item.description}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-700/70">Schedule</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-display text-foreground">Service Events</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="luxury-panel luxury-ring p-6">
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-700/70">{event.type}</p>
                  <h3 className="mt-3 text-xl font-semibold">{event.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                  {event.location ? (
                    <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {memorial.media.length > 0 && (
        <section className="py-24 bg-secondary/35">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-700/70">Memories</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-display text-foreground">Cherished Moments</h2>
            </div>
            <div className="max-w-6xl mx-auto p-4 luxury-panel luxury-ring">
              <MemorialSlideshow media={memorial.media} />
            </div>
          </div>
        </section>
      )}

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold-50/50 dark:to-gold-900/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
            <div className="text-center p-10 md:p-12 luxury-panel luxury-ring">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-700/70">Tribute</p>
              <h2 className="text-3xl md:text-4xl font-display mt-4 mb-8 text-foreground">Light a Candle</h2>
              <VirtualCandle memorialId={memorial.id} />
              <p className="mt-8 text-sm text-muted-foreground font-sans">
                Total tributes: <span className="font-semibold text-foreground">{memorial._count.checkins}</span>
              </p>
            </div>
            <div className="text-center p-10 md:p-12 luxury-panel luxury-ring">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-700/70">Gathering</p>
              <h2 className="text-3xl md:text-4xl font-display mt-4 mb-6 text-foreground">Guest Book</h2>
              <p className="font-serif text-muted-foreground mb-8 italic max-w-md mx-auto">
                Please sign the guest book to share your condolences and let the family know you are here.
              </p>
              <div className="rounded-2xl border border-gold-200/50 bg-white/70 dark:bg-black/20 p-6">
                <CheckinForm memorialId={memorial.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-t from-gold-100/30 to-transparent dark:from-gold-900/20" />
    </div>
  );
}
