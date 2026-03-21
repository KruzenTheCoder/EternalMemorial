import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations-auth";
import { buildPasswordResetEmail } from "@/lib/emails/password-reset";
import { sendTransactionalEmail } from "@/lib/mail";
import { BRAND } from "@/lib/brand";

export const runtime = "nodejs";

function appOrigin() {
  const u = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return u.replace(/\/$/, "");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.passwordHash) {
    const raw = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(raw).digest("hex");

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${appOrigin()}/auth/reset-password?token=${encodeURIComponent(raw)}`;
    const html = buildPasswordResetEmail({ name: user.name, resetUrl });
    await sendTransactionalEmail({
      to: email,
      subject: `Reset your ${BRAND.name} password`,
      html,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, we sent reset instructions.",
  });
}
