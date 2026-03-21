import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Guest book vs virtual candles. Prefers `CheckIn.entryType` when the column exists;
 * falls back to name/email heuristics for databases that have not run `prisma db push` yet.
 */
export async function getGuestAndCandleCounts(memorialId: string): Promise<[guestCount: number, candleCount: number]> {
  try {
    const [guestCount, candleCount] = await Promise.all([
      prisma.checkIn.count({ where: { memorialId, entryType: "GUESTBOOK" } }),
      prisma.checkIn.count({ where: { memorialId, entryType: "CANDLE" } }),
    ]);
    return [guestCount, candleCount];
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const missingEntryTypeColumn =
      /entryType/i.test(msg) ||
      /42703/i.test(msg) ||
      /column .* does not exist/i.test(msg);

    if (!missingEntryTypeColumn) throw e;

    const rows = await prisma.$queryRaw<Array<{ guest: bigint; candle: bigint }>>(
      Prisma.sql`
        SELECT
          COUNT(*) FILTER (
            WHERE NOT ("email" IS NULL AND "name" IN ('Anonymous', 'A visitor'))
          ) AS guest,
          COUNT(*) FILTER (
            WHERE "email" IS NULL AND "name" IN ('Anonymous', 'A visitor')
          ) AS candle
        FROM "CheckIn"
        WHERE "memorialId" = ${memorialId}
      `
    );
    const row = rows[0];
    return [
      row?.guest != null ? Number(row.guest) : 0,
      row?.candle != null ? Number(row.candle) : 0,
    ];
  }
}
