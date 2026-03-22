import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeMemorialSlug } from "@/lib/memorial-slug";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const slug = normalizeMemorialSlug(params.slug);
  if (!slug) {
    return NextResponse.json({ exists: false, slug: params.slug, error: "Invalid slug" }, { status: 400 });
  }
  try {
    const memorial = await prisma.memorial.findFirst({
      where: { slug: { equals: slug, mode: "insensitive" } },
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

