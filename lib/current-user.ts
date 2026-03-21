import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { parseAdminSession } from "@/lib/em-admin-cookie";

function adminBootstrapEmail() {
  return process.env.ADMIN_EMAIL || process.env.DEMO_USER_EMAIL || "demo@eternalmemory.local";
}

export async function getCurrentUserId() {
  const cookie = cookies().get("em_admin")?.value;
  const session = await parseAdminSession(cookie);
  if (!session.valid) return null;

  if ("userId" in session && session.userId) {
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true } });
    return user?.id ?? null;
  }

  if ("legacy" in session && session.legacy) {
    const email = adminBootstrapEmail();
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return user?.id ?? null;
  }

  return null;
}
