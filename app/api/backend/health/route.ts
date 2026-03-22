import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUrlsConflict, getDatabaseFingerprintFromEnv } from "@/lib/db-fingerprint";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL);
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let prismaStatus: "ok" | "error" = "ok";
  let prismaError: string | null = null;
  let memorialCount: number | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    const row = await prisma.memorial.count();
    memorialCount = row;
  } catch (error) {
    prismaStatus = "error";
    prismaError = String(error).slice(0, 500);
  }

  const dbFingerprint = getDatabaseFingerprintFromEnv();
  const urlsPointToDifferentHosts = databaseUrlsConflict();

  return NextResponse.json({
    backend: "supabase+prisma",
    prisma: { status: prismaStatus, error: prismaError },
    supabase: {
      status: hasSupabaseUrl && hasAnonKey ? "configured" : "not_configured",
    },
    env: {
      hasDatabaseUrl,
      hasSupabaseUrl,
      hasAnonKey,
      /** If true, DATABASE_URL wins in code — update it, not only SUPABASE_DATABASE_URL. */
      urlsPointToDifferentHosts,
    },
    /** Compare hostname + projectRef to your Supabase project (no secrets). */
    database: {
      ...dbFingerprint,
      memorialCount,
    },
  });
}
