import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations-auth";
import { hashPassword } from "@/lib/password";
import { buildPasswordChangedEmail } from "@/lib/emails/password-reset";
import { sendTransactionalEmail } from "@/lib/mail";
import { BRAND } from "@/lib/brand";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);

  const html = buildPasswordChangedEmail({ name: record.user.name });
  await sendTransactionalEmail({
    to: record.user.email,
    subject: `Your ${BRAND.name} password was changed`,
    html,
  });

  return NextResponse.json({ ok: true });
}
