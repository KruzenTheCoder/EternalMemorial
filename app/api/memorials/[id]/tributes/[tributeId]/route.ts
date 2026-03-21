import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { tributeModerationSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; tributeId: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, userId },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = tributeModerationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.tribute.updateMany({
      where: { id: params.tributeId, memorialId: params.id },
      data: { status: parsed.data.status },
    });

    if (updated.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const tribute = await prisma.tribute.findUnique({ where: { id: params.tributeId } });
    return NextResponse.json(tribute);
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
