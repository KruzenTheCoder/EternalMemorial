export async function getCurrentUserId() {
  const { prisma } = await import("@/lib/prisma");

  const email = process.env.ADMIN_EMAIL || process.env.DEMO_USER_EMAIL || "admin@eternalmemory.local";
  const name = process.env.ADMIN_NAME || process.env.DEMO_USER_NAME || "Admin";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  return user.id;
}
