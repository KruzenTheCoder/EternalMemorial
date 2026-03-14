import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  let prismaStatus: "ok" | "error" = "ok";
  let prismaError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    prismaStatus = "error";
    prismaError = String(error).slice(0, 500);
  }

  let supabaseStatus: "configured" | "not_configured" | "error" = "not_configured";
  let supabaseError: string | null = null;
  const supabase = getSupabaseAdmin();
  if (supabase) {
    supabaseStatus = "configured";
    const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      supabaseStatus = "error";
      supabaseError = error.message;
    }
  }

  return NextResponse.json({
    backend: "supabase+prisma",
    prisma: { status: prismaStatus, error: prismaError },
    supabase: { status: supabaseStatus, error: supabaseError },
  });
}
