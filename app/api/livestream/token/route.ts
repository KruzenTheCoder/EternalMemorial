import { AccessToken } from "livekit-server-sdk";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { roomName } = await req.json();
  if (!roomName || typeof roomName !== "string") {
    return Response.json({ error: "roomName is required" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const userId = await getCurrentUserId();
  let canPublish = false;

  if (userId) {
    const memorial = await prisma.memorial.findUnique({
      where: { streamKey: roomName },
      select: { userId: true },
    });
    if (memorial?.userId === userId) {
      canPublish = true;
    }
  }

  const participantIdentity = canPublish ? `admin-${userId}` : `viewer-${Date.now()}`;

  const token = new AccessToken(
    apiKey,
    apiSecret,
    { 
      identity: participantIdentity,
      ttl: 60 * 60,
    }
  );

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  });

  return Response.json({ token: await token.toJwt() });
}
