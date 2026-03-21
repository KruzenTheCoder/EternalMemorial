import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { memorialUpdateSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memorial = await prisma.memorial.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        events: {
          orderBy: { startDate: "asc" },
        },
        program: {
          orderBy: { order: "asc" },
        },
        media: true,
        checkins: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        tributes: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            checkins: true,
            events: true,
            media: true,
            tributes: true,
          },
        },
      },
    });

    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(memorial);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = memorialUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = parsed.data;
    const updated = await prisma.memorial.update({
      where: { id: params.id },
      data: {
        ...(data.firstName ? { firstName: data.firstName } : {}),
        ...(data.lastName ? { lastName: data.lastName } : {}),
        ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
        ...(data.dateOfDeath ? { dateOfDeath: new Date(data.dateOfDeath) } : {}),
        ...(typeof data.obituary !== "undefined" ? { obituary: data.obituary || null } : {}),
        ...(typeof data.profileImage !== "undefined" ? { profileImage: data.profileImage || null } : {}),
        ...(typeof data.coverImage !== "undefined" ? { coverImage: data.coverImage || null } : {}),
        ...(typeof data.streamKey !== "undefined" ? { streamKey: data.streamKey || null } : {}),
        ...(typeof data.isStreaming !== "undefined" ? { isStreaming: Boolean(data.isStreaming) } : {}),
        ...(typeof data.isPublished !== "undefined" ? { isPublished: Boolean(data.isPublished) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
