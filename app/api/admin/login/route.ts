import { NextResponse } from "next/server";

export const runtime = "nodejs";

function base64UrlEncode(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username || "").trim().toLowerCase();
  const password = String(body?.password || "").trim();

  if (username !== "admin" || password !== "admin") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "unsafe-dev-secret-change-me";
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  const cryptoMod = await import("crypto");
  const sig = cryptoMod
    .createHmac("sha256", secret)
    .update(String(expiresAt))
    .digest();

  const value = `${expiresAt}.${base64UrlEncode(sig)}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set("em_admin", value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

