import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, isPublished: true },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 });

    const checkin = await prisma.checkIn.create({
      data: {
        name: "A visitor",
        email: null,
        entryType: "CANDLE",
        memorialId: params.id,
      },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}

