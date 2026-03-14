import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/dashboard";
  const error = url.searchParams.get("error") || "";

  const redirectUrl = new URL("/auth/login", url.origin);
  if (error) redirectUrl.searchParams.set("error", error);
  redirectUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(redirectUrl);
}
