import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

// Dynamically import StreamBroadcaster with SSR disabled
const StreamBroadcaster = dynamic(
  () => import("@/components/livestream/stream-broadcaster"),
  { ssr: false }
);

export default async function AdminStreamPage({ params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/auth/login");

  const memorial = await prisma.memorial.findUnique({
    where: { id: params.id },
  });

  if (!memorial) notFound();
  if (memorial.userId !== userId) redirect("/dashboard");
  if (!memorial.streamKey) {
    return <div className="p-10 text-center">Please enable streaming and set a room name in settings first.</div>;
  }

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Stream Studio</h1>
          <p className="text-muted-foreground">Broadcasting to: {memorial.firstName} {memorial.lastName}</p>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          LIVE ON AIR
        </div>
      </div>
      
      <div className="h-full border rounded-xl overflow-hidden bg-black shadow-2xl">
        <StreamBroadcaster streamKey={memorial.streamKey} adminName={userId} />
      </div>
    </div>
  );
}
