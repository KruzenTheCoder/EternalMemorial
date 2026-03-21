import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Supabase: use the connection string from the dashboard without mixing hosts.
 * - Direct (migrations / long-lived): db.<project>.supabase.co:5432 — user `postgres`
 * - Pooler transaction (serverless / Prisma): *.pooler.supabase.com:6543 — user `postgres.<project-ref>`
 *
 * Prefer DATABASE_URL in .env so it matches prisma/schema.prisma. SUPABASE_DATABASE_URL is optional fallback.
 */
function normalizeDatabaseUrl(input: string) {
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();
    const isPooler = host.endsWith(".pooler.supabase.com");
    const isDirectDb = host.endsWith(".supabase.co") && host.startsWith("db.");

    if (isDirectDb || isPooler) {
      if (!url.searchParams.has("sslmode")) {
        url.searchParams.set("sslmode", "require");
      }
    }

    if (isPooler && url.port === "6543") {
      if (!url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
      if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
    }

    return url.toString();
  } catch {
    return input;
  }
}

const rawDatabaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.SUPABASE_DATABASE_URL?.trim();
const databaseUrl = rawDatabaseUrl ? normalizeDatabaseUrl(rawDatabaseUrl) : undefined;

const prismaClient = () =>
  new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        }
      : undefined
  );

export const prisma = globalForPrisma.prisma ?? prismaClient();

globalForPrisma.prisma = prisma;
