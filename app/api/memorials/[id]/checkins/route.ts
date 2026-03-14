import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await prisma.memorial.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 });

    const data = await req.json();
    if (!data?.name || typeof data.name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const checkin = await prisma.checkIn.create({
      data: {
        name: data.name,
        email: typeof data.email === "string" ? data.email : null,
        memorialId: params.id,
      },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
