import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const adminEmail = process.env.ADMIN_EMAIL || process.env.DEMO_USER_EMAIL || "demo@eternalmemory.local";
const adminName = process.env.ADMIN_NAME || process.env.DEMO_USER_NAME || "Admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const username = parsed.data.username.trim().toLowerCase();
        const password = parsed.data.password.trim();
        if (username !== "admin" || password !== "admin") return null;

        const user = await prisma.user.upsert({
          where: { email: adminEmail },
          update: { name: adminName },
          create: { email: adminEmail, name: adminName },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name || adminName,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "unsafe-dev-secret-change-me",
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }
      return session;
    },
  },
});
