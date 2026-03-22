/**
 * Non-secret hints parsed from DATABASE_URL so you can confirm Vercel ↔ Supabase match
 * (same pooler host + project ref as in the Supabase dashboard).
 */
export function getDatabaseFingerprintFromEnv() {
  const raw =
    process.env.DATABASE_URL?.trim() ||
    process.env.SUPABASE_DATABASE_URL?.trim() ||
    "";
  if (!raw) {
    return { configured: false as const, source: null as string | null };
  }

  const source = process.env.DATABASE_URL?.trim() ? "DATABASE_URL" : "SUPABASE_DATABASE_URL";

  try {
    const u = new URL(raw);
    const user = decodeURIComponent(u.username || "");
    let projectRef: string | null = null;
    if (user.startsWith("postgres.") && user.length > "postgres.".length) {
      projectRef = user.slice("postgres.".length);
    }
    return {
      configured: true as const,
      source,
      hostname: u.hostname,
      port: u.port || (u.protocol === "postgresql:" || u.protocol === "postgres:" ? "5432" : ""),
      poolerStyleUser: user.includes("."),
      projectRef,
    };
  } catch {
    return { configured: true as const, source, parseError: true as const };
  }
}

export function databaseUrlsConflict(): boolean {
  const a = process.env.DATABASE_URL?.trim();
  const b = process.env.SUPABASE_DATABASE_URL?.trim();
  if (!a || !b) return false;
  try {
    return new URL(a).hostname !== new URL(b).hostname;
  } catch {
    return false;
  }
}
