import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";

export async function DELETE(_: Request, { params }: { params: { id: string; mediaId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const result = await prisma.media.deleteMany({
      where: { id: params.mediaId, memorialId: params.id },
    });

    if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
