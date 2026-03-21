import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  try {
    const memorial = await prisma.memorial.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        isPublished: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        userId: true,
      },
    });

    if (!memorial) {
      return NextResponse.json({ exists: false, slug }, { status: 404 });
    }

    return NextResponse.json({
      exists: true,
      slug: memorial.slug,
      isPublished: memorial.isPublished,
      name: `${memorial.firstName} ${memorial.lastName}`.trim(),
      createdAt: memorial.createdAt,
      userId: memorial.userId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        exists: false,
        slug,
        error: "Database unavailable",
        detail: String(error).slice(0, 300),
      },
      { status: 503 }
    );
  }
}

