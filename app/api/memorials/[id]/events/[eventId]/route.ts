import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, memorialId: params.id },
      select: { id: true },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    await prisma.event.delete({ where: { id: params.eventId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
