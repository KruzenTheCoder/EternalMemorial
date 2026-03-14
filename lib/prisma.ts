import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function normalizeDatabaseUrl(input: string) {
  try {
    const url = new URL(input);
    const isSupabasePooler = url.hostname.endsWith(".pooler.supabase.com");

    if (isSupabasePooler) {
      if (!url.port || url.port === "5432") url.port = "6543";
      if (!url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
      if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
      if (!url.searchParams.has("sslmode")) url.searchParams.set("sslmode", "require");
    }

    return url.toString();
  } catch {
    return input;
  }
}

const rawDatabaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
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

export const prisma = globalForPrisma.prisma || prismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
