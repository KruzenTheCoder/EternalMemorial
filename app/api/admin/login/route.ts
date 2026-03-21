import { NextResponse } from "next/server";
import { setEmAdminCookieOnResponse } from "@/lib/session-cookie";
import { isDemoAdminCredentials, upsertDemoAdminUser } from "@/lib/demo-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username || body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "").trim();

  if (!isDemoAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const user = await upsertDemoAdminUser();

  const res = NextResponse.json({ ok: true });
  await setEmAdminCookieOnResponse(res, user.id);
  return res;
}
