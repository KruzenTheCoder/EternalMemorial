function base64UrlToUint8Array(str: string) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) arr[i] = raw.charCodeAt(i);
  return arr;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a[i]! ^ b[i]!;
  return out === 0;
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "unsafe-dev-secret-change-me";
}

async function hmacSha256(message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

/** New sessions: exp.uidB64.signature (user-bound). */
export async function signAdminSession(userId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const uidB64 = uint8ArrayToBase64Url(new TextEncoder().encode(userId));
  const payload = `${exp}.${uidB64}`;
  const sig = await hmacSha256(payload);
  const sigB64 = uint8ArrayToBase64Url(sig);
  return `${payload}.${sigB64}`;
}

export type ParsedSession =
  | { valid: true; userId: string }
  | { valid: true; legacy: true; userId?: undefined }
  | { valid: false };

export async function parseAdminSession(cookieValue: string | undefined): Promise<ParsedSession> {
  if (!cookieValue) return { valid: false };

  try {
    const parts = cookieValue.split(".");
    const exp = Number(parts[0]);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return { valid: false };

    if (parts.length === 3) {
      const [, uidB64, sigRaw] = parts;
      if (!uidB64 || !sigRaw) return { valid: false };
      const payload = `${parts[0]}.${uidB64}`;
      const expected = await hmacSha256(payload);
      const provided = base64UrlToUint8Array(sigRaw);
      if (!constantTimeEqual(expected, provided)) return { valid: false };
      const userId = new TextDecoder().decode(base64UrlToUint8Array(uidB64));
      if (!userId) return { valid: false };
      return { valid: true, userId };
    }

    if (parts.length === 2) {
      const sigRaw = parts[1];
      if (!sigRaw) return { valid: false };
      const expected = await hmacSha256(String(exp));
      const provided = base64UrlToUint8Array(sigRaw);
      if (!constantTimeEqual(expected, provided)) return { valid: false };
      return { valid: true, legacy: true };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function verifyEmAdminCookie(cookieValue: string | undefined): Promise<boolean> {
  const p = await parseAdminSession(cookieValue);
  return p.valid;
}
