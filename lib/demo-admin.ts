import { prisma } from "@/lib/prisma";

export function isDemoAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === "admin" && password === "admin";
}

export async function upsertDemoAdminUser() {
  const email = process.env.ADMIN_EMAIL || process.env.DEMO_USER_EMAIL || "demo@eternalmemory.local";
  const name = process.env.ADMIN_NAME || process.env.DEMO_USER_NAME || "Admin";
  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });
}
