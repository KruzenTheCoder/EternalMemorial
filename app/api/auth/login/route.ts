import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations-auth";
import { verifyPassword } from "@/lib/password";
import { setEmAdminCookieOnResponse } from "@/lib/session-cookie";
import { isDemoAdminCredentials, upsertDemoAdminUser } from "@/lib/demo-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const rawEmail = String(body?.email ?? "").trim().toLowerCase();
  const rawPassword = String(body?.password ?? "");
  if (isDemoAdminCredentials(rawEmail, rawPassword)) {
    const user = await upsertDemoAdminUser();
    const res = NextResponse.json({ ok: true });
    await setEmAdminCookieOnResponse(res, user.id);
    return res;
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  await setEmAdminCookieOnResponse(res, user.id);
  return res;
}
