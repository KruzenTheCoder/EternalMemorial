import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const memorial = await prisma.memorial.findUnique({
      where: { id: params.id },
    });

    if (!memorial || memorial.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, type, time, description, speakerName, order } = body;

    const nextOrder = typeof order === "number" ? order : parseInt(String(order), 10);

    const programItem = await prisma.programItem.create({
      data: {
        title,
        type,
        time,
        description,
        speakerName,
        order: Number.isFinite(nextOrder) ? nextOrder : 1,
        memorialId: params.id,
      },
    });

    return NextResponse.json(programItem);
  } catch (error) {
    console.error("[PROGRAM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const programItems = await prisma.programItem.findMany({
      where: { memorialId: params.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(programItems);
  } catch (error) {
    console.error("[PROGRAM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
