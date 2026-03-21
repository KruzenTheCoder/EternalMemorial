import { AccessToken } from "livekit-server-sdk";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let body: { roomName?: unknown; identity?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const roomName = typeof body.roomName === "string" ? body.roomName.trim() : "";
  if (!roomName) {
    return Response.json({ error: "roomName is required" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const memorial = await prisma.memorial.findFirst({
    where: { streamKey: roomName },
    select: { id: true, userId: true, isPublished: true },
  });

  if (!memorial) {
    return Response.json({ error: "Stream not available" }, { status: 404 });
  }

  const adminUserId = await getCurrentUserId();
  const isOwner = Boolean(adminUserId && memorial.userId === adminUserId);

  if (!memorial.isPublished && !isOwner) {
    return Response.json({ error: "Stream not available" }, { status: 404 });
  }

  const canPublish = isOwner;

  const rawIdentity = typeof body.identity === "string" ? body.identity.trim() : "";
  const safeViewerIdentity =
    rawIdentity && rawIdentity.length <= 120 && /^[\w.-]+$/.test(rawIdentity) ? rawIdentity : `viewer-${Date.now()}`;

  const participantIdentity = canPublish ? `broadcaster-${adminUserId}` : safeViewerIdentity;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    ttl: 60 * 60,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  });

  return Response.json({ token: await token.toJwt() });
}
