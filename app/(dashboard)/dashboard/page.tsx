import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, ExternalLink, Settings, Database } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) redirect("/auth/login");

    const memorials = await prisma.memorial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true, checkins: true },
        },
      },
    });

    return (
      <div className="container mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Your Memorials</h1>
            <p className="text-muted-foreground mt-1">Manage and honor your loved ones.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/integrations/supabase">
              <Button variant="outline" className="gap-2 border-gold-200 hover:bg-gold-50 hover:text-gold-900">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memorials.length === 0 ? (
            <div className="col-span-full py-16 text-center luxury-card border-dashed border-2 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center text-gold-400">
                <PlusCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No memorials yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  Create your first memorial to start honoring a loved one with a beautiful tribute page.
                </p>
              </div>
              <Link href="/dashboard/memorials/new">
                <Button className="mt-4 bg-gold-500 hover:bg-gold-600">Create New Memorial</Button>
              </Link>
            </div>
          ) : (
            memorials.map((memorial) => (
              <div key={memorial.id} className="luxury-card p-6 flex flex-col justify-between h-full group">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      memorial.isPublished 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}>
                      {memorial.isPublished ? "Published" : "Draft"}
                    </span>
                    {memorial.isStreaming && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse">
                        Live Streaming
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground group-hover:text-gold-600 transition-colors">
                      {memorial.firstName} {memorial.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground font-mono mt-1 opacity-70 truncate">
                      /{memorial.slug}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider opacity-70">Events</span>
                      <span className="font-semibold text-foreground">{memorial._count.events}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider opacity-70">Tributes</span>
                      <span className="font-semibold text-foreground">{memorial._count.checkins}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
                  <Link href={`/dashboard/memorials/${memorial.id}/edit`} className="w-full">
                    <Button variant="outline" className="w-full gap-2 border-input hover:border-gold-300 hover:text-gold-700">
                      <Settings className="w-4 h-4" /> Manage
                    </Button>
                  </Link>
                  <Link href={`/${memorial.slug}`} className="w-full" target="_blank">
                    <Button variant="ghost" className="w-full gap-2 hover:bg-gold-50 hover:text-gold-700">
                      <ExternalLink className="w-4 h-4" /> Visit
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="max-w-md mx-auto luxury-card p-8 border-red-200 bg-red-50/50">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Connection Error</h1>
          <p className="text-red-600 mb-4">
            Unable to connect to the memorial database.
          </p>
          <div className="text-sm bg-white p-3 rounded border border-red-100 text-left overflow-auto">
            <code className="text-red-500">Error: Database connection failed. Please check your Supabase credentials in .env</code>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }
}
