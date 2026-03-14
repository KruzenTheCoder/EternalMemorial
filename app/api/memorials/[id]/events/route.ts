import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { eventSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const events = await prisma.event.findMany({
      where: { memorialId: params.id },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const event = await prisma.event.create({
      data: {
        title: data.title,
        type: data.type,
        location: data.location || null,
        startDate: new Date(data.startDate),
        memorialId: params.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
