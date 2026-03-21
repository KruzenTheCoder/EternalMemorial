import type { NextResponse } from "next/server";
import { signAdminSession } from "@/lib/em-admin-cookie";

const COOKIE_NAME = "em_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

export async function setEmAdminCookieOnResponse(res: NextResponse, userId: string) {
  const value = await signAdminSession(userId);
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
