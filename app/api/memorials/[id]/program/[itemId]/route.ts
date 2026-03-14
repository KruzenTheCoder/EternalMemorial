import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; itemId: string } }
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

    const programItem = await prisma.programItem.delete({
      where: { id: params.itemId },
    });

    return NextResponse.json(programItem);
  } catch (error) {
    console.error("[PROGRAM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
