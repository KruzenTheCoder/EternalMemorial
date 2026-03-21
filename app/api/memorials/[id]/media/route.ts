import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { mediaCreateSchema } from "@/lib/validations";

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
    const parsed = mediaCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        url: parsed.data.url,
        type: parsed.data.type?.trim() || "PHOTO",
        caption: parsed.data.caption?.trim() || null,
        memorialId: params.id,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
