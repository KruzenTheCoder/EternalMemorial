import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getCurrentUserId() {
  try {
    const session = await auth();
    if (session?.user?.id) return session.user.id;
  } catch {
    return null;
  }

  return null;
}
