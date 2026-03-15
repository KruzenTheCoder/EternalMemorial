import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL);
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let prismaStatus: "ok" | "error" = "ok";
  let prismaError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    prismaStatus = "error";
    prismaError = String(error).slice(0, 500);
  }

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
    },
  });
}
