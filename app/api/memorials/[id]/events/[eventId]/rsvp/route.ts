import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rsvpCreateSchema } from "@/lib/validations";

export async function POST(req: Request, { params }: { params: { id: string; eventId: string } }) {
  try {
    const memorial = await prisma.memorial.findFirst({
      where: { id: params.id, isPublished: true },
      select: { id: true },
    });
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 });

    const event = await prisma.event.findFirst({
      where: { id: params.eventId, memorialId: params.id },
      select: { id: true },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const body = await req.json();
    const parsed = rsvpCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const status = parsed.data.status || "ATTENDING";
    const guestCount = parsed.data.guestCount ?? 1;

    const rsvp = await prisma.rSVP.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        status,
        guestCount,
        memorialId: params.id,
        eventId: params.eventId,
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database unavailable", detail: String(error) }, { status: 503 });
  }
}
