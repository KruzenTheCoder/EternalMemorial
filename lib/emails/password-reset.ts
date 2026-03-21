import { emailButton, emailShell } from "@/lib/emails/layout";
import { BRAND } from "@/lib/brand";

export function buildPasswordResetEmail(opts: { name: string | null; resetUrl: string }) {
  const greeting = opts.name ? `Hello ${opts.name},` : "Hello,";
  const inner = `
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 16px;">We received a request to reset the password for your ${BRAND.name} account. Tap the button below to choose a new password.</p>
    ${emailButton(opts.resetUrl, "Reset password")}
    <p style="margin:16px 0 0;font-size:14px;color:#78716c;">This link expires in one hour. If you didn’t request a reset, your password will stay the same.</p>
    <p style="margin:20px 0 0;font-size:13px;color:#a8a29e;word-break:break-all;">${opts.resetUrl}</p>
  `;
  return emailShell({
    title: "Reset your password",
    preheader: `Reset your ${BRAND.name} password`,
    innerHtml: inner,
  });
}

export function buildPasswordChangedEmail(opts: { name: string | null }) {
  const greeting = opts.name ? `Hello ${opts.name},` : "Hello,";
  const inner = `
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 16px;">Your ${BRAND.name} password was just changed. If this was you, no further action is needed.</p>
    <p style="margin:0;font-size:14px;color:#78716c;">If you didn’t make this change, please reset your password immediately and contact support.</p>
  `;
  return emailShell({
    title: "Password updated",
    preheader: "Your password was changed",
    innerHtml: inner,
  });
}
