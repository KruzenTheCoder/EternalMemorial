import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email().max(200),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(200),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});
