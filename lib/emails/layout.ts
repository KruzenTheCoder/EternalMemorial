/** Shared luxury email frame — works in all major clients (tables + inline styles). */
import { BRAND } from "@/lib/brand";

export function emailShell(opts: { title: string; preheader?: string; innerHtml: string }) {
  const pre = opts.preheader || opts.title;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3eee6;font-family:Georgia,'Times New Roman',serif;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(pre)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#fdfcfa 0%,#f3eee6 100%);padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.08);border:1px solid #e3d8c8;">
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#7a4b1b 0%,#d4af37 35%,#f5efc9 50%,#d4af37 65%,#7a4b1b 100%);"></td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;text-align:center;background:linear-gradient(145deg,#9a6b1a 0%,#d4af37 42%,#b8860b 100%);">
              <p style="margin:0;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.92);">${BRAND.name}</p>
              <h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#fff;font-family:Georgia,serif;text-shadow:0 1px 2px rgba(0,0,0,0.12);">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 36px;color:#292524;font-size:16px;line-height:1.65;">
              ${opts.innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;text-align:center;font-size:12px;color:#78716c;border-top:1px solid #f0e9dc;">
              You received this because of activity on ${BRAND.name}.<br/>
              If this wasn’t you, you can ignore this message.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailButton(href: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px auto;">
    <tr>
      <td style="border-radius:14px;background:linear-gradient(135deg,#a67c1f 0%,#d4af37 45%,#8b6914 100%);box-shadow:0 6px 18px rgba(139,105,20,0.38);">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:system-ui,-apple-system,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:14px;border:1px solid rgba(255,255,255,0.25);">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}
