/**
 * Public memorial URLs use the slug segment as stored in Postgres (usually lowercase).
 * Normalizes encoding, whitespace, and case so lookups match reliably.
 */
export function normalizeMemorialSlug(raw: string | undefined | null): string {
  if (raw == null) return "";
  const trimmed = String(raw).trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed).trim().toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}
