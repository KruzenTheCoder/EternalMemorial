import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const pathname = req.nextUrl.pathname;

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  return;
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

