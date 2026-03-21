-- Run in Supabase → SQL Editor if `npx prisma db push` is not an option.
-- Safe to run more than once.

ALTER TABLE "CheckIn" ADD COLUMN IF NOT EXISTS "entryType" TEXT NOT NULL DEFAULT 'GUESTBOOK';

UPDATE "CheckIn"
SET "entryType" = 'CANDLE'
WHERE "email" IS NULL
  AND "name" IN ('Anonymous', 'A visitor');
