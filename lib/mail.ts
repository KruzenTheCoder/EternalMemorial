import { Resend } from "resend";
import { BRAND } from "@/lib/brand";

const fromDefault = process.env.EMAIL_FROM || `${BRAND.name} <onboarding@resend.dev>`;

export async function sendTransactionalEmail(opts: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("\n[email skipped — set RESEND_API_KEY]\nTo:", opts.to, "\nSubject:", opts.subject, "\n");
    }
    return { ok: false as const, skipped: true };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromDefault,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    console.error("[Resend]", error);
    return { ok: false as const, error: String(error) };
  }

  return { ok: true as const };
}
