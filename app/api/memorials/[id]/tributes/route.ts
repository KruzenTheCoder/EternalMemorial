import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { tributeCreateSchema } from "@/lib/validations";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, isPublished: true },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 });

    const body = await req.json();
    const parsed = tributeCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const tribute = await prisma.tribute.create({
      data: {
        authorName: parsed.data.authorName.trim(),
        content: parsed.data.content.trim(),
        memorialId: params.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(tribute, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
