import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { memorialSchema } from "@/lib/validations";
import { getCurrentUserId } from "@/lib/current-user";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const memorials = await prisma.memorial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true, checkins: true, media: true },
        },
      },
    });

    return NextResponse.json(memorials);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = memorialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slugBase = `${toSlug(data.firstName)}-${toSlug(data.lastName)}`;
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;

    const memorial = await prisma.memorial.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        dateOfDeath: new Date(data.dateOfDeath),
        obituary: data.obituary || null,
        profileImage: data.profileImage || null,
        coverImage: data.coverImage || null,
        streamKey: data.streamKey || null,
        isStreaming: Boolean(data.isStreaming),
        isPublished: Boolean(data.isPublished),
        slug,
        userId,
      },
    });

    return NextResponse.json(memorial, { status: 201 });
  } catch (error) {
    const detail = String(error).slice(0, 300);
    return NextResponse.json({ error: "Database unavailable", detail }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const id = body?.id as string | undefined;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const existing = await prisma.memorial.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates = { ...body };
    delete updates.id;

    const memorial = await prisma.memorial.update({
      where: { id },
      data: {
        ...(updates.firstName ? { firstName: updates.firstName } : {}),
        ...(updates.lastName ? { lastName: updates.lastName } : {}),
        ...(updates.dateOfBirth ? { dateOfBirth: new Date(updates.dateOfBirth) } : {}),
        ...(updates.dateOfDeath ? { dateOfDeath: new Date(updates.dateOfDeath) } : {}),
        ...(typeof updates.obituary !== "undefined" ? { obituary: updates.obituary || null } : {}),
        ...(typeof updates.profileImage !== "undefined" ? { profileImage: updates.profileImage || null } : {}),
        ...(typeof updates.coverImage !== "undefined" ? { coverImage: updates.coverImage || null } : {}),
        ...(typeof updates.streamKey !== "undefined" ? { streamKey: updates.streamKey || null } : {}),
        ...(typeof updates.isStreaming !== "undefined" ? { isStreaming: Boolean(updates.isStreaming) } : {}),
        ...(typeof updates.isPublished !== "undefined" ? { isPublished: Boolean(updates.isPublished) } : {}),
      },
    });

    return NextResponse.json(memorial);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
