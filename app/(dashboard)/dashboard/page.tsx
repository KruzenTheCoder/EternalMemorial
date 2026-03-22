import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  ExternalLink,
  Settings,
  Database,
  Flame,
  Users,
  MessageCircle,
  CalendarDays,
  ImageIcon,
  Eye,
} from "lucide-react";
import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";

function timeAgo(dateStr: string | Date) {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) redirect("/auth/login");

    const memorials = await prisma.memorial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            events: true,
            checkins: true,
            media: true,
            tributes: true,
          },
        },
      },
    });

    const totalMemorials = memorials.length;
    const totalCandles = memorials.reduce(
      (sum, m) => sum + m._count.checkins,
      0
    );
    const totalTributes = memorials.reduce(
      (sum, m) => sum + m._count.tributes,
      0
    );
    const totalMedia = memorials.reduce((sum, m) => sum + m._count.media, 0);
    const publishedCount = memorials.filter((m) => m.isPublished).length;

    return (
      <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
        {/* ─── Welcome Header ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-700/80 mb-1 font-sans">
              Dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Your Memorials
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and honor your loved ones with care.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/integrations/supabase">
              <Button
                variant="outline"
                className="gap-2 border-gold-200 hover:bg-gold-50 hover:text-gold-900"
              >
                <Database className="w-4 h-4" /> Integrations
              </Button>
            </Link>
            <Link href="/dashboard/memorials/new">
              <Button className="gap-2 bg-gold-500 hover:bg-gold-600 text-white shadow-md shadow-gold-500/20">
                <PlusCircle className="w-4 h-4" /> Create Memorial
              </Button>
            </Link>
          </div>
        </div>

        {/* ─── Stats Overview ─── */}
        {totalMemorials > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              {
                label: "Memorials",
                value: totalMemorials,
                sub: `${publishedCount} published`,
                icon: Eye,
                color: "text-gold-600",
              },
              {
                label: "Guest Activity",
                value: totalCandles,
                sub: "candles & signatures",
                icon: Flame,
                color: "text-amber-500",
              },
              {
                label: "Tributes",
                value: totalTributes,
                sub: "messages received",
                icon: MessageCircle,
                color: "text-emerald-600",
              },
              {
                label: "Gallery",
                value: totalMedia,
                sub: "photos uploaded",
                icon: ImageIcon,
                color: "text-sky-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="luxury-card p-4 sm:p-5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                  <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
                </div>
                <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ─── Memorial Cards ─── */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {memorials.length === 0 ? (
            <div className="col-span-full py-16 text-center luxury-card border-dashed border-2 flex flex-col items-center justify-center gap-5 p-10">
              <div className="w-20 h-20 rounded-full bg-gold-50 border-2 border-gold-100 flex items-center justify-center text-gold-300">
                <PlusCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Create your first memorial
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                  Build a beautiful tribute page with photos, events, a guest
                  book, and live streaming — all in one sacred space.
                </p>
              </div>
              <Link href="/dashboard/memorials/new">
                <Button className="mt-2 bg-gold-500 hover:bg-gold-600 text-white shadow-md shadow-gold-500/20 px-8">
                  Create Memorial
                </Button>
              </Link>
            </div>
          ) : (
            memorials.map((memorial) => (
              <div
                key={memorial.id}
                className="luxury-card overflow-hidden flex flex-col group hover:shadow-material-lg transition-shadow"
              >
                {/* Cover Image / Gradient Banner */}
                <div className="relative h-32 bg-gradient-to-br from-gold-100 via-gold-50 to-amber-50 overflow-hidden">
                  {memorial.coverImage ? (
                    <Image
                      src={memorial.coverImage}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-30">🕊️</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md ${
                        memorial.isPublished
                          ? "bg-emerald-500/80 text-white"
                          : "bg-white/70 text-neutral-600"
                      }`}
                    >
                      {memorial.isPublished ? "Published" : "Draft"}
                    </span>
                    {memorial.isStreaming && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/80 text-white animate-pulse backdrop-blur-md">
                        Live
                      </span>
                    )}
                  </div>

                  {/* Profile Image Overlay */}
                  {memorial.profileImage && (
                    <div className="absolute -bottom-5 left-4">
                      <div className="w-14 h-14 rounded-full border-3 border-white shadow-lg overflow-hidden bg-white">
                        <Image
                          src={memorial.profileImage}
                          alt={memorial.firstName}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 pt-8 flex-1 flex flex-col">
                  <h2 className="text-xl font-display font-bold text-foreground group-hover:text-gold-600 transition-colors">
                    {memorial.firstName} {memorial.lastName}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70 truncate">
                    /{memorial.slug}
                  </p>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    {[
                      {
                        icon: CalendarDays,
                        count: memorial._count.events,
                        label: "Events",
                      },
                      {
                        icon: Users,
                        count: memorial._count.checkins,
                        label: "Guests",
                      },
                      {
                        icon: ImageIcon,
                        count: memorial._count.media,
                        label: "Photos",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-col items-center gap-1 py-2 rounded-lg bg-muted/30"
                      >
                        <s.icon className="w-3.5 h-3.5 text-gold-600/70" />
                        <span className="text-sm font-semibold text-foreground">
                          {s.count}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-3">
                    Created {timeAgo(memorial.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-0 border-t border-border/40">
                  <Link
                    href={`/dashboard/memorials/${memorial.id}/edit`}
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      className="w-full gap-2 rounded-none rounded-bl-[calc(var(--radius)+8px)] h-12 text-sm hover:bg-gold-50 hover:text-gold-700"
                    >
                      <Settings className="w-4 h-4" /> Manage
                    </Button>
                  </Link>
                  {memorial.isPublished ? (
                    <Link
                      href={`/${memorial.slug}`}
                      className="w-full"
                      target="_blank"
                    >
                      <Button
                        variant="ghost"
                        className="w-full gap-2 rounded-none rounded-br-[calc(var(--radius)+8px)] h-12 text-sm hover:bg-gold-50 hover:text-gold-700 border-l border-border/40"
                      >
                        <ExternalLink className="w-4 h-4" /> Visit
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full gap-2 rounded-none rounded-br-[calc(var(--radius)+8px)] h-12 text-sm text-muted-foreground border-l border-border/40"
                      disabled
                    >
                      <ExternalLink className="w-4 h-4" /> Publish first
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── Footer ─── */}
        <footer className="mt-16 pt-8 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </footer>
      </div>
    );
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    const isDev = process.env.NODE_ENV === "development";
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="max-w-lg mx-auto luxury-card p-8 border-red-200 bg-red-50/50 text-left">
          <h1 className="text-2xl font-bold text-red-800 mb-2 text-center">
            Database connection failed
          </h1>
          <p className="text-red-700/90 mb-4 text-center text-sm">
            Prisma could not reach PostgreSQL. Check your{" "}
            <code className="text-xs bg-white/80 px-1 rounded">.env</code>{" "}
            connection string.
          </p>
          {isDev ? (
            <div className="text-xs bg-white p-3 rounded border border-red-100 font-mono text-red-800 break-words mb-4">
              {detail}
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/integrations/supabase" className="flex-1">
              <Button variant="outline" className="w-full border-red-200">
                Test connection
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Retry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
