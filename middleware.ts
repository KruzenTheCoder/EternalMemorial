import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEmAdminCookie } from "@/lib/em-admin-cookie";

function isPublicMemorialApi(pathname: string, method: string) {
  if (method !== "POST") return false;
  return (
    /^\/api\/memorials\/[^/]+\/checkins$/.test(pathname) ||
    /^\/api\/memorials\/[^/]+\/candles$/.test(pathname) ||
    /^\/api\/memorials\/[^/]+\/tributes$/.test(pathname) ||
    /^\/api\/memorials\/[^/]+\/events\/[^/]+\/rsvp$/.test(pathname)
  );
}

function isPublicLivestreamToken(pathname: string, method: string) {
  return pathname === "/api/livestream/token" && method === "POST";
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  if (isPublicMemorialApi(pathname, method) || isPublicLivestreamToken(pathname, method)) {
    return NextResponse.next();
  }

  const protectedPage = pathname.startsWith("/dashboard");
  const protectedApi = pathname.startsWith("/api/memorials") || pathname.startsWith("/api/livestream/token");
  if (!protectedPage && !protectedApi) return NextResponse.next();

  const ok = await verifyEmAdminCookie(req.cookies.get("em_admin")?.value);
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
