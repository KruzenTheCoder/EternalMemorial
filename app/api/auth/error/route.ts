import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/dashboard";

  const redirectUrl = new URL("/auth/login", url.origin);
  redirectUrl.searchParams.set("error", "1");
  redirectUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(redirectUrl);
}

