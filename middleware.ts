import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function base64UrlToUint8Array(str: string) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) arr[i] = raw.charCodeAt(i);
  return arr;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a[i] ^ b[i];
  return out === 0;
}

async function isAdmin(req: NextRequest) {
  const cookie = req.cookies.get("em_admin")?.value;
  if (!cookie) return false;

  const [expRaw, sigRaw] = cookie.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return false;
  if (!sigRaw) return false;

  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "unsafe-dev-secret-change-me";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(exp))));
  const provided = base64UrlToUint8Array(sigRaw);
  return constantTimeEqual(expected, provided);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const protectedPage = pathname.startsWith("/dashboard");
  const protectedApi = pathname.startsWith("/api/memorials") || pathname.startsWith("/api/livestream/token");
  if (!protectedPage && !protectedApi) return NextResponse.next();

  const ok = await isAdmin(req);
  if (ok) return NextResponse.next();

  if (protectedApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/memorials/:path*", "/api/livestream/token"],
};

