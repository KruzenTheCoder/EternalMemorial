import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

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
