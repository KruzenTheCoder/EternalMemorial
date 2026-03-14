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
