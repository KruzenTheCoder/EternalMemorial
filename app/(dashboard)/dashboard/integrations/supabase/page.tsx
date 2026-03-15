import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Status = "ok" | "error" | "not_configured";

function StatusPill({ status }: { status: Status }) {
  const className =
    status === "ok"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : status === "error"
        ? "bg-red-100 text-red-700 border-red-300"
        : "bg-amber-100 text-amber-700 border-amber-300";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}>{status}</span>;
}

export default async function SupabaseIntegrationPage() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasPublicUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  let prismaStatus: Status = "not_configured";
  let prismaError = "";
  if (hasDatabaseUrl) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      prismaStatus = "ok";
    } catch (error) {
      prismaStatus = "error";
      prismaError = String(error);
    }
  }

  const supabaseStatus: Status = hasPublicUrl ? "ok" : "not_configured";

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Supabase Integration</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-5 space-y-3 bg-card">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Prisma Database</p>
          <StatusPill status={prismaStatus} />
          {prismaError ? <p className="text-sm text-red-600 break-words">{prismaError}</p> : null}
        </div>
        <div className="rounded-lg border p-5 space-y-3 bg-card">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Supabase Client</p>
          <StatusPill status={supabaseStatus} />
          <p className="text-sm text-muted-foreground">
            Uses <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> for client features.
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6 bg-card space-y-4">
        <h2 className="text-xl font-semibold">Environment Checklist</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <p>DATABASE_URL or SUPABASE_DATABASE_URL: {hasDatabaseUrl ? "✓" : "✗"}</p>
          <p>NEXT_PUBLIC_SUPABASE_URL: {hasPublicUrl ? "✓" : "✗"}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasAnon ? "✓" : "✗"}</p>
        </div>
      </div>

      <div className="rounded-lg border p-6 bg-card space-y-3">
        <h2 className="text-xl font-semibold">Next Step</h2>
        <p className="text-sm text-muted-foreground">
          On Vercel, set <code>DATABASE_URL</code> and redeploy. For client SDK features, also set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          API health endpoint: <code>/api/backend/health</code>
        </p>
      </div>
    </div>
  );
}
