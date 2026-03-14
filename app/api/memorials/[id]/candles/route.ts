import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await prisma.memorial.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 });

    const checkin = await prisma.checkIn.create({
      data: {
        name: "Anonymous",
        email: null,
        memorialId: params.id,
      },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}

