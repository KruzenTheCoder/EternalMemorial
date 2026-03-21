import { z } from "zod";

export const memorialSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().or(z.date()),
  dateOfDeath: z.string().or(z.date()),
  obituary: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  streamKey: z.string().max(100).optional().or(z.literal("")),
  isStreaming: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const memorialUpdateSchema = memorialSchema.partial();

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  startDate: z.string().or(z.date()),
  location: z.string().optional(),
});

export const tributeCreateSchema = z.object({
  authorName: z.string().min(1, "Name is required").max(120),
  content: z.string().min(1, "Message is required").max(4000),
});

export const tributeModerationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

export const rsvpCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  guestCount: z.coerce.number().int().min(1).max(20).optional(),
  status: z.enum(["ATTENDING", "MAYBE", "DECLINED"]).optional(),
});

export const mediaCreateSchema = z.object({
  url: z.string().url().max(2000),
  type: z.string().min(1).max(40).optional(),
  caption: z.string().max(500).optional().or(z.literal("")),
});
